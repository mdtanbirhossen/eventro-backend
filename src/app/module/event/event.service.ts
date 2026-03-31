import status from "http-status";
import {
    EventFeeType,
    EventStatus,
    EventVisibility,
    ParticipantStatus,
    InvitationStatus,
    NotificationType,
} from "../../../generated/prisma/enums";
import AppError from "../../errorHelpers/AppError";
import { prisma } from "../../lib/prisma";
import { TCreateEvent, TEventQuery, TUpdateEvent } from "./event.interface";
import { Prisma } from "../../../generated/prisma/client";

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

const generateSlug = (title: string): string => {
    return (
        title
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-") +
        "-" +
        Date.now()
    );
};

const assertEventOwner = async (eventId: string, userId: string) => {
    const event = await prisma.event.findFirst({
        where: { id: eventId, isDeleted: false },
    });

    if (!event) throw new AppError(status.NOT_FOUND, "Event not found");

    if (event.ownerId !== userId) {
        throw new AppError(
            status.FORBIDDEN,
            "You are not the owner of this event",
        );
    }

    return event;
};

// send notification helper
const sendNotification = async (
    tx: Prisma.TransactionClient,
    userId: string,
    type: NotificationType,
    title: string,
    message: string,
    metadata?: any,
) => {
    await tx.notification.create({
        data: {
            userId,
            type,
            title,
            message,
            metadata,
        },
    });
};

// ─────────────────────────────────────────────
// EVENT CRUD
// ─────────────────────────────────────────────

const createEvent = async (ownerId: string, payload: TCreateEvent) => {
    const slug = generateSlug(payload.title);

    const event = await prisma.event.create({
        data: {
            ...payload,
            slug,
            ownerId,
            date: new Date(payload.date),
            endDate: payload.endDate ? new Date(payload.endDate) : undefined,
            registrationFee: payload.registrationFee ?? 0,
        },
        include: {
            owner: { select: { id: true, name: true, image: true } },
            category: true,
        },
    });

    return event;
};

const getAllEvents = async (query: TEventQuery) => {
    const {
        search,
        visibility,
        feeType,
        status: eventStatus,
        categoryId,
        page = "1",
        limit = "10",
        sortBy = "date",
        sortOrder = "asc",
    } = query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    const where: any = {
        isDeleted: false,
        status: eventStatus ?? EventStatus.PUBLISHED,
        ...(visibility && { visibility }),
        ...(feeType && { feeType }),
        ...(categoryId && { categoryId }),
        ...(search && {
            OR: [
                { title: { contains: search, mode: "insensitive" } },
                { owner: { name: { contains: search, mode: "insensitive" } } },
            ],
        }),
    };

    const [events, total] = await Promise.all([
        prisma.event.findMany({
            where,
            skip,
            take,
            orderBy: { [sortBy]: sortOrder },
            include: {
                owner: { select: { id: true, name: true, image: true } },
                category: { select: { id: true, name: true } },
                _count: { select: { participants: true, reviews: true } },
            },
        }),
        prisma.event.count({ where }),
    ]);

    return {
        data: events,
        meta: {
            total,
            page: parseInt(page),
            limit: take,
            totalPages: Math.ceil(total / take),
        },
    };
};

const getEventById = async (eventId: string, requesterId?: string) => {
    const event = await prisma.event.findFirst({
        where: { id: eventId, isDeleted: false },
        include: {
            owner: { select: { id: true, name: true, image: true } },
            category: true,
            featuredEvent: true,
            _count: { select: { participants: true, reviews: true } },
            reviews: {
                where: { isDeleted: false },
                orderBy: { createdAt: "desc" },
                take: 5,
                include: {
                    user: { select: { id: true, name: true, image: true } },
                },
            },
        },
    });

    if (!event) throw new AppError(status.NOT_FOUND, "Event not found");

    // Private event: only owner or approved participant can view full details
    if (
        event.visibility === EventVisibility.PRIVATE &&
        event.ownerId !== requesterId
    ) {
        if (!requesterId) {
            throw new AppError(status.FORBIDDEN, "This is a private event");
        }

        const participant = await prisma.eventParticipant.findUnique({
            where: { eventId_userId: { eventId, userId: requesterId } },
        });

        if (!participant || participant.status !== ParticipantStatus.APPROVED) {
            throw new AppError(status.FORBIDDEN, "This is a private event");
        }
    }

    return event;
};

