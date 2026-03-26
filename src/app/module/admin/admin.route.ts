import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { checkAuth } from "../../middleware/checkAuth";
import { AdminController } from "./admin.controller";

const router = Router();

router.post(
    "/create-admin",
    checkAuth(Role.ADMIN),
    AdminController.createAdmin,
);

router.get("/", checkAuth(Role.ADMIN), AdminController.getAllAdmins);
router.get("/:id", checkAuth(Role.ADMIN), AdminController.getAdminById);
router.patch("/:id", checkAuth(Role.ADMIN), AdminController.updateAdmin);
router.delete("/:id", checkAuth(Role.ADMIN), AdminController.deleteAdmin);

router.patch(
    "/change-user-status",
    checkAuth(Role.ADMIN),
    AdminController.changeUserStatus,
);
router.patch(
    "/change-user-role",
    checkAuth(Role.ADMIN),
    AdminController.changeUserRole,
);

export const AdminRoutes = router;
