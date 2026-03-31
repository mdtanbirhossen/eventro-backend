import { Request, Response } from "express";
import status from "http-status";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { PaymentService } from "./payment.service";

const createPaymentSession = catchAsync(async (req: Request, res: Response) => {
    const result = await PaymentService.createPaymentSession(
        req.user.userId,
        req.body,
    );

    sendResponse(res, {
        httpStatusCode: status.CREATED,
        success: true,
        message: "Payment session created successfully",
        data: result,
    });
});

const sslcommerzSuccess = catchAsync(async (req: Request, res: Response) => {
    await PaymentService.sslcommerzSuccess(req.query);

    res.redirect("http://localhost:3000/payment-success");
});

const sslcommerzFail = catchAsync(async (req: Request, res: Response) => {
    await PaymentService.sslcommerzFail(req.query);

    res.redirect("http://localhost:3000/payment-failed");
});

const sslcommerzCancel = catchAsync(async (req: Request, res: Response) => {
    await PaymentService.sslcommerzCancel(req.query);

    res.redirect("http://localhost:3000/payment-cancelled");
});

const getMyPayments = catchAsync(async (req: Request, res: Response) => {
    const result = await PaymentService.getMyPayments(req.user.userId);

    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Payments fetched successfully",
        data: result,
    });
});

const getAllPaymentsAdmin = catchAsync(async (req: Request, res: Response) => {
    const result = await PaymentService.getAllPaymentsAdmin();

    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "All payments fetched successfully",
        data: result,
    });
});

export const PaymentController = {
    createPaymentSession,
    sslcommerzSuccess,
    sslcommerzFail,
    sslcommerzCancel,
    getMyPayments,
    getAllPaymentsAdmin,
};
