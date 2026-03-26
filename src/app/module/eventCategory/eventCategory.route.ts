import { Router } from "express";
import { EventCategoryController } from "./eventCategory.controller";

const router = Router();

router.post("/", EventCategoryController.createCategory);
router.get("/", EventCategoryController.getAllCategories);
router.get("/:id", EventCategoryController.getCategoryById);
router.patch("/:id", EventCategoryController.updateCategory);
router.delete("/:id", EventCategoryController.deleteCategory);

export const EventCategoryRoutes = router;
