import { Router } from "express";
import { NotificationController } from "./notification.controller";
import { Role } from "../../../generated/prisma/enums";
import { checkAuth } from "../../middleware/checkAuth";

const router = Router();

router.get(
    "/",
    checkAuth(Role.USER, Role.ADMIN),
    NotificationController.getMyNotifications
);

router.get(
    "/unread-count",
    checkAuth(Role.USER, Role.ADMIN),
    NotificationController.getUnreadCount
);

router.patch(
    "/mark-read/:id",
    checkAuth(Role.USER, Role.ADMIN),
    NotificationController.markAsRead
);

router.patch(
    "/mark-read",
    checkAuth(Role.USER, Role.ADMIN),
    NotificationController.markAllAsRead
);

router.delete(
    "/:id",
    checkAuth(Role.USER, Role.ADMIN),
    NotificationController.deleteNotification
);

export const NotificationRoutes = router;