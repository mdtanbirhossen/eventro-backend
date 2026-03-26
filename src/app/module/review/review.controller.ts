import { Request, Response } from "express";
import status from "http-status";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { ReviewService } from "./review.service";

const createReview = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user.userId; // from auth middleware
    const result = await ReviewService.createReview(userId, req.body);

    sendResponse(res, {
        httpStatusCode: status.CREATED,
        success: true,
        message: "Review created successfully",
        data: result,
    });
});

const getReviewsByEvent = catchAsync(async (req: Request, res: Response) => {
    const result = await ReviewService.getReviewsByEvent(
        req.params.eventId as string,
    );

    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Reviews fetched successfully",
        data: result,
    });
});

const getMyReviews = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user.userId;
    const result = await ReviewService.getMyReviews(userId);

    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "My reviews fetched successfully",
        data: result,
    });
});

const updateReview = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user.userId;
    const result = await ReviewService.updateReview(
        userId,
        req.params.id as string,
        req.body,
    );

    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Review updated successfully",
        data: result,
    });
});

const deleteReview = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user.userId;
    const result = await ReviewService.deleteReview(
        userId,
        req.params.id as string,
    );

    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Review deleted successfully",
        data: result,
    });
});

export const ReviewController = {
    createReview,
    getReviewsByEvent,
    getMyReviews,
    updateReview,
    deleteReview,
};
