import { Router } from "express";
import { UserController } from "./user.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.get("/", UserController.getAllUsers);
router.get(
    "/search",
    checkAuth(Role.USER, Role.ADMIN),
    UserController.searchUsers,
);

router.get("/:id", UserController.getUserById);

export const UserRoutes = router;
