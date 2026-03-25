import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { checkAuth } from "../../middleware/checkAuth";
import { AuthController } from "./auth.controller";

const router = Router();

router.post("/register", AuthController.register);
router.post("/login", AuthController.loginUser);
router.get("/me", checkAuth(Role.ADMIN, Role.USER), AuthController.getMe);
router.post("/refresh-token", AuthController.getNewToken);
router.post(
    "/change-password",
    checkAuth(Role.ADMIN, Role.USER),
    AuthController.changePassword,
);
router.post(
    "/logout",
    checkAuth(Role.ADMIN, Role.USER),
    AuthController.logoutUser,
);
export const AuthRoutes = router;