const updateEvent = async (
    eventId: string,
    ownerId: string,
    payload: TUpdateEvent,
) => {
    const event = await assertEventOwner(eventId, ownerId);

    const updatedEvent = await prisma.$transaction(async (tx) => {
        const updated = await tx.event.update({
            where: { id: eventId },
            data: {
                ...payload,
                ...(payload.date && { date: new Date(payload.date) }),
                ...(payload.endDate && { endDate: new Date(payload.endDate) }),
            },
            include: {
                owner: { select: { id: true, name: true, image: true } },
                category: true,
            },
        });

        // notify approved participants
        const participants = await tx.eventParticipant.findMany({
            where: {
                eventId,
                status: ParticipantStatus.APPROVED,
            },
            select: { userId: true },
        });

        for (const p of participants) {
            if (p.userId !== ownerId) {
                await sendNotification(
                    tx,
                    p.userId,
                    NotificationType.EVENT_UPDATED,
                    "Event Updated",
                    `"${event.title}" has been updated`,
                    { eventId },
                );
            }
        }

        return updated;
    });

    return updatedEvent;
};

const deleteEvent = async (eventId: string, ownerId: string) => {
    const event = await assertEventOwner(eventId, ownerId);

    await prisma.$transaction(async (tx) => {
        await tx.event.update({
            where: { id: eventId },
            data: {
                isDeleted: true,
                deletedAt: new Date(),
                status: EventStatus.CANCELLED,
            },
        });

        const participants = await tx.eventParticipant.findMany({
            where: {
                eventId,
                status: ParticipantStatus.APPROVED,
            },
            select: { userId: true },
        });

        for (const p of participants) {
            if (p.userId !== ownerId) {
                await sendNotification(
                    tx,
                    p.userId,
                    NotificationType.EVENT_CANCELLED,
                    "Event Cancelled",
                    `"${event.title}" has been cancelled`,
                    { eventId },
                );
            }
        }
    });

    return { message: "Event deleted successfully" };
};

// ─────────────────────────────────────────────
// ADMIN — EVENT MANAGEMENT
// ─────────────────────────────────────────────

const getAllEventsAdmin = async (query: TEventQuery) => {
    const {
        search,
        visibility,
        feeType,
        status: eventStatus,
        page = "1",
        limit = "10",
        sortBy = "createdAt",
        sortOrder = "desc",
    } = query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    const where: any = {
        ...(visibility && { visibility }),
        ...(feeType && { feeType }),
        ...(eventStatus && { status: eventStatus }),
        ...(search && {
            OR: [
                { title: { contains: search, mode: "insensitive" } },
                { owner: { name: { contains: search, mode: "insensitive" } } },
            ],
        }),
    };

    const [events, total] = await Promise.all([
        prisma.event.findMany({
            where,
            skip,
            take,
            orderBy: { [sortBy]: sortOrder },
            include: {
                owner: { select: { id: true, name: true, email: true } },
                category: { select: { id: true, name: true } },
                _count: { select: { participants: true, reviews: true } },
            },
        }),
        prisma.event.count({ where }),
    ]);

    return {
        data: events,
        meta: {
            total,
            page: parseInt(page),
            limit: take,
            totalPages: Math.ceil(total / take),
        },
    };
};

