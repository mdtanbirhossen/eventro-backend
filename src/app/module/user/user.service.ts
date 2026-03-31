import status from "http-status";
import { Role } from "../../../generated/prisma/enums";
import AppError from "../../errorHelpers/AppError";
import { prisma } from "../../lib/prisma";
import { Prisma } from "../../../generated/prisma/client";

const getAllUsers = async () => {
    const users = await prisma.user.findMany();
    return users;
};

const getUserById = async (userid: string) => {
    const user = await prisma.user.findFirst({
        where: {
            id: userid,
        },
    });

    if (!user) {
        throw new AppError(status.NOT_FOUND, "User not found!");
    }
    return user;
};

const searchUsers = async (params: {
    search?: string;
    limit?: string;
    page?: string;
}) => {
    const { search, limit = "20", page = "1" } = params;
 
    const take = Math.min(parseInt(limit), 50); // cap at 50
    const skip = (parseInt(page) - 1) * take;
 
    const where: Prisma.UserWhereInput = {
        isDeleted: false,
        status: "ACTIVE",
        ...(search && {
            OR: [
                { name: { contains: search, mode: "insensitive" } },
                { email: { contains: search, mode: "insensitive" } },
            ],
        }),
    };
 
    const [users, total] = await Promise.all([
        prisma.user.findMany({
            where,
            skip,
            take,
            select: {
                id: true,
                name: true,
                email: true,
                image: true,
            },
            orderBy: { name: "asc" },
        }),
        prisma.user.count({ where }),
    ]);
 
    return {
        data: users,
        meta: {
            total,
            page: parseInt(page),
            limit: take,
            totalPages: Math.ceil(total / take),
        },
    };
};

export const UserService = {
    getAllUsers,
    getUserById,
    searchUsers
};
