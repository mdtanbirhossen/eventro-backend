import status from "http-status";
import { Role } from "../../../generated/prisma/enums";
import AppError from "../../errorHelpers/AppError";
import { prisma } from "../../lib/prisma";

const getAllUsers = async () => {
    const users = await prisma.user.findMany({
        where: {
            role: Role.USER,
        },
    });
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

export const UserService = {
    getAllUsers,
    getUserById,
};