const adminDeleteEvent = async (eventId: string) => {
    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event) throw new AppError(status.NOT_FOUND, "Event not found");

    await prisma.$transaction(async (tx) => {
        await tx.event.update({
            where: { id: eventId },
            data: {
                isDeleted: true,
                deletedAt: new Date(),
                status: EventStatus.CANCELLED,
            },
        });

        const participants = await tx.eventParticipant.findMany({
            where: {
                eventId,
                status: ParticipantStatus.APPROVED,
            },
            select: { userId: true },
        });

        for (const p of participants) {
            if (p.userId !== event.ownerId) {
                await sendNotification(
                    tx,
                    p.userId,
                    NotificationType.EVENT_CANCELLED,
                    "Event Cancelled",
                    `"${event.title}" has been cancelled by Admin`,
                    { eventId },
                );
            }
        }
    });

    return { message: "Event removed by admin" };
};

// ─────────────────────────────────────────────
// FEATURED EVENT
// ─────────────────────────────────────────────

const setFeaturedEvent = async (eventId: string) => {
    const event = await prisma.event.findFirst({
        where: { id: eventId, isDeleted: false, status: EventStatus.PUBLISHED },
    });
    if (!event)
        throw new AppError(status.NOT_FOUND, "Published event not found");

    // Un feature any existing featured event
    await prisma.$transaction([
        prisma.event.updateMany({
            where: { isFeatured: true },
            data: { isFeatured: false },
        }),
        prisma.featuredEvent.deleteMany(),
        prisma.featuredEvent.create({ data: { eventId } }),
        prisma.event.update({
            where: { id: eventId },
            data: { isFeatured: true },
        }),
    ]);

    return { message: "Featured event updated" };
};

const getFeaturedEvent = async () => {
    const featured = await prisma.featuredEvent.findFirst({
        include: {
            event: {
                include: {
                    owner: { select: { id: true, name: true, image: true } },
                    category: true,
                    _count: { select: { participants: true } },
                },
            },
        },
    });

    if (!featured)
        throw new AppError(status.NOT_FOUND, "No featured event set");
    return featured.event;
};

// ─────────────────────────────────────────────
// PARTICIPATION
// ─────────────────────────────────────────────

const joinEvent = async (eventId: string, userId: string) => {
    const event = await prisma.event.findFirst({
        where: { id: eventId, isDeleted: false, status: EventStatus.PUBLISHED },
    });

    if (!event) throw new AppError(status.NOT_FOUND, "Event not found");

    const existing = await prisma.eventParticipant.findUnique({
        where: { eventId_userId: { eventId, userId } },
    });

    if (existing) {
        if (existing.status === ParticipantStatus.BANNED)
            throw new AppError(
                status.FORBIDDEN,
                "You have been banned from this event",
            );

        throw new AppError(
            status.CONFLICT,
            "You have already joined or requested to join this event",
        );
    }

    const autoApprove =
        event.visibility === EventVisibility.PUBLIC &&
        event.feeType === EventFeeType.FREE;

    const participant = await prisma.$transaction(async (tx) => {
        const created = await tx.eventParticipant.create({
            data: {
                eventId,
                userId,
                status: autoApprove
                    ? ParticipantStatus.APPROVED
                    : ParticipantStatus.PENDING,
                joinedAt: autoApprove ? new Date() : undefined,
            },
        });

        // if pending -> notify owner about join request
        if (!autoApprove) {
            await sendNotification(
                tx,
                event.ownerId,
                NotificationType.JOIN_REQUEST,
                "New Join Request",
                `Someone requested to join "${event.title}"`,
                { eventId, userId },
            );
        }

        return created;
    });

    return participant;
};

const getEventParticipants = async (
    eventId: string,
    ownerId: string,
    participantStatus?: ParticipantStatus,
) => {
    await assertEventOwner(eventId, ownerId);

    const participants = await prisma.eventParticipant.findMany({
        where: {
            eventId,
            ...(participantStatus && { status: participantStatus }),
        },
        include: {
            user: {
                select: { id: true, name: true, email: true, image: true },
            },
            payment: {
                select: { id: true, status: true, amount: true, paidAt: true },
            },
        },
        orderBy: { createdAt: "desc" },
    });

    return participants;
};

