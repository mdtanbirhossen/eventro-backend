import status from "http-status";
import { Role, UserStatus } from "../../../generated/prisma/enums";
import AppError from "../../errorHelpers/AppError";
import { IRequestUser } from "../../interfaces/requestUser.interface";
import { prisma } from "../../lib/prisma";
import {
    IChangeUserRolePayload,
    IChangeUserStatusPayload,
    ICreateAdminPayload,
    IUpdateAdminPayload,
} from "./admin.interface";
import { auth } from "../../lib/auth";

const createAdmin = async (payload: ICreateAdminPayload) => {

    const userExists = await prisma.user.findUnique({
        where: {
            email: payload.admin.email,
        },
    });

    if (userExists) {
        throw new AppError(
            status.CONFLICT,
            "User with this email already exists",
        );
    }

    const { admin, role, password } = payload;

    try {
        const userData = await auth.api.signUpEmail({
            body: {
                ...admin,
                password,
                role,
            },
        });

        return userData;
    } catch (error: any) {
        console.log("Error creating admin: ", error);
        throw error;
    }
};

const getAllAdmins = async () => {
    const admins = await prisma.user.findMany();
    return admins;
};

const getAdminById = async (id: string) => {
    const admin = await prisma.user.findUnique({
        where: {
            id,
        },
    });
    return admin;
};

const updateAdmin = async (id: string, payload: IUpdateAdminPayload) => {
    const isAdminExist = await prisma.user.findUnique({
        where: {
            id,
        },
    });

    if (!isAdminExist) {
        throw new AppError(status.NOT_FOUND, "Admin  not found");
    }

    const { admin } = payload;

    const updatedAdmin = await prisma.user.update({
        where: {
            id,
        },
        data: {
            ...admin,
        },
    });

    return updatedAdmin;
};

//soft delete admin user by setting isDeleted to true and also delete the user session and account
const deleteAdmin = async (id: string, user: IRequestUser) => {
    const isAdminExist = await prisma.user.findUnique({
        where: {
            id,
        },
    });

    if (!isAdminExist) {
        throw new AppError(status.NOT_FOUND, "Admin not found");
    }

    if (isAdminExist.id === user.userId) {
        throw new AppError(status.BAD_REQUEST, "You cannot delete yourself");
    }

    const result = await prisma.$transaction(async (tx) => {
        await tx.user.update({
            where: { id: isAdminExist.id },
            data: {
                isDeleted: true,
                deletedAt: new Date(),
                status: UserStatus.DELETED, // Optional: you may also want to block the user
            },
        });

        await tx.session.deleteMany({
            where: { userId: isAdminExist.id },
        });

        await tx.account.deleteMany({
            where: { userId: isAdminExist.id },
        });

        const admin = await getAdminById(id);

        return admin;
    });

    return result;
};

const changeUserStatus = async (
    user: IRequestUser,
    payload: IChangeUserStatusPayload,
) => {
    const currentUser = await prisma.user.findUniqueOrThrow({
        where: { email: user.email },
    });

    const { userId, userStatus } = payload;

    const targetUser = await prisma.user.findUniqueOrThrow({
        where: { id: userId },
    });

    if (currentUser.id === userId) {
        throw new AppError(
            status.BAD_REQUEST,
            "You cannot change your own status",
        );
    }

    if (currentUser.role === Role.ADMIN && targetUser.role === Role.ADMIN) {
        throw new AppError(
            status.BAD_REQUEST,
            "You cannot change another admin's status",
        );
    }

    if (userStatus === UserStatus.DELETED) {
        throw new AppError(
            status.BAD_REQUEST,
            "Use delete API instead of setting DELETED status",
        );
    }

    const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { status: userStatus },
    });

    return updatedUser;
};

const changeUserRole = async (
    user: IRequestUser,
    payload: IChangeUserRolePayload,
) => {
    const currentUser = await prisma.user.findUniqueOrThrow({
        where: { email: user.email },
    });

    const { userId, role } = payload;

    const targetUser = await prisma.user.findUniqueOrThrow({
        where: { id: userId },
    });

    if (currentUser.role !== Role.ADMIN) {
        throw new AppError(
            status.FORBIDDEN,
            "Only admin can change user roles",
        );
    }

    if (currentUser.id === userId) {
        throw new AppError(
            status.BAD_REQUEST,
            "You cannot change your own role",
        );
    }

    if (targetUser.role === Role.ADMIN) {
        throw new AppError(
            status.BAD_REQUEST,
            "You cannot change another admin's role",
        );
    }

    const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { role },
    });

    return updatedUser;
};

export const AdminService = {
    createAdmin,
    getAllAdmins,
    getAdminById,
    updateAdmin,
    deleteAdmin,
    changeUserStatus,
    changeUserRole,
};
