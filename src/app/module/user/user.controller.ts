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

export const UserController = {
    getAllUsers,
};