const approveParticipant = async (
    eventId: string,
    ownerId: string,
    participantUserId: string,
) => {
    const event = await assertEventOwner(eventId, ownerId);

    const participant = await prisma.eventParticipant.findUnique({
        where: { eventId_userId: { eventId, userId: participantUserId } },
    });

    if (!participant)
        throw new AppError(status.NOT_FOUND, "Participant not found");

    if (participant.status !== ParticipantStatus.PENDING)
        throw new AppError(
            status.BAD_REQUEST,
            "Participant is not in pending state",
        );

    const updated = await prisma.$transaction(async (tx) => {
        const updatedParticipant = await tx.eventParticipant.update({
            where: { eventId_userId: { eventId, userId: participantUserId } },
            data: { status: ParticipantStatus.APPROVED, joinedAt: new Date() },
        });

        await sendNotification(
            tx,
            participantUserId,
            NotificationType.REQUEST_APPROVED,
            "Request Approved",
            `Your request to join "${event.title}" has been approved`,
            { eventId },
        );

        return updatedParticipant;
    });

    return updated;
};

const rejectParticipant = async (
    eventId: string,
    ownerId: string,
    participantUserId: string,
) => {
    const event = await assertEventOwner(eventId, ownerId);

    const participant = await prisma.eventParticipant.findUnique({
        where: { eventId_userId: { eventId, userId: participantUserId } },
    });

    if (!participant)
        throw new AppError(status.NOT_FOUND, "Participant not found");

    if (participant.status !== ParticipantStatus.PENDING)
        throw new AppError(
            status.BAD_REQUEST,
            "Can only reject a pending request",
        );

    const updated = await prisma.$transaction(async (tx) => {
        const updatedParticipant = await tx.eventParticipant.update({
            where: { eventId_userId: { eventId, userId: participantUserId } },
            data: { status: ParticipantStatus.REJECTED },
        });

        await sendNotification(
            tx,
            participantUserId,
            NotificationType.REQUEST_REJECTED,
            "Request Rejected",
            `Your request to join "${event.title}" has been rejected`,
            { eventId },
        );

        return updatedParticipant;
    });

    return updated;
};

const banParticipant = async (
    eventId: string,
    ownerId: string,
    participantUserId: string,
    banReason?: string,
) => {
    const event = await assertEventOwner(eventId, ownerId);

    const participant = await prisma.eventParticipant.findUnique({
        where: { eventId_userId: { eventId, userId: participantUserId } },
    });

    if (!participant)
        throw new AppError(status.NOT_FOUND, "Participant not found");

    if (participant.status === ParticipantStatus.BANNED)
        throw new AppError(status.BAD_REQUEST, "Participant is already banned");

    const updated = await prisma.$transaction(async (tx) => {
        const updatedParticipant = await tx.eventParticipant.update({
            where: { eventId_userId: { eventId, userId: participantUserId } },
            data: {
                status: ParticipantStatus.BANNED,
                bannedAt: new Date(),
                banReason: banReason ?? null,
            },
        });

        await sendNotification(
            tx,
            participantUserId,
            NotificationType.PARTICIPANT_BANNED,
            "You Have Been Banned",
            `You have been banned from "${event.title}"`,
            { eventId, banReason },
        );

        return updatedParticipant;
    });

    return updated;
};

// ─────────────────────────────────────────────
// INVITATIONS
// ─────────────────────────────────────────────

