import { Request, Response } from "express";
import status from "http-status";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { UserService } from "./user.service";

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
    const result = await UserService.getAllUsers();

    sendResponse(res, {
        httpStatusCode: status.CREATED,
        success: true,
        message: "Users fetched successfully",
        data: result,
    });
});

const getUserById = catchAsync(async (req: Request, res: Response) => {
    const result = await UserService.getUserById(req.params.id as string);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "User fetched successfully",
        data: result,
    });
});

const searchUsers = catchAsync(async (req: Request, res: Response) => {
    const result = await UserService.searchUsers({
        search: req.query.search as string | undefined,
        limit: req.query.limit as string | undefined,
        page: req.query.page as string | undefined,
    });

    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Users fetched successfully",
        data: result.data,
        meta: result.meta,
    });
});

export const UserController = {
    getAllUsers,
    getUserById,
    searchUsers,
};
