import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";
import { multerUpload } from "../../config/multer.config";
import { UploadController } from "./upload.controller";

const router = Router();

// Upload (single + multiple)
router.post(
    "/",
    checkAuth(Role.USER, Role.ADMIN),
    multerUpload.array("file", 10), // supports 1 or many
    UploadController.uploadImage,
);

// Delete (single + multiple)
router.delete(
    "/delete-image",
    checkAuth(Role.USER, Role.ADMIN),
    UploadController.deleteImage,
);

export const UploadRoutes = router;
