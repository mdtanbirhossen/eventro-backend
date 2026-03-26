import { Router } from "express";
import { AdminRoutes } from "../module/admin/admin.route";
import { AuthRoutes } from "../module/auth/auth.route";
import { UserRoutes } from "../module/user/user.route";
import { UploadRoutes } from "../module/upload/upload.route";
import { EventRoutes } from "../module/event/event.route";
import { EventCategoryRoutes } from "../module/eventCategory/eventCategory.route";
import { ReviewRoutes } from "../module/review/review.route";
import { NotificationRoutes } from "../module/notification/notification.route";
import { PaymentRoutes } from "../module/payment/payment.route";

const router = Router();

router.use("/auth", AuthRoutes);
router.use("/users", UserRoutes);
router.use("/admins", AdminRoutes);
router.use("/upload", UploadRoutes);
router.use("/events", EventRoutes);
router.use("/event-categories", EventCategoryRoutes);
router.use("/reviews", ReviewRoutes);
router.use("/notifications", NotificationRoutes);
router.use("/payment", PaymentRoutes);

export const IndexRoutes = router;
