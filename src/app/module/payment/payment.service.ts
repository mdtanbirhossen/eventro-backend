import status from "http-status";
import { prisma } from "../../lib/prisma";
import AppError from "../../errorHelpers/AppError";
import {
    EventFeeType,
    EventStatus,
    EventVisibility,
    InvitationStatus,
    NotificationType,
    ParticipantStatus,
    PaymentProvider,
    PaymentStatus,
} from "../../../generated/prisma/enums";
import { SSLCommerzService } from "../sslcommerz/sslcommerz.service";
import { envVars } from "../../config/env";
import { ICreatePaymentPayload } from "./payment.interface";

const createPaymentSession = async (
    userId: string,
    payload: ICreatePaymentPayload,
) => {
    const event = await prisma.event.findFirst({
        where: {
            id: payload.eventId,
            isDeleted: false,
            status: EventStatus.PUBLISHED,
        },
    });

    if (!event) throw new AppError(status.NOT_FOUND, "Event not found");

    if (
        event.feeType !== EventFeeType.PAID ||
        Number(event.registrationFee) <= 0
    ) {
        throw new AppError(
            status.BAD_REQUEST,
            "This event is free. Payment not required",
        );
    }

    // if invitation payment
    if (payload.invitationId) {
        const invitation = await prisma.invitation.findUnique({
            where: { id: payload.invitationId },
        });

        if (!invitation)
            throw new AppError(status.NOT_FOUND, "Invitation not found");

        if (invitation.invitedUserId !== userId) {
            throw new AppError(
                status.FORBIDDEN,
                "This invitation is not for you",
            );
        }

        if (invitation.status !== InvitationStatus.PENDING) {
            throw new AppError(
                status.BAD_REQUEST,
                "Invitation already responded",
            );
        }
    }

    const transactionId = `TXN-${Date.now()}-${Math.floor(Math.random() * 9999)}`;

    const payment = await prisma.payment.create({
        data: {
            amount: event.registrationFee,
            currency: event.currency,
            status: PaymentStatus.UNPAID,
            provider: PaymentProvider.SSLCOMMERZ,
            transactionId,
            userId,
            eventId: event.id,
        },
    });

    const initResponse = await SSLCommerzService.sslcommerzInitPayment({
        total_amount: Number(event.registrationFee),
        currency: event.currency,
        tran_id: transactionId,

        success_url: `${envVars.SSLCOMMERZ.SUCCESS_URL}?tran_id=${transactionId}`,
        fail_url: envVars.SSLCOMMERZ.FAIL_URL,
        cancel_url: envVars.SSLCOMMERZ.CANCEL_URL,
        ipn_url: envVars.SSLCOMMERZ.IPN_URL,

        cus_name: "Planora User",
        cus_email: "user@email.com",
        cus_add1: "Dhaka",
        cus_city: "Dhaka",
        cus_postcode: "1207",
        cus_country: "Bangladesh",
        cus_phone: "01700000000",

        product_name: event.title,
        product_category: "Event",
        product_profile: "general",
    });

    if (!initResponse?.GatewayPageURL) {
        throw new AppError(
            status.BAD_REQUEST,
            "SSLCommerz payment session failed",
        );
    }

    await prisma.payment.update({
        where: { id: payment.id },
        data: { paymentUrl: initResponse.GatewayPageURL },
    });

    // link invitation if exists
    if (payload.invitationId) {
        await prisma.invitation.update({
            where: { id: payload.invitationId },
            data: { paymentId: payment.id },
        });
    }

    return {
        paymentId: payment.id,
        transactionId,
        paymentUrl: initResponse.GatewayPageURL,
    };
};

