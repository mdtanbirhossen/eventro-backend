/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { CookieUtils } from "../utils/cookie";
import { jwtUtils } from "../utils/jwt";
import { envVars } from "../config/env";
import { Role, UserStatus } from "../../generated/prisma/enums";

export const optionalCheckAuth =
  (...authRoles: Role[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Try Session Token
      const sessionToken = CookieUtils.getCookie(
        req,
        "better-auth.session_token"
      );

      if (sessionToken) {
        const sessionExists = await prisma.session.findFirst({
          where: {
            token: sessionToken,
            expiresAt: {
              gt: new Date(),
            },
          },
          include: {
            user: true,
          },
        });

        if (sessionExists?.user) {
          const user = sessionExists.user;

          if (
            user.status === UserStatus.BLOCKED ||
            user.status === UserStatus.DELETED ||
            user.isDeleted
          ) {
            return next(); // ignore invalid user
          }

          if (authRoles.length > 0 && !authRoles.includes(user.role)) {
            return next(); // ignore role mismatch
          }

          req.user = {
            userId: user.id,
            role: user.role,
            email: user.email,
          };

          return next();
        }
      }

      // Try Access Token
      const accessToken = CookieUtils.getCookie(req, "accessToken");

      if (!accessToken) {
        return next();
      }

      const verifiedToken = jwtUtils.verifyToken(
        accessToken,
        envVars.ACCESS_TOKEN_SECRET
      );

      if (!verifiedToken.success) {
        return next();
      }

      if (
        authRoles.length > 0 &&
        !authRoles.includes(verifiedToken.data!.role as Role)
      ) {
        return next();
      }

      req.user = {
        userId: verifiedToken.data!.userId,
        role: verifiedToken.data!.role,
        email: verifiedToken.data!.email,
      };

      next();
    } catch (error: any) {
      next();
    }
  };