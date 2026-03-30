import { Request, Response } from "express";
import { sendResponse } from "../../shared/sendResponse";
import { catchAsync } from "../../shared/catchAsync";
import status from "http-status";
import { StatsService } from "./stats.service";

const getAdminDashboardStats = catchAsync(
    async (req: Request, res: Response) => {
        const result = await StatsService.getAdminDashboardStats();

        sendResponse(res, {
            httpStatusCode: status.CREATED,
            success: true,
            message: "Dashboard stats fetched successfully.",
            data: result,
        });
    },
);

export const StatsController = {
    getAdminDashboardStats,
};