// SUCCESS CALLBACK
const sslcommerzSuccess = async (query: any) => {
    const transactionId = query.tran_id;

    if (!transactionId) {
        throw new AppError(status.BAD_REQUEST, "Invalid SSLCommerz callback");
    }

    const payment = await prisma.payment.findUnique({
        where: { transactionId },
        include: { event: true },
    });

    if (!payment) {
        throw new AppError(status.NOT_FOUND, "Payment record not found");
    }

    // ✅ prevent duplicate success calls
    if (payment.status === PaymentStatus.PAID) {
        return payment;
    }

    const updated = await prisma.$transaction(async (tx) => {
        const updatedPayment = await tx.payment.update({
            where: { id: payment.id },
            data: {
                status: PaymentStatus.PAID,
                paidAt: new Date(),
                gatewayResponse: query,
            },
        });

        // ✅ public paid => auto approve, private paid => pending
        const autoApprove = payment.event.visibility === EventVisibility.PUBLIC;

        await tx.eventParticipant.upsert({
            where: {
                eventId_userId: {
                    eventId: payment.eventId,
                    userId: payment.userId,
                },
            },
            create: {
                eventId: payment.eventId,
                userId: payment.userId,
                status: autoApprove
                    ? ParticipantStatus.APPROVED
                    : ParticipantStatus.PENDING,
                joinedAt: autoApprove ? new Date() : undefined,
                paymentId: payment.id,
            },
            update: {
                status: autoApprove
                    ? ParticipantStatus.APPROVED
                    : ParticipantStatus.PENDING,
                joinedAt: autoApprove ? new Date() : undefined,
                paymentId: payment.id,
            },
        });

        // notification for payer
        await tx.notification.create({
            data: {
                userId: payment.userId,
                type: NotificationType.PAYMENT_SUCCESS,
                title: "Payment Successful",
                message: `Your payment for "${payment.event.title}" was successful.`,
                metadata: {
                    eventId: payment.eventId,
                    paymentId: payment.id,
                },
            },
        });

        // notification for event owner (only if pending approval)
        if (!autoApprove) {
            await tx.notification.create({
                data: {
                    userId: payment.event.ownerId,
                    type: NotificationType.JOIN_REQUEST,
                    title: "New Paid Join Request",
                    message: `A user has paid and requested to join "${payment.event.title}".`,
                    metadata: {
                        eventId: payment.eventId,
                        paymentId: payment.id,
                        userId: payment.userId,
                    },
                },
            });
        }

        return updatedPayment;
    });

    return updated;
};

const sslcommerzFail = async (query: any) => {
    const transactionId = query.tran_id;

    if (!transactionId)
        throw new AppError(status.BAD_REQUEST, "Invalid callback");

    const payment = await prisma.payment.findUnique({
        where: { transactionId },
    });

    if (!payment) throw new AppError(status.NOT_FOUND, "Payment not found");

    await prisma.payment.update({
        where: { id: payment.id },
        data: {
            status: PaymentStatus.FAILED,
            gatewayResponse: query,
        },
    });

    await prisma.notification.create({
        data: {
            userId: payment.userId,
            type: NotificationType.PAYMENT_FAILED,
            title: "Payment Failed",
            message: "Your payment attempt has failed.",
            metadata: {
                eventId: payment.eventId,
                paymentId: payment.id,
            },
        },
    });

    return { message: "Payment failed" };
};

const sslcommerzCancel = async (query: any) => {
    const transactionId = query.tran_id;

    if (!transactionId)
        throw new AppError(status.BAD_REQUEST, "Invalid callback");

    const payment = await prisma.payment.findUnique({
        where: { transactionId },
    });

    if (!payment) throw new AppError(status.NOT_FOUND, "Payment not found");

    await prisma.payment.update({
        where: { id: payment.id },
        data: {
            status: PaymentStatus.CANCELLED,
            gatewayResponse: query,
        },
    });

    return { message: "Payment cancelled" };
};

const getMyPayments = async (userId: string) => {
    return prisma.payment.findMany({
        where: { userId },
        include: {
            event: { select: { id: true, title: true } },
        },
        orderBy: { createdAt: "desc" },
    });
};

const getPaymentByTransactionId = async (transactionId: string) => {
    const payment = await prisma.payment.findUnique({
        where: { transactionId },
        include: {
            user: true,
            event: true,
        },
    });

    if (!payment) {
        throw new AppError(status.NOT_FOUND, "Payment not found");
    }

    return payment;
};

const getAllPaymentsAdmin = async () => {
    return prisma.payment.findMany({
        include: {
            user: { select: { id: true, name: true, email: true } },
            event: { select: { id: true, title: true } },
        },
        orderBy: { createdAt: "desc" },
    });
};

export const PaymentService = {
    createPaymentSession,
    sslcommerzSuccess,
    sslcommerzFail,
    sslcommerzCancel,
    getMyPayments,
    getAllPaymentsAdmin,
    getPaymentByTransactionId
};
