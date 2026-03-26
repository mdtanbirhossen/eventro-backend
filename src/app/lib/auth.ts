import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { bearer, emailOTP } from "better-auth/plugins";
import { Role, UserStatus } from "../../generated/prisma/enums";
import { envVars } from "../config/env";
import { sendEmail } from "../utils/email";
import { prisma } from "./prisma";
// If your Prisma file is located elsewhere, you can change the path

export const auth = betterAuth({
    baseURL: envVars.BETTER_AUTH_URL,
    secret: envVars.BETTER_AUTH_SECRET,
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),

    emailAndPassword: {
        enabled: true,
    },

    user: {
        additionalFields: {
            role: {
                type: "string",
                required: true,
                defaultValue: Role.USER,
            },

            status: {
                type: "string",
                required: true,
                defaultValue: UserStatus.ACTIVE,
            },

            isDeleted: {
                type: "boolean",
                required: true,
                defaultValue: false,
            },

            deletedAt: {
                type: "date",
                required: false,
                defaultValue: null,
            },
        },
    },

    plugins: [
        bearer(),
    ],

    session: {
        expiresIn: 60 * 60 * 60 * 24, // 1 day in seconds
        updateAge: 60 * 60 * 60 * 24, // 1 day in seconds
        cookieCache: {
            enabled: true,
            maxAge: 60 * 60 * 60 * 24, // 1 day in seconds
        },
    },

    // redirectURLs: {
    //     signIn: `${envVars.BETTER_AUTH_URL}/api/v1/auth/google/success`,
    // },

    // trustedOrigins: [
    //     process.env.BETTER_AUTH_URL || "http://localhost:5000",
    //     envVars.FRONTEND_URL,
    // ],

    // advanced: {
    //     // disableCSRFCheck: true,
    //     useSecureCookies: false,
    //     cookies: {
    //         state: {
    //             attributes: {
    //                 sameSite: "none",
    //                 secure: true,
    //                 httpOnly: true,
    //                 path: "/",
    //             },
    //         },
    //         sessionToken: {
    //             attributes: {
    //                 sameSite: "none",
    //                 secure: true,
    //                 httpOnly: true,
    //                 path: "/",
    //             },
    //         },
    //     },
    // },
});
