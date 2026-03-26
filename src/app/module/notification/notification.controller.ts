import { Request, Response } from "express";
import status from "http-status";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { NotificationService } from "./notification.service";

const getMyNotifications = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user.userId;

    const result = await NotificationService.getMyNotifications(
        userId,
        req.query,
    );

    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Notifications fetched successfully",
        data: result,
    });
});

const getUnreadCount = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user.userId;

    const result = await NotificationService.getUnreadCount(userId);

    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Unread notification count fetched successfully",
        data: { unreadCount: result },
    });
});

const markAsRead = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user.userId;
    const notificationId = req.params.id;

    const result = await NotificationService.markAsRead(
        userId,
        notificationId as string,
    );

    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Notification marked as read",
        data: result,
    });
});

const markAllAsRead = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user.userId;

    const result = await NotificationService.markAllAsRead(userId);

    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "All notifications marked as read",
        data: result,
    });
});

const deleteNotification = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user.userId;
    const notificationId = req.params.id;

    const result = await NotificationService.deleteNotification(
        userId,
        notificationId as string,
    );

    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Notification deleted successfully",
        data: result,
    });
});

export const NotificationController = {
    getMyNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
};
