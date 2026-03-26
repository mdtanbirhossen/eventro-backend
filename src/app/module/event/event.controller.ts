import { Request, Response } from "express";
import status from "http-status";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { EventService } from "./event.service";

// ─────────────────────────────────────────────
// EVENT CRUD
// ─────────────────────────────────────────────

const createEvent = catchAsync(async (req: Request, res: Response) => {
    const ownerId = req.user!.userId;
    const result = await EventService.createEvent(ownerId, req.body);

    sendResponse(res, {
        httpStatusCode: status.CREATED,
        success: true,
        message: "Event created successfully",
        data: result,
    });
});

const getAllEvents = catchAsync(async (req: Request, res: Response) => {
    const result = await EventService.getAllEvents(req.query as any);

    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Events fetched successfully",
        data: result.data,
        meta: result.meta,
    });
});

const getEventById = catchAsync(async (req: Request, res: Response) => {
    // requesterId may be undefined for unauthenticated requests on public routes
    const requesterId = req.user?.userId;
    const result = await EventService.getEventById(
        req.params.id as string,
        requesterId,
    );

    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Event fetched successfully",
        data: result,
    });
});

const updateEvent = catchAsync(async (req: Request, res: Response) => {
    const ownerId = req.user!.userId;
    const result = await EventService.updateEvent(
        req.params.id as string,
        ownerId,
        req.body,
    );

    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Event updated successfully",
        data: result,
    });
});

const deleteEvent = catchAsync(async (req: Request, res: Response) => {
    const ownerId = req.user!.userId;
    const result = await EventService.deleteEvent(
        req.params.id as string,
        ownerId,
    );

    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: result.message,
        data: null,
    });
});

// ─────────────────────────────────────────────
// ADMIN
// ─────────────────────────────────────────────

const getAllEventsAdmin = catchAsync(async (req: Request, res: Response) => {
    const result = await EventService.getAllEventsAdmin(req.query as any);

    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "All events fetched",
        data: result.data,
        meta: result.meta,
    });
});

const adminDeleteEvent = catchAsync(async (req: Request, res: Response) => {
    const result = await EventService.adminDeleteEvent(req.params.id as string);

    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: result.message,
        data: null,
    });
});

// ─────────────────────────────────────────────
// FEATURED EVENT
// ─────────────────────────────────────────────

const getFeaturedEvent = catchAsync(async (_req: Request, res: Response) => {
    const result = await EventService.getFeaturedEvent();

    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Featured event fetched",
        data: result,
    });
});

const setFeaturedEvent = catchAsync(async (req: Request, res: Response) => {
    const result = await EventService.setFeaturedEvent(req.params.id as string);

    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: result.message,
        data: null,
    });
});

// ─────────────────────────────────────────────
// PARTICIPATION
// ─────────────────────────────────────────────

const joinEvent = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const result = await EventService.joinEvent(
        req.params.id as string,
        userId,
    );

    sendResponse(res, {
        httpStatusCode: status.CREATED,
        success: true,
        message:
            result.status === "APPROVED"
                ? "Joined event successfully"
                : "Join request sent, awaiting approval",
        data: result,
    });
});

const getEventParticipants = catchAsync(async (req: Request, res: Response) => {
    const ownerId = req.user!.userId;
    const participantStatus = req.query.status as any;
    const result = await EventService.getEventParticipants(
        req.params.id as string,
        ownerId,
        participantStatus,
    );

    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Participants fetched successfully",
        data: result,
    });
});

const approveParticipant = catchAsync(async (req: Request, res: Response) => {
    const ownerId = req.user!.userId;
    const result = await EventService.approveParticipant(
        req.params.id as string,
        ownerId,
        req.params.userId as string,
    );

    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Participant approved",
        data: result,
    });
});

const rejectParticipant = catchAsync(async (req: Request, res: Response) => {
    const ownerId = req.user!.userId;
    const result = await EventService.rejectParticipant(
        req.params.id as string,
        ownerId,
        req.params.userId as string,
    );

    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Participant rejected",
        data: result,
    });
});

const banParticipant = catchAsync(async (req: Request, res: Response) => {
    const ownerId = req.user!.userId;
    const { banReason } = req.body;
    const result = await EventService.banParticipant(
        req.params.id as string,
        ownerId,
        req.params.userId as string,
        banReason,
    );

    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Participant banned",
        data: result,
    });
});

// ─────────────────────────────────────────────
// INVITATIONS
// ─────────────────────────────────────────────

const inviteUser = catchAsync(async (req: Request, res: Response) => {
    const invitedById = req.user!.userId;
    const { invitedUserId, message } = req.body;
    const result = await EventService.inviteUser(
        req.params.id as string,
        invitedById,
        invitedUserId,
        message,
    );

    sendResponse(res, {
        httpStatusCode: status.CREATED,
        success: true,
        message: "Invitation sent successfully",
        data: result,
    });
});

const getMyInvitations = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const result = await EventService.getMyInvitations(userId);

    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Invitations fetched successfully",
        data: result,
    });
});

const respondToInvitation = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const { action } = req.body; // "ACCEPTED" | "DECLINED"
    const result = await EventService.respondToInvitation(
        req.params.invitationId as string,
        userId,
        action,
    );

    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: `Invitation ${action.toLowerCase()} successfully`,
        data: result,
    });
});

// ─────────────────────────────────────────────
// DASHBOARD
// ─────────────────────────────────────────────

const getMyEvents = catchAsync(async (req: Request, res: Response) => {
    const ownerId = req.user!.userId;
    const result = await EventService.getMyEvents(ownerId, req.query as any);

    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Your events fetched successfully",
        data: result.data,
        meta: result.meta,
    });
});

const getMyParticipation = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const result = await EventService.getMyParticipation(userId);

    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Your participation fetched successfully",
        data: result,
    });
});

export const EventController = {
    createEvent,
    getAllEvents,
    getEventById,
    updateEvent,
    deleteEvent,
    getAllEventsAdmin,
    adminDeleteEvent,
    getFeaturedEvent,
    setFeaturedEvent,
    joinEvent,
    getEventParticipants,
    approveParticipant,
    rejectParticipant,
    banParticipant,
    inviteUser,
    getMyInvitations,
    respondToInvitation,
    getMyEvents,
    getMyParticipation,
};
