import status from "http-status";
import AppError from "../../errorHelpers/AppError";
import { prisma } from "../../lib/prisma";

const createCategory = async (payload: {
    name: string;
    description?: string;
}) => {
    const existing = await prisma.eventCategory.findUnique({
        where: { name: payload.name },
    });

    if (existing) {
        throw new AppError(status.CONFLICT, "Category already exists!");
    }

    const category = await prisma.eventCategory.create({
        data: {
            name: payload.name,
            description: payload.description,
        },
    });

    return category;
};

const getAllCategories = async () => {
    const categories = await prisma.eventCategory.findMany({
        orderBy: { createdAt: "desc" },
    });

    return categories;
};

const getCategoryById = async (id: string) => {
    const category = await prisma.eventCategory.findUnique({
        where: { id },
    });

    if (!category) {
        throw new AppError(status.NOT_FOUND, "Category not found!");
    }

    return category;
};

const updateCategory = async (
    id: string,
    payload: { name?: string; description?: string },
) => {
    const category = await prisma.eventCategory.findUnique({
        where: { id },
    });

    if (!category) {
        throw new AppError(status.NOT_FOUND, "Category not found!");
    }

    // if name update, check uniqueness
    if (payload.name) {
        const existing = await prisma.eventCategory.findFirst({
            where: {
                name: payload.name,
                NOT: { id },
            },
        });

        if (existing) {
            throw new AppError(
                status.CONFLICT,
                "Category name already exists!",
            );
        }
    }

    const updatedCategory = await prisma.eventCategory.update({
        where: { id },
        data: payload,
    });

    return updatedCategory;
};

const deleteCategory = async (id: string) => {
    const category = await prisma.eventCategory.findUnique({
        where: { id },
    });

    if (!category) {
        throw new AppError(status.NOT_FOUND, "Category not found!");
    }

    const deletedCategory = await prisma.eventCategory.delete({
        where: { id },
    });

    return deletedCategory;
};

export const EventCategoryService = {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
};