const inviteUser = async (
    eventId: string,
    invitedById: string,
    invitedUserId: string,
    message?: string,
) => {
    const event = await assertEventOwner(eventId, invitedById);

    if (invitedById === invitedUserId)
        throw new AppError(status.BAD_REQUEST, "You cannot invite yourself");

    const invitedUser = await prisma.user.findUnique({
        where: { id: invitedUserId },
    });

    if (!invitedUser)
        throw new AppError(status.NOT_FOUND, "User to invite not found");

    const existing = await prisma.invitation.findUnique({
        where: { eventId_invitedUserId: { eventId, invitedUserId } },
    });

    if (existing)
        throw new AppError(status.CONFLICT, "User has already been invited");

    const result = await prisma.$transaction(async (tx) => {
        const invitation = await tx.invitation.create({
            data: { eventId, invitedById, invitedUserId, message },
            include: {
                invitedUser: {
                    select: { id: true, name: true, email: true, image: true },
                },
                event: { select: { id: true, title: true } },
            },
        });

        await sendNotification(
            tx,
            invitedUserId,
            NotificationType.INVITATION_RECEIVED,
            "New Event Invitation",
            `You have been invited to join "${event.title}"`,
            { eventId, invitationId: invitation.id, invitedById },
        );

        return invitation;
    });

    return result;
};

const getMyInvitations = async (userId: string) => {
    return prisma.invitation.findMany({
        where: { invitedUserId: userId },
        include: {
            event: {
                include: {
                    owner: { select: { id: true, name: true, image: true } },
                },
            },
            payment: { select: { id: true, status: true, amount: true } },
        },
        orderBy: { createdAt: "desc" },
    });
};

const respondToInvitation = async (
    invitationId: string,
    userId: string,
    action: "ACCEPTED" | "DECLINED",
) => {
    const invitation = await prisma.invitation.findUnique({
        where: { id: invitationId },
        include: { event: true },
    });

    if (!invitation)
        throw new AppError(status.NOT_FOUND, "Invitation not found");
    if (invitation.invitedUserId !== userId)
        throw new AppError(status.FORBIDDEN, "This invitation is not for you");
    if (invitation.status !== InvitationStatus.PENDING)
        throw new AppError(status.BAD_REQUEST, "Invitation already responded");

    if (invitation.expiresAt && new Date() > invitation.expiresAt)
        throw new AppError(status.BAD_REQUEST, "This invitation has expired");

    const event = invitation.event;

    const updatedInvitation = await prisma.$transaction(async (tx) => {
        const updated = await tx.invitation.update({
            where: { id: invitationId },
            data: { status: action as InvitationStatus },
        });

        // notify event owner (no enum for accepted/declined, so use EVENT_UPDATED or JOIN_REQUEST)
        await sendNotification(
            tx,
            event.ownerId,
            NotificationType.EVENT_UPDATED,
            "Invitation Response",
            `A user ${action.toLowerCase()} your invitation for "${event.title}"`,
            {
                eventId: invitation.eventId,
                invitationId: invitation.id,
                userId,
            },
        );

        return updated;
    });

    return updatedInvitation;
};

// ─────────────────────────────────────────────
// MY EVENTS (DASHBOARD)
// ─────────────────────────────────────────────

const getMyEvents = async (ownerId: string, query: TEventQuery) => {
    const { page = "1", limit = "10", status: eventStatus } = query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    const where: any = {
        ownerId,
        isDeleted: false,
        ...(eventStatus && { status: eventStatus }),
    };

    const [events, total] = await Promise.all([
        prisma.event.findMany({
            where,
            skip,
            take,
            orderBy: { createdAt: "desc" },
            include: {
                category: { select: { id: true, name: true } },
                _count: {
                    select: {
                        participants: true,
                        reviews: true,
                        invitations: true,
                    },
                },
            },
        }),
        prisma.event.count({ where }),
    ]);

    return {
        data: events,
        meta: {
            total,
            page: parseInt(page),
            limit: take,
            totalPages: Math.ceil(total / take),
        },
    };
};

const getMyParticipation = async (userId: string) => {
    return prisma.eventParticipant.findMany({
        where: { userId },
        include: {
            event: {
                include: {
                    owner: { select: { id: true, name: true, image: true } },
                    category: { select: { id: true, name: true } },
                },
            },
            payment: { select: { id: true, status: true, amount: true } },
        },
        orderBy: { createdAt: "desc" },
    });
};

// ─────────────────────────────────────────────
// BULK INVITATIONS
// ─────────────────────────────────────────────

