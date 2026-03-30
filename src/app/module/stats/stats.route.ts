import { Router } from "express";
import { StatsController } from "./stats.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.get("/admin",checkAuth(Role.ADMIN) , StatsController.getAdminDashboardStats);

export const StatsRoutes = router;