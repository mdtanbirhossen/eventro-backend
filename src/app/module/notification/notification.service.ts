import status from "http-status";
import AppError from "../../errorHelpers/AppError";
import { prisma } from "../../lib/prisma";

interface ICreateNotificationPayload {
    userId: string;
    type: any; // NotificationType enum
    title: string;
    message: string;
    metadata?: any;
}

const createNotification = async (payload: ICreateNotificationPayload) => {
    const notification = await prisma.notification.create({
        data: {
            userId: payload.userId,
            type: payload.type,
            title: payload.title,
            message: payload.message,
            metadata: payload.metadata,
        },
    });

    return notification;
};

const getMyNotifications = async (
    userId: string,
    query: { page?: string; limit?: string; unread?: string },
) => {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    const whereCondition: any = {
        userId,
    };

    if (query.unread === "true") {
        whereCondition.isRead = false;
    }

    const notifications = await prisma.notification.findMany({
        where: whereCondition,
        orderBy: {
            createdAt: "desc",
        },
        skip,
        take: limit,
    });

    const total = await prisma.notification.count({
        where: whereCondition,
    });

    return {
        meta: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
        data: notifications,
    };
};

const getUnreadCount = async (userId: string) => {
    const count = await prisma.notification.count({
        where: {
            userId,
            isRead: false,
        },
    });

    return count;
};

const markAsRead = async (userId: string, notificationId: string) => {
    const notification = await prisma.notification.findUnique({
        where: { id: notificationId },
    });

    if (!notification) {
        throw new AppError(status.NOT_FOUND, "Notification not found!");
    }

    if (notification.userId !== userId) {
        throw new AppError(
            status.FORBIDDEN,
            "You are not allowed to access this notification!",
        );
    }

    const updatedNotification = await prisma.notification.update({
        where: { id: notificationId },
        data: {
            isRead: true,
            readAt: new Date(),
        },
    });

    return updatedNotification;
};

const markAllAsRead = async (userId: string) => {
    const result = await prisma.notification.updateMany({
        where: {
            userId,
            isRead: false,
        },
        data: {
            isRead: true,
            readAt: new Date(),
        },
    });

    return result;
};

const deleteNotification = async (userId: string, notificationId: string) => {
    const notification = await prisma.notification.findUnique({
        where: { id: notificationId },
    });

    if (!notification) {
        throw new AppError(status.NOT_FOUND, "Notification not found!");
    }

    if (notification.userId !== userId) {
        throw new AppError(
            status.FORBIDDEN,
            "You are not allowed to delete this notification!",
        );
    }

    const deleted = await prisma.notification.delete({
        where: { id: notificationId },
    });

    return deleted;
};

export const NotificationService = {
    createNotification,
    getMyNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
};