/**
 * POST /events/:eventId/invite
 * Accepts multiple invitedUserIds in one request.
 * Processes each one individually and returns a summary
 * so the frontend can show success/failure per user.
 */
const sendBulkInvitations = async (
    eventId: string,
    invitedById: string,
    invitedUserIds: string[],
    message?: string,
) => {
    // ownership check — only the event owner can invite
    const event = await assertEventOwner(eventId, invitedById);

    if (!invitedUserIds || invitedUserIds.length === 0) {
        throw new AppError(status.BAD_REQUEST, "No users to invite");
    }

    // remove duplicates
    const uniqueIds = [...new Set(invitedUserIds)];

    // remove self-invite
    const filteredIds = uniqueIds.filter((id) => id !== invitedById);

    const successful: { userId: string; invitationId: string }[] = [];
    const failed: { userId: string; reason: string }[] = [];

    // process each user individually so one failure doesn't block the rest
    for (const invitedUserId of filteredIds) {
        try {
            // check user exists
            const invitedUser = await prisma.user.findUnique({
                where: { id: invitedUserId },
                select: { id: true, name: true },
            });

            if (!invitedUser) {
                failed.push({
                    userId: invitedUserId,
                    reason: "User not found",
                });
                continue;
            }

            // check not already invited
            const existing = await prisma.invitation.findUnique({
                where: {
                    eventId_invitedUserId: { eventId, invitedUserId },
                },
            });

            if (existing) {
                failed.push({
                    userId: invitedUserId,
                    reason: "User has already been invited",
                });
                continue;
            }

            // create invitation + send notification in a transaction
            const invitation = await prisma.$transaction(async (tx) => {
                const inv = await tx.invitation.create({
                    data: { eventId, invitedById, invitedUserId, message },
                });

                await tx.notification.create({
                    data: {
                        userId: invitedUserId,
                        type: NotificationType.INVITATION_RECEIVED,
                        title: "New Event Invitation",
                        message: `You have been invited to join "${event.title}"`,
                        metadata: {
                            eventId,
                            invitationId: inv.id,
                            invitedById,
                        },
                    },
                });

                return inv;
            });

            successful.push({
                userId: invitedUserId,
                invitationId: invitation.id,
            });
        } catch (err: any) {
            failed.push({
                userId: invitedUserId,
                reason: err?.message ?? "Unknown error",
            });
        }
    }

    return {
        summary: {
            total: filteredIds.length,
            successCount: successful.length,
            failedCount: failed.length,
        },
        successful,
        failed,
    };
};

// ─────────────────────────────────────────────
// GET EVENT INVITATIONS (for filtering already-invited users)
// ─────────────────────────────────────────────

/**
 * GET /events/:eventId/invitations
 * Returns minimal invitation data so the frontend can
 * grey out / exclude already-invited users from search results.
 * Only the event owner can call this.
 */
const getEventInvitations = async (eventId: string, ownerId: string) => {
    await assertEventOwner(eventId, ownerId);

    const invitations = await prisma.invitation.findMany({
        where: { eventId },
        select: {
            id: true,
            invitedUserId: true,
            status: true,
            createdAt: true,
            invitedUser: {
                select: { id: true, name: true, email: true, image: true },
            },
        },
        orderBy: { createdAt: "desc" },
    });

    return invitations;
};
export const EventService = {
    // Event CRUD
    createEvent,
    getAllEvents,
    getEventById,
    updateEvent,
    deleteEvent,

    // Admin
    getAllEventsAdmin,
    adminDeleteEvent,

    // Featured
    setFeaturedEvent,
    getFeaturedEvent,

    // Participation
    joinEvent,
    getEventParticipants,
    approveParticipant,
    rejectParticipant,
    banParticipant,

    // Invitations
    inviteUser,
    getMyInvitations,
    respondToInvitation,

    // Dashboard
    getMyEvents,
    getMyParticipation,

    // bulk invitation
    sendBulkInvitations,
    getEventInvitations,
};
