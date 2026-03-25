import { Role } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";

const getAllUsers = async () => {

    const users = await prisma.user.findMany({
        where:{
            role:Role.USER
        }
    });
    return users
};

export const UserService = {
    getAllUsers,
};
