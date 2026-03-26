import { Router } from "express";
import { ReviewController } from "./review.controller";
import { Role } from "../../../generated/prisma/enums";
import { checkAuth } from "../../middleware/checkAuth";

const router = Router();

// create review (only logged in user)
router.post("/", checkAuth(Role.USER, Role.ADMIN), ReviewController.createReview);

// public route (anyone can see event reviews)
router.get("/event/:eventId", ReviewController.getReviewsByEvent);

// logged in user can see own reviews
router.get("/me", checkAuth(Role.USER, Role.ADMIN), ReviewController.getMyReviews);

// update own review
router.patch("/:id", checkAuth(Role.USER, Role.ADMIN), ReviewController.updateReview);

// delete own review
router.delete("/:id", checkAuth(Role.USER, Role.ADMIN), ReviewController.deleteReview);

export const ReviewRoutes = router;