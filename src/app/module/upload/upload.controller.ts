import { Request, Response } from "express";
import status from "http-status";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import AppError from "../../errorHelpers/AppError";
import { UploadService } from "./upload.service";

const uploadImage = catchAsync(async (req: Request, res: Response) => {
     const files = req.files as Express.Multer.File[];
     if (files?.length > 10) {
          throw new AppError(status.BAD_REQUEST, "Maximum 10 images are allowed");
     }

     const result = await UploadService.uploadImage(files);

     sendResponse(res, {
          httpStatusCode: status.OK,
          success: true,
          message: "Image uploaded successfully",
          data: result,
     });
});

const deleteImage = catchAsync(async (req: Request, res: Response) => {
     const { url } = req.body;

     const result = await UploadService.deleteImage(url);

     sendResponse(res, {
          httpStatusCode: status.OK,
          success: true,
          message: "Image deleted successfully",
          data: result,
     });
});

export const UploadController = {
     uploadImage,
     deleteImage,
};