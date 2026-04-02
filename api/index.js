var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/app.ts
import { toNodeHandler } from "better-auth/node";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import path2 from "path";
import qs from "qs";

// src/app/lib/auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { bearer } from "better-auth/plugins";

// src/generated/prisma/enums.ts
var Role = {
  ADMIN: "ADMIN",
  USER: "USER"
};
var UserStatus = {
  ACTIVE: "ACTIVE",
  BLOCKED: "BLOCKED",
  DELETED: "DELETED"
};
var EventVisibility = {
  PUBLIC: "PUBLIC",
  PRIVATE: "PRIVATE"
};
var EventFeeType = {
  FREE: "FREE",
  PAID: "PAID"
};
var EventStatus = {
  DRAFT: "DRAFT",
  PUBLISHED: "PUBLISHED",
  CANCELLED: "CANCELLED",
  COMPLETED: "COMPLETED"
};
var ParticipantStatus = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
  BANNED: "BANNED"
};
var InvitationStatus = {
  PENDING: "PENDING",
  ACCEPTED: "ACCEPTED",
  DECLINED: "DECLINED"
};
var PaymentStatus = {
  UNPAID: "UNPAID",
  PAID: "PAID",
  CANCELLED: "CANCELLED",
  REFUNDED: "REFUNDED",
  FAILED: "FAILED"
};
var PaymentProvider = {
  STRIPE: "STRIPE",
  SSLCOMMERZ: "SSLCOMMERZ"
};
var NotificationType = {
  JOIN_REQUEST: "JOIN_REQUEST",
  REQUEST_APPROVED: "REQUEST_APPROVED",
  REQUEST_REJECTED: "REQUEST_REJECTED",
  INVITATION_RECEIVED: "INVITATION_RECEIVED",
  INVITATION_DECLINED: "INVITATION_DECLINED",
  INVITATION_ACCEPTED: "INVITATION_ACCEPTED",
  PARTICIPANT_BANNED: "PARTICIPANT_BANNED",
  PAYMENT_SUCCESS: "PAYMENT_SUCCESS",
  PAYMENT_FAILED: "PAYMENT_FAILED",
  EVENT_UPDATED: "EVENT_UPDATED",
  EVENT_CANCELLED: "EVENT_CANCELLED",
  REVIEW_RECEIVED: "REVIEW_RECEIVED"
};

// src/app/config/env.ts
import dotenv from "dotenv";
import status from "http-status";

// src/app/errorHelpers/AppError.ts
var AppError = class extends Error {
  statusCode;
  constructor(statusCode, message, stack = "") {
    super(message);
    this.statusCode = statusCode;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
};
var AppError_default = AppError;

// src/app/config/env.ts
dotenv.config();
var loadEnvVariables = () => {
  const requireEnvVariable = [
    "NODE_ENV",
    "PORT",
    "DATABASE_URL",
    "BETTER_AUTH_SECRET",
    "BETTER_AUTH_URL",
    "ACCESS_TOKEN_SECRET",
    "REFRESH_TOKEN_SECRET",
    "ACCESS_TOKEN_EXPIRES_IN",
    "REFRESH_TOKEN_EXPIRES_IN",
    "BETTER_AUTH_SESSION_TOKEN_EXPIRES_IN",
    "BETTER_AUTH_SESSION_TOKEN_UPDATE_AGE",
    "EMAIL_SENDER_SMTP_USER",
    "EMAIL_SENDER_SMTP_PASS",
    "EMAIL_SENDER_SMTP_HOST",
    "EMAIL_SENDER_SMTP_PORT",
    "EMAIL_SENDER_SMTP_FROM",
    "GOOGLE_CLIENT_ID",
    "GOOGLE_CLIENT_SECRET",
    "GOOGLE_CALLBACK_URL",
    "FRONTEND_URL",
    "CLOUDINARY_CLOUD_NAME",
    "CLOUDINARY_API_KEY",
    "CLOUDINARY_API_SECRET",
    "ADMIN_EMAIL",
    "ADMIN_PASSWORD",
    "SSLCOMMERZ_STORE_ID",
    "SSLCOMMERZ_STORE_PASSWORD",
    "SSLCOMMERZ_BASE_URL",
    "SSLCOMMERZ_SUCCESS_URL",
    "SSLCOMMERZ_FAIL_URL",
    "SSLCOMMERZ_CANCEL_URL",
    "SSLCOMMERZ_IPN_URL"
  ];
  requireEnvVariable.forEach((variable) => {
    if (!process.env[variable]) {
      throw new AppError_default(
        status.INTERNAL_SERVER_ERROR,
        `Environment variable ${variable} is required but not set in .env file.`
      );
    }
  });
  return {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    DATABASE_URL: process.env.DATABASE_URL,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
    ACCESS_TOKEN_EXPIRES_IN: process.env.ACCESS_TOKEN_EXPIRES_IN,
    REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN,
    BETTER_AUTH_SESSION_TOKEN_EXPIRES_IN: process.env.BETTER_AUTH_SESSION_TOKEN_EXPIRES_IN,
    BETTER_AUTH_SESSION_TOKEN_UPDATE_AGE: process.env.BETTER_AUTH_SESSION_TOKEN_UPDATE_AGE,
    EMAIL_SENDER: {
      SMTP_USER: process.env.EMAIL_SENDER_SMTP_USER,
      SMTP_PASS: process.env.EMAIL_SENDER_SMTP_PASS,
      SMTP_HOST: process.env.EMAIL_SENDER_SMTP_HOST,
      SMTP_PORT: process.env.EMAIL_SENDER_SMTP_PORT,
      SMTP_FROM: process.env.EMAIL_SENDER_SMTP_FROM
    },
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL,
    FRONTEND_URL: process.env.FRONTEND_URL,
    CLOUDINARY: {
      CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
      CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
      CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET
    },
    ADMIN_EMAIL: process.env.ADMIN_EMAIL,
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
    SSLCOMMERZ: {
      STORE_ID: process.env.SSLCOMMERZ_STORE_ID,
      STORE_PASSWORD: process.env.SSLCOMMERZ_STORE_PASSWORD,
      BASE_URL: process.env.SSLCOMMERZ_BASE_URL,
      SUCCESS_URL: process.env.SSLCOMMERZ_SUCCESS_URL,
      FAIL_URL: process.env.SSLCOMMERZ_FAIL_URL,
      CANCEL_URL: process.env.SSLCOMMERZ_CANCEL_URL,
      IPN_URL: process.env.SSLCOMMERZ_IPN_URL
    }
  };
};
var envVars = loadEnvVariables();

// src/app/lib/prisma.ts
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

// src/generated/prisma/client.ts
import * as path from "path";
import { fileURLToPath } from "url";

// src/generated/prisma/internal/class.ts
import * as runtime from "@prisma/client/runtime/client";
var config = {
  "previewFeatures": [],
  "clientVersion": "7.3.0",
  "engineVersion": "9d6ad21cbbceab97458517b147a6a09ff43aa735",
  "activeProvider": "postgresql",
  "inlineSchema": 'model User {\n  id            String     @id\n  name          String\n  email         String     @unique\n  emailVerified Boolean    @default(false)\n  role          Role       @default(USER)\n  status        UserStatus @default(ACTIVE)\n  isDeleted     Boolean    @default(false)\n  deletedAt     DateTime?\n  image         String?\n  createdAt     DateTime   @default(now())\n  updatedAt     DateTime   @updatedAt\n\n  sessions Session[]\n  accounts Account[]\n\n  // App relations\n  events              Event[]            @relation("OwnedEvents")\n  participation       EventParticipant[]\n  sentInvitations     Invitation[]       @relation("invitedBy")\n  receivedInvitations Invitation[]       @relation("invitedUser")\n  reviews             Review[]\n  payments            Payment[]\n  notifications       Notification[]\n\n  @@map("user")\n}\n\nmodel Session {\n  id        String   @id\n  expiresAt DateTime\n  token     String\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n  ipAddress String?\n  userAgent String?\n  userId    String\n  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@unique([token])\n  @@index([userId])\n  @@map("session")\n}\n\nmodel Account {\n  id                    String    @id\n  accountId             String\n  providerId            String\n  userId                String\n  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)\n  accessToken           String?\n  refreshToken          String?\n  idToken               String?\n  accessTokenExpiresAt  DateTime?\n  refreshTokenExpiresAt DateTime?\n  scope                 String?\n  password              String?\n  createdAt             DateTime  @default(now())\n  updatedAt             DateTime  @updatedAt\n\n  @@index([userId])\n  @@map("account")\n}\n\nmodel Verification {\n  id         String   @id\n  identifier String\n  value      String\n  expiresAt  DateTime\n  createdAt  DateTime @default(now())\n  updatedAt  DateTime @updatedAt\n\n  @@index([identifier])\n  @@map("verification")\n}\n\nenum Role {\n  ADMIN\n  USER\n}\n\nenum UserStatus {\n  ACTIVE\n  BLOCKED\n  DELETED\n}\n\nenum Gender {\n  MALE\n  FEMALE\n  OTHER\n}\n\nenum EventVisibility {\n  PUBLIC\n  PRIVATE\n}\n\nenum EventFeeType {\n  FREE\n  PAID\n}\n\nenum EventStatus {\n  DRAFT\n  PUBLISHED\n  CANCELLED\n  COMPLETED\n}\n\nenum ParticipantStatus {\n  PENDING // awaiting host approval\n  APPROVED // confirmed participant\n  REJECTED // host rejected the request\n  BANNED // removed by host after joining\n}\n\nenum InvitationStatus {\n  PENDING\n  ACCEPTED\n  DECLINED\n}\n\nenum PaymentStatus {\n  UNPAID\n  PAID\n  CANCELLED\n  REFUNDED\n  FAILED\n}\n\nenum PaymentProvider {\n  STRIPE\n  SSLCOMMERZ\n}\n\nenum NotificationType {\n  JOIN_REQUEST // someone requested to join your event\n  REQUEST_APPROVED // your join request was approved\n  REQUEST_REJECTED // your join request was rejected\n  INVITATION_RECEIVED // you received an invitation\n  INVITATION_DECLINED\n  INVITATION_ACCEPTED\n  PARTICIPANT_BANNED // you were banned from an event\n  PAYMENT_SUCCESS // payment confirmed\n  PAYMENT_FAILED // payment failed\n  EVENT_UPDATED // an event you joined was updated\n  EVENT_CANCELLED // an event you joined was cancelled\n  REVIEW_RECEIVED // someone reviewed your event\n}\n\nmodel Event {\n  id              String          @id @default(uuid())\n  title           String\n  slug            String          @unique\n  description     String          @db.Text\n  date            DateTime // event start date\n  time            String // e.g. "18:00" \u2014 stored as string for flexibility\n  endDate         DateTime? // optional end date/time\n  venue           String? // null for online events\n  eventLink       String? // for online events\n  banner          String? // cover image / banner\n  visibility      EventVisibility @default(PUBLIC)\n  feeType         EventFeeType    @default(FREE)\n  registrationFee Decimal         @default(0) @db.Decimal(10, 2)\n  currency        String          @default("BDT")\n  status          EventStatus     @default(PUBLISHED)\n  isFeatured      Boolean         @default(false) // quick-query flag; mirrored in FeaturedEvent\n  maxCapacity     Int? // null = unlimited\n  isDeleted       Boolean         @default(false)\n  deletedAt       DateTime?\n  createdAt       DateTime        @default(now())\n  updatedAt       DateTime        @updatedAt\n\n  ownerId String\n  owner   User   @relation("OwnedEvents", fields: [ownerId], references: [id], onDelete: Cascade)\n\n  categoryId String?\n  category   EventCategory? @relation(fields: [categoryId], references: [id], onDelete: SetNull)\n\n  participants  EventParticipant[]\n  invitations   Invitation[]\n  reviews       Review[]\n  payments      Payment[]\n  featuredEvent FeaturedEvent?\n\n  @@index([ownerId])\n  @@index([categoryId])\n  @@index([visibility, status])\n  @@index([date])\n  @@map("event")\n}\n\nmodel EventCategory {\n  id          String   @id @default(uuid())\n  name        String   @unique\n  description String?\n  createdAt   DateTime @default(now())\n  updatedAt   DateTime @updatedAt\n\n  events Event[]\n\n  @@map("event_category")\n}\n\nmodel EventParticipant {\n  id        String            @id @default(uuid())\n  status    ParticipantStatus @default(PENDING)\n  joinedAt  DateTime? // set when host approves\n  bannedAt  DateTime?\n  banReason String? // reason supplied by host on ban\n  createdAt DateTime          @default(now())\n  updatedAt DateTime          @updatedAt\n\n  eventId String\n  event   Event  @relation(fields: [eventId], references: [id], onDelete: Cascade)\n\n  userId String\n  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  paymentId String?  @unique\n  payment   Payment? @relation(fields: [paymentId], references: [id])\n\n  @@unique([eventId, userId])\n  @@index([eventId])\n  @@index([userId])\n  @@map("event_participant")\n}\n\nmodel FeaturedEvent {\n  id        String   @id @default(uuid())\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  eventId String @unique\n  event   Event  @relation(fields: [eventId], references: [id], onDelete: Cascade)\n\n  @@map("featured_event")\n}\n\nmodel Invitation {\n  id        String           @id @default(uuid())\n  status    InvitationStatus @default(PENDING)\n  message   String? // optional personal note from host\n  expiresAt DateTime?\n  createdAt DateTime         @default(now())\n  updatedAt DateTime         @updatedAt\n\n  eventId String\n  event   Event  @relation(fields: [eventId], references: [id], onDelete: Cascade)\n\n  invitedById String\n  invitedBy   User   @relation("invitedBy", fields: [invitedById], references: [id], onDelete: Cascade)\n\n  invitedUserId String\n  invitedUser   User   @relation("invitedUser", fields: [invitedUserId], references: [id], onDelete: Cascade)\n\n  paymentId String?  @unique\n  payment   Payment? @relation(fields: [paymentId], references: [id])\n\n  @@unique([eventId, invitedUserId])\n  @@index([eventId])\n  @@index([invitedUserId])\n  @@index([invitedById])\n  @@map("invitation")\n}\n\nmodel Notification {\n  id        String           @id @default(uuid())\n  type      NotificationType\n  title     String\n  message   String\n  isRead    Boolean          @default(false)\n  readAt    DateTime?\n  metadata  Json? // e.g. { eventId, invitationId }\n  createdAt DateTime         @default(now())\n\n  userId String\n  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@index([userId, isRead])\n  @@index([userId])\n  @@map("notification")\n}\n\nmodel Payment {\n  id              String          @id @default(uuid())\n  amount          Decimal         @db.Decimal(10, 2)\n  currency        String          @default("BDT")\n  status          PaymentStatus   @default(UNPAID)\n  provider        PaymentProvider\n  transactionId   String?         @unique // from payment gateway\n  paymentUrl      String? // SSLCommerz / ShurjoPay redirect URL\n  gatewayResponse Json? // raw gateway callback payload\n  paidAt          DateTime?\n  createdAt       DateTime        @default(now())\n  updatedAt       DateTime        @updatedAt\n\n  userId String\n  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  eventId String\n  event   Event  @relation(fields: [eventId], references: [id], onDelete: Cascade)\n\n  participant EventParticipant?\n  invitation  Invitation?\n\n  @@index([userId])\n  @@index([eventId])\n  @@index([status])\n  @@map("payment")\n}\n\nmodel Review {\n  id        String    @id @default(uuid())\n  rating    Int // 1\u20135\n  comment   String?   @db.Text\n  isEdited  Boolean   @default(false)\n  editedAt  DateTime?\n  isDeleted Boolean   @default(false)\n  deletedAt DateTime?\n  createdAt DateTime  @default(now())\n  updatedAt DateTime  @updatedAt\n\n  eventId String\n  event   Event  @relation(fields: [eventId], references: [id], onDelete: Cascade)\n\n  userId String\n  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@unique([eventId, userId])\n  @@index([eventId])\n  @@index([userId])\n  @@map("review")\n}\n\n// This is your Prisma schema file,\n// learn more about it in the docs: https://pris.ly/d/prisma-schema\n\n// Looking for ways to speed up your queries, or scale easily with your serverless or edge functions?\n// Try Prisma Accelerate: https://pris.ly/cli/accelerate-init\n\ngenerator client {\n  provider = "prisma-client"\n  output   = "../../src/generated/prisma"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n',
  "runtimeDataModel": {
    "models": {},
    "enums": {},
    "types": {}
  }
};
config.runtimeDataModel = JSON.parse('{"models":{"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"emailVerified","kind":"scalar","type":"Boolean"},{"name":"role","kind":"enum","type":"Role"},{"name":"status","kind":"enum","type":"UserStatus"},{"name":"isDeleted","kind":"scalar","type":"Boolean"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"image","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"sessions","kind":"object","type":"Session","relationName":"SessionToUser"},{"name":"accounts","kind":"object","type":"Account","relationName":"AccountToUser"},{"name":"events","kind":"object","type":"Event","relationName":"OwnedEvents"},{"name":"participation","kind":"object","type":"EventParticipant","relationName":"EventParticipantToUser"},{"name":"sentInvitations","kind":"object","type":"Invitation","relationName":"invitedBy"},{"name":"receivedInvitations","kind":"object","type":"Invitation","relationName":"invitedUser"},{"name":"reviews","kind":"object","type":"Review","relationName":"ReviewToUser"},{"name":"payments","kind":"object","type":"Payment","relationName":"PaymentToUser"},{"name":"notifications","kind":"object","type":"Notification","relationName":"NotificationToUser"}],"dbName":"user"},"Session":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"token","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"SessionToUser"}],"dbName":"session"},"Account":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"accountId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AccountToUser"},{"name":"accessToken","kind":"scalar","type":"String"},{"name":"refreshToken","kind":"scalar","type":"String"},{"name":"idToken","kind":"scalar","type":"String"},{"name":"accessTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"refreshTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"scope","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"account"},"Verification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"identifier","kind":"scalar","type":"String"},{"name":"value","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"verification"},"Event":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"slug","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"date","kind":"scalar","type":"DateTime"},{"name":"time","kind":"scalar","type":"String"},{"name":"endDate","kind":"scalar","type":"DateTime"},{"name":"venue","kind":"scalar","type":"String"},{"name":"eventLink","kind":"scalar","type":"String"},{"name":"banner","kind":"scalar","type":"String"},{"name":"visibility","kind":"enum","type":"EventVisibility"},{"name":"feeType","kind":"enum","type":"EventFeeType"},{"name":"registrationFee","kind":"scalar","type":"Decimal"},{"name":"currency","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"EventStatus"},{"name":"isFeatured","kind":"scalar","type":"Boolean"},{"name":"maxCapacity","kind":"scalar","type":"Int"},{"name":"isDeleted","kind":"scalar","type":"Boolean"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"ownerId","kind":"scalar","type":"String"},{"name":"owner","kind":"object","type":"User","relationName":"OwnedEvents"},{"name":"categoryId","kind":"scalar","type":"String"},{"name":"category","kind":"object","type":"EventCategory","relationName":"EventToEventCategory"},{"name":"participants","kind":"object","type":"EventParticipant","relationName":"EventToEventParticipant"},{"name":"invitations","kind":"object","type":"Invitation","relationName":"EventToInvitation"},{"name":"reviews","kind":"object","type":"Review","relationName":"EventToReview"},{"name":"payments","kind":"object","type":"Payment","relationName":"EventToPayment"},{"name":"featuredEvent","kind":"object","type":"FeaturedEvent","relationName":"EventToFeaturedEvent"}],"dbName":"event"},"EventCategory":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"events","kind":"object","type":"Event","relationName":"EventToEventCategory"}],"dbName":"event_category"},"EventParticipant":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"ParticipantStatus"},{"name":"joinedAt","kind":"scalar","type":"DateTime"},{"name":"bannedAt","kind":"scalar","type":"DateTime"},{"name":"banReason","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"eventId","kind":"scalar","type":"String"},{"name":"event","kind":"object","type":"Event","relationName":"EventToEventParticipant"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"EventParticipantToUser"},{"name":"paymentId","kind":"scalar","type":"String"},{"name":"payment","kind":"object","type":"Payment","relationName":"EventParticipantToPayment"}],"dbName":"event_participant"},"FeaturedEvent":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"eventId","kind":"scalar","type":"String"},{"name":"event","kind":"object","type":"Event","relationName":"EventToFeaturedEvent"}],"dbName":"featured_event"},"Invitation":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"InvitationStatus"},{"name":"message","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"eventId","kind":"scalar","type":"String"},{"name":"event","kind":"object","type":"Event","relationName":"EventToInvitation"},{"name":"invitedById","kind":"scalar","type":"String"},{"name":"invitedBy","kind":"object","type":"User","relationName":"invitedBy"},{"name":"invitedUserId","kind":"scalar","type":"String"},{"name":"invitedUser","kind":"object","type":"User","relationName":"invitedUser"},{"name":"paymentId","kind":"scalar","type":"String"},{"name":"payment","kind":"object","type":"Payment","relationName":"InvitationToPayment"}],"dbName":"invitation"},"Notification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"type","kind":"enum","type":"NotificationType"},{"name":"title","kind":"scalar","type":"String"},{"name":"message","kind":"scalar","type":"String"},{"name":"isRead","kind":"scalar","type":"Boolean"},{"name":"readAt","kind":"scalar","type":"DateTime"},{"name":"metadata","kind":"scalar","type":"Json"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"NotificationToUser"}],"dbName":"notification"},"Payment":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"amount","kind":"scalar","type":"Decimal"},{"name":"currency","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"PaymentStatus"},{"name":"provider","kind":"enum","type":"PaymentProvider"},{"name":"transactionId","kind":"scalar","type":"String"},{"name":"paymentUrl","kind":"scalar","type":"String"},{"name":"gatewayResponse","kind":"scalar","type":"Json"},{"name":"paidAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"PaymentToUser"},{"name":"eventId","kind":"scalar","type":"String"},{"name":"event","kind":"object","type":"Event","relationName":"EventToPayment"},{"name":"participant","kind":"object","type":"EventParticipant","relationName":"EventParticipantToPayment"},{"name":"invitation","kind":"object","type":"Invitation","relationName":"InvitationToPayment"}],"dbName":"payment"},"Review":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"rating","kind":"scalar","type":"Int"},{"name":"comment","kind":"scalar","type":"String"},{"name":"isEdited","kind":"scalar","type":"Boolean"},{"name":"editedAt","kind":"scalar","type":"DateTime"},{"name":"isDeleted","kind":"scalar","type":"Boolean"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"eventId","kind":"scalar","type":"String"},{"name":"event","kind":"object","type":"Event","relationName":"EventToReview"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"ReviewToUser"}],"dbName":"review"}},"enums":{},"types":{}}');
async function decodeBase64AsWasm(wasmBase64) {
  const { Buffer: Buffer2 } = await import("buffer");
  const wasmArray = Buffer2.from(wasmBase64, "base64");
  return new WebAssembly.Module(wasmArray);
}
config.compilerWasm = {
  getRuntime: async () => await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.mjs"),
  getQueryCompilerWasmModule: async () => {
    const { wasm } = await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.mjs");
    return await decodeBase64AsWasm(wasm);
  },
  importName: "./query_compiler_fast_bg.js"
};
function getPrismaClientClass() {
  return runtime.getPrismaClient(config);
}

// src/generated/prisma/internal/prismaNamespace.ts
var prismaNamespace_exports = {};
__export(prismaNamespace_exports, {
  AccountScalarFieldEnum: () => AccountScalarFieldEnum,
  AnyNull: () => AnyNull2,
  DbNull: () => DbNull2,
  Decimal: () => Decimal2,
  EventCategoryScalarFieldEnum: () => EventCategoryScalarFieldEnum,
  EventParticipantScalarFieldEnum: () => EventParticipantScalarFieldEnum,
  EventScalarFieldEnum: () => EventScalarFieldEnum,
  FeaturedEventScalarFieldEnum: () => FeaturedEventScalarFieldEnum,
  InvitationScalarFieldEnum: () => InvitationScalarFieldEnum,
  JsonNull: () => JsonNull2,
  JsonNullValueFilter: () => JsonNullValueFilter,
  ModelName: () => ModelName,
  NotificationScalarFieldEnum: () => NotificationScalarFieldEnum,
  NullTypes: () => NullTypes2,
  NullableJsonNullValueInput: () => NullableJsonNullValueInput,
  NullsOrder: () => NullsOrder,
  PaymentScalarFieldEnum: () => PaymentScalarFieldEnum,
  PrismaClientInitializationError: () => PrismaClientInitializationError2,
  PrismaClientKnownRequestError: () => PrismaClientKnownRequestError2,
  PrismaClientRustPanicError: () => PrismaClientRustPanicError2,
  PrismaClientUnknownRequestError: () => PrismaClientUnknownRequestError2,
  PrismaClientValidationError: () => PrismaClientValidationError2,
  QueryMode: () => QueryMode,
  ReviewScalarFieldEnum: () => ReviewScalarFieldEnum,
  SessionScalarFieldEnum: () => SessionScalarFieldEnum,
  SortOrder: () => SortOrder,
  Sql: () => Sql2,
  TransactionIsolationLevel: () => TransactionIsolationLevel,
  UserScalarFieldEnum: () => UserScalarFieldEnum,
  VerificationScalarFieldEnum: () => VerificationScalarFieldEnum,
  defineExtension: () => defineExtension,
  empty: () => empty2,
  getExtensionContext: () => getExtensionContext,
  join: () => join2,
  prismaVersion: () => prismaVersion,
  raw: () => raw2,
  sql: () => sql
});
import * as runtime2 from "@prisma/client/runtime/client";
var PrismaClientKnownRequestError2 = runtime2.PrismaClientKnownRequestError;
var PrismaClientUnknownRequestError2 = runtime2.PrismaClientUnknownRequestError;
var PrismaClientRustPanicError2 = runtime2.PrismaClientRustPanicError;
var PrismaClientInitializationError2 = runtime2.PrismaClientInitializationError;
var PrismaClientValidationError2 = runtime2.PrismaClientValidationError;
var sql = runtime2.sqltag;
var empty2 = runtime2.empty;
var join2 = runtime2.join;
var raw2 = runtime2.raw;
var Sql2 = runtime2.Sql;
var Decimal2 = runtime2.Decimal;
var getExtensionContext = runtime2.Extensions.getExtensionContext;
var prismaVersion = {
  client: "7.3.0",
  engine: "9d6ad21cbbceab97458517b147a6a09ff43aa735"
};
var NullTypes2 = {
  DbNull: runtime2.NullTypes.DbNull,
  JsonNull: runtime2.NullTypes.JsonNull,
  AnyNull: runtime2.NullTypes.AnyNull
};
var DbNull2 = runtime2.DbNull;
var JsonNull2 = runtime2.JsonNull;
var AnyNull2 = runtime2.AnyNull;
var ModelName = {
  User: "User",
  Session: "Session",
  Account: "Account",
  Verification: "Verification",
  Event: "Event",
  EventCategory: "EventCategory",
  EventParticipant: "EventParticipant",
  FeaturedEvent: "FeaturedEvent",
  Invitation: "Invitation",
  Notification: "Notification",
  Payment: "Payment",
  Review: "Review"
};
var TransactionIsolationLevel = runtime2.makeStrictEnum({
  ReadUncommitted: "ReadUncommitted",
  ReadCommitted: "ReadCommitted",
  RepeatableRead: "RepeatableRead",
  Serializable: "Serializable"
});
var UserScalarFieldEnum = {
  id: "id",
  name: "name",
  email: "email",
  emailVerified: "emailVerified",
  role: "role",
  status: "status",
  isDeleted: "isDeleted",
  deletedAt: "deletedAt",
  image: "image",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var SessionScalarFieldEnum = {
  id: "id",
  expiresAt: "expiresAt",
  token: "token",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  ipAddress: "ipAddress",
  userAgent: "userAgent",
  userId: "userId"
};
var AccountScalarFieldEnum = {
  id: "id",
  accountId: "accountId",
  providerId: "providerId",
  userId: "userId",
  accessToken: "accessToken",
  refreshToken: "refreshToken",
  idToken: "idToken",
  accessTokenExpiresAt: "accessTokenExpiresAt",
  refreshTokenExpiresAt: "refreshTokenExpiresAt",
  scope: "scope",
  password: "password",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var VerificationScalarFieldEnum = {
  id: "id",
  identifier: "identifier",
  value: "value",
  expiresAt: "expiresAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var EventScalarFieldEnum = {
  id: "id",
  title: "title",
  slug: "slug",
  description: "description",
  date: "date",
  time: "time",
  endDate: "endDate",
  venue: "venue",
  eventLink: "eventLink",
  banner: "banner",
  visibility: "visibility",
  feeType: "feeType",
  registrationFee: "registrationFee",
  currency: "currency",
  status: "status",
  isFeatured: "isFeatured",
  maxCapacity: "maxCapacity",
  isDeleted: "isDeleted",
  deletedAt: "deletedAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  ownerId: "ownerId",
  categoryId: "categoryId"
};
var EventCategoryScalarFieldEnum = {
  id: "id",
  name: "name",
  description: "description",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var EventParticipantScalarFieldEnum = {
  id: "id",
  status: "status",
  joinedAt: "joinedAt",
  bannedAt: "bannedAt",
  banReason: "banReason",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  eventId: "eventId",
  userId: "userId",
  paymentId: "paymentId"
};
var FeaturedEventScalarFieldEnum = {
  id: "id",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  eventId: "eventId"
};
var InvitationScalarFieldEnum = {
  id: "id",
  status: "status",
  message: "message",
  expiresAt: "expiresAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  eventId: "eventId",
  invitedById: "invitedById",
  invitedUserId: "invitedUserId",
  paymentId: "paymentId"
};
var NotificationScalarFieldEnum = {
  id: "id",
  type: "type",
  title: "title",
  message: "message",
  isRead: "isRead",
  readAt: "readAt",
  metadata: "metadata",
  createdAt: "createdAt",
  userId: "userId"
};
var PaymentScalarFieldEnum = {
  id: "id",
  amount: "amount",
  currency: "currency",
  status: "status",
  provider: "provider",
  transactionId: "transactionId",
  paymentUrl: "paymentUrl",
  gatewayResponse: "gatewayResponse",
  paidAt: "paidAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  userId: "userId",
  eventId: "eventId"
};
var ReviewScalarFieldEnum = {
  id: "id",
  rating: "rating",
  comment: "comment",
  isEdited: "isEdited",
  editedAt: "editedAt",
  isDeleted: "isDeleted",
  deletedAt: "deletedAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  eventId: "eventId",
  userId: "userId"
};
var SortOrder = {
  asc: "asc",
  desc: "desc"
};
var NullableJsonNullValueInput = {
  DbNull: DbNull2,
  JsonNull: JsonNull2
};
var QueryMode = {
  default: "default",
  insensitive: "insensitive"
};
var NullsOrder = {
  first: "first",
  last: "last"
};
var JsonNullValueFilter = {
  DbNull: DbNull2,
  JsonNull: JsonNull2,
  AnyNull: AnyNull2
};
var defineExtension = runtime2.Extensions.defineExtension;

// src/generated/prisma/client.ts
globalThis["__dirname"] = path.dirname(fileURLToPath(import.meta.url));
var PrismaClient = getPrismaClientClass();

// src/app/lib/prisma.ts
var connectionString = envVars.DATABASE_URL;
var adapter = new PrismaPg({ connectionString });
var prisma = new PrismaClient({ adapter });

// src/app/lib/auth.ts
var auth = betterAuth({
  baseURL: envVars.BETTER_AUTH_URL,
  secret: envVars.BETTER_AUTH_SECRET,
  database: prismaAdapter(prisma, {
    provider: "postgresql"
  }),
  emailAndPassword: {
    enabled: true
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: Role.USER
      },
      status: {
        type: "string",
        required: true,
        defaultValue: UserStatus.ACTIVE
      },
      isDeleted: {
        type: "boolean",
        required: true,
        defaultValue: false
      },
      deletedAt: {
        type: "date",
        required: false,
        defaultValue: null
      }
    }
  },
  plugins: [
    bearer()
  ],
  session: {
    expiresIn: 60 * 60 * 60 * 24,
    // 1 day in seconds
    updateAge: 60 * 60 * 60 * 24,
    // 1 day in seconds
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60 * 60 * 24
      // 1 day in seconds
    }
  }
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

// src/app/middleware/globalErrorHandler.ts
import status4 from "http-status";
import z from "zod";

// src/app/errorHelpers/handlePrismaErrors.ts
import status2 from "http-status";
var getStatusCodeFromPrismaError = (errorCode) => {
  if (errorCode === "P2002") {
    return status2.CONFLICT;
  }
  if (["P2025", "P2001", "P2015", "P2018"].includes(errorCode)) {
    return status2.NOT_FOUND;
  }
  if (["P1000", "P6002"].includes(errorCode)) {
    return status2.UNAUTHORIZED;
  }
  if (["P1010", "P6010"].includes(errorCode)) {
    return status2.FORBIDDEN;
  }
  if (errorCode === "P6003") {
    return status2.PAYMENT_REQUIRED;
  }
  if (["P1008", "P2004", "P6004"].includes(errorCode)) {
    return status2.GATEWAY_TIMEOUT;
  }
  if (errorCode === "P5011") {
    return status2.TOO_MANY_REQUESTS;
  }
  if (errorCode === "P6009") {
    return 413;
  }
  if (errorCode.startsWith("P1") || ["P2024", "P2037", "P6008"].includes(errorCode)) {
    return status2.SERVICE_UNAVAILABLE;
  }
  if (errorCode.startsWith("P2")) {
    return status2.BAD_REQUEST;
  }
  if (errorCode.startsWith("P3") || errorCode.startsWith("P4")) {
    return status2.INTERNAL_SERVER_ERROR;
  }
  return status2.INTERNAL_SERVER_ERROR;
};
var formatErrorMeta = (meta) => {
  if (!meta) return "";
  const parts = [];
  if (meta.target) {
    parts.push(`Field(s): ${String(meta.target)}`);
  }
  if (meta.field_name) {
    parts.push(`Field: ${String(meta.field_name)}`);
  }
  if (meta.column_name) {
    parts.push(`Column: ${String(meta.column_name)}`);
  }
  if (meta.table) {
    parts.push(`Table: ${String(meta.table)}`);
  }
  if (meta.model_name) {
    parts.push(`Model: ${String(meta.model_name)}`);
  }
  if (meta.relation_name) {
    parts.push(`Relation: ${String(meta.relation_name)}`);
  }
  if (meta.constraint) {
    parts.push(`Constraint: ${String(meta.constraint)}`);
  }
  if (meta.database_error) {
    parts.push(`Database Error: ${String(meta.database_error)}`);
  }
  return parts.length > 0 ? parts.join(" |") : "";
};
var handlePrismaClientKnownRequestError = (error) => {
  const statusCode = getStatusCodeFromPrismaError(error.code);
  const metaInfo = formatErrorMeta(error.meta);
  let cleanMessage = error.message;
  cleanMessage = cleanMessage.replace(/Invalid `.*?` invocation:?\s*/i, "");
  const lines = cleanMessage.split("\n").filter((line) => line.trim());
  const mainMessage = lines[0] || "An error occurred with the database operation.";
  const errorSources = [
    {
      path: error.code,
      message: metaInfo ? `${mainMessage} | ${metaInfo}` : mainMessage
    }
  ];
  if (error.meta?.cause) {
    errorSources.push({
      path: "cause",
      message: String(error.meta.cause)
    });
  }
  return {
    success: false,
    statusCode,
    message: `Prisma Client Known Request Error: ${mainMessage}`,
    errorSources
  };
};
var handlePrismaClientUnknownError = (error) => {
  let cleanMessage = error.message;
  cleanMessage = cleanMessage.replace(/Invalid `.*?` invocation:?\s*/i, "");
  const lines = cleanMessage.split("\n").filter((line) => line.trim());
  const mainMessage = lines[0] || "An unknown error occurred with the database operation.";
  const errorSources = [
    {
      path: "Unknown Prisma Error",
      message: mainMessage
    }
  ];
  return {
    success: false,
    statusCode: status2.INTERNAL_SERVER_ERROR,
    message: `Prisma Client Unknown Request Error: ${mainMessage}`,
    errorSources
  };
};
var handlePrismaClientValidationError = (error) => {
  let cleanMessage = error.message;
  cleanMessage = cleanMessage.replace(/Invalid `.*?` invocation:?\s*/i, "");
  const lines = cleanMessage.split("\n").filter((line) => line.trim());
  const errorSources = [];
  const fieldMatch = cleanMessage.match(/Argument `(\w+)`/i);
  const fieldName = fieldMatch ? fieldMatch[1] : "Unknown Field";
  const mainMessage = lines.find(
    (line) => !line.includes("Argument") && !line.includes("\u2192") && line.length > 10
  ) || lines[0] || "Invalid query parameters provided to the database operation.";
  errorSources.push({
    path: fieldName,
    message: mainMessage
  });
  return {
    success: false,
    statusCode: status2.BAD_REQUEST,
    message: `Prisma Client Validation Error: ${mainMessage}`,
    errorSources
  };
};
var handlerPrismaClientInitializationError = (error) => {
  const statusCode = error.errorCode ? getStatusCodeFromPrismaError(error.errorCode) : status2.SERVICE_UNAVAILABLE;
  const cleanMessage = error.message;
  cleanMessage.replace(/Invalid `.*?` invocation:?\s*/i, "");
  const lines = cleanMessage.split("\n").filter((line) => line.trim());
  const mainMessage = lines[0] || "An error occurred while initializing the Prisma Client.";
  const errorSources = [
    {
      path: error.errorCode || "Initialization Error",
      message: mainMessage
    }
  ];
  return {
    success: false,
    statusCode,
    message: `Prisma Client Initialization Error: ${mainMessage}`,
    errorSources
  };
};
var handlerPrismaClientRustPanicError = () => {
  const errorSources = [
    {
      path: "Rust Engine Crashed",
      message: "The database engine encountered a fatal error and crashed. This is usually due to an internal bug in the Prisma engine or an unexpected edge case in the database operation. Please check the Prisma logs for more details and consider reporting this issue to the Prisma team if it persists."
    }
  ];
  return {
    success: false,
    statusCode: status2.INTERNAL_SERVER_ERROR,
    message: "Prisma Client Rust Panic Error: The database engine crashed due to a fatal error.",
    errorSources
  };
};

// src/app/errorHelpers/handleZodError.ts
import status3 from "http-status";
var handleZodError = (err) => {
  const statusCode = status3.BAD_REQUEST;
  const message = "Zod Validation Error";
  const errorSources = [];
  err.issues.forEach((issue) => {
    errorSources.push({
      path: issue.path.join(" => "),
      message: issue.message
    });
  });
  return {
    success: false,
    message,
    errorSources,
    statusCode
  };
};

// src/app/middleware/globalErrorHandler.ts
var globalErrorHandler = async (err, req, res, next) => {
  if (envVars.NODE_ENV === "development") {
    console.log("Global Error Handler", err);
  }
  let errorSources = [];
  let statusCode = status4.INTERNAL_SERVER_ERROR;
  let message = "Internal Server Error";
  let stack = void 0;
  if (err instanceof prismaNamespace_exports.PrismaClientKnownRequestError) {
    const simplifiedError = handlePrismaClientKnownRequestError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = [...simplifiedError.errorSources];
    stack = err.stack;
  } else if (err instanceof prismaNamespace_exports.PrismaClientUnknownRequestError) {
    const simplifiedError = handlePrismaClientUnknownError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = [...simplifiedError.errorSources];
    stack = err.stack;
  } else if (err instanceof prismaNamespace_exports.PrismaClientValidationError) {
    const simplifiedError = handlePrismaClientValidationError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = [...simplifiedError.errorSources];
    stack = err.stack;
  } else if (err instanceof prismaNamespace_exports.PrismaClientRustPanicError) {
    const simplifiedError = handlerPrismaClientRustPanicError();
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = [...simplifiedError.errorSources];
    stack = err.stack;
  } else if (err instanceof prismaNamespace_exports.PrismaClientInitializationError) {
    const simplifiedError = handlerPrismaClientInitializationError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = [...simplifiedError.errorSources];
    stack = err.stack;
  } else if (err instanceof z.ZodError) {
    const simplifiedError = handleZodError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = [...simplifiedError.errorSources];
    stack = err.stack;
  } else if (err instanceof AppError_default) {
    statusCode = err.statusCode;
    message = err.message;
    stack = err.stack;
    errorSources = [
      {
        path: "",
        message: err.message
      }
    ];
  } else if (err instanceof Error) {
    statusCode = status4.INTERNAL_SERVER_ERROR;
    message = err.message;
    stack = err.stack;
    errorSources = [
      {
        path: "",
        message: err.message
      }
    ];
  }
  const errorResponse = {
    success: false,
    message,
    errorSources,
    error: envVars.NODE_ENV === "development" ? err : void 0,
    stack: envVars.NODE_ENV === "development" ? stack : void 0
  };
  res.status(statusCode).json(errorResponse);
};

// src/app/middleware/notFound.ts
import status5 from "http-status";
var notFound = (req, res) => {
  res.status(status5.NOT_FOUND).json({
    success: false,
    message: `Route ${req.originalUrl} Not Found`
  });
};

// src/app/routes/index.ts
import { Router as Router11 } from "express";

// src/app/module/admin/admin.route.ts
import { Router } from "express";

// src/app/middleware/checkAuth.ts
import status6 from "http-status";

// src/app/utils/cookie.ts
var setCookie = (res, key, value, options) => {
  res.cookie(key, value, options);
};
var getCookie = (req, key) => {
  return req.cookies[key];
};
var clearCookie = (res, key, options) => {
  res.clearCookie(key, options);
};
var CookieUtils = {
  setCookie,
  getCookie,
  clearCookie
};

// src/app/utils/jwt.ts
import jwt from "jsonwebtoken";
var createToken = (payload, secret, { expiresIn }) => {
  const token = jwt.sign(payload, secret, { expiresIn });
  return token;
};
var verifyToken = (token, secret) => {
  try {
    const decoded = jwt.verify(token, secret);
    return {
      success: true,
      data: decoded
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
      error
    };
  }
};
var decodeToken = (token) => {
  const decoded = jwt.decode(token);
  return decoded;
};
var jwtUtils = {
  createToken,
  verifyToken,
  decodeToken
};

// src/app/middleware/checkAuth.ts
var checkAuth = (...authRoles) => async (req, res, next) => {
  try {
    const sessionToken = CookieUtils.getCookie(
      req,
      "better-auth.session_token"
    );
    if (!sessionToken) {
      throw new Error(
        "Unauthorized access! No session token provided."
      );
    }
    if (sessionToken) {
      const sessionExists = await prisma.session.findFirst({
        where: {
          token: sessionToken,
          expiresAt: {
            gt: /* @__PURE__ */ new Date()
          }
        },
        include: {
          user: true
        }
      });
      if (sessionExists && sessionExists.user) {
        const user = sessionExists.user;
        const now = /* @__PURE__ */ new Date();
        const expiresAt = new Date(sessionExists.expiresAt);
        const createdAt = new Date(sessionExists.createdAt);
        const sessionLifeTime = expiresAt.getTime() - createdAt.getTime();
        const timeRemaining = expiresAt.getTime() - now.getTime();
        const percentRemaining = timeRemaining / sessionLifeTime * 100;
        if (percentRemaining < 20) {
          res.setHeader("X-Session-Refresh", "true");
          res.setHeader(
            "X-Session-Expires-At",
            expiresAt.toISOString()
          );
          res.setHeader(
            "X-Time-Remaining",
            timeRemaining.toString()
          );
          console.log("Session Expiring Soon!!");
        }
        if (user.status === UserStatus.BLOCKED || user.status === UserStatus.DELETED) {
          throw new AppError_default(
            status6.UNAUTHORIZED,
            "Unauthorized access! User is not active."
          );
        }
        if (user.isDeleted) {
          throw new AppError_default(
            status6.UNAUTHORIZED,
            "Unauthorized access! User is deleted."
          );
        }
        if (authRoles.length > 0 && !authRoles.includes(user.role)) {
          throw new AppError_default(
            status6.FORBIDDEN,
            "Forbidden access! You do not have permission to access this resource."
          );
        }
        req.user = {
          userId: user.id,
          role: user.role,
          email: user.email
        };
      }
    }
    const accessToken = CookieUtils.getCookie(req, "accessToken");
    if (!accessToken) {
      throw new AppError_default(
        status6.UNAUTHORIZED,
        "Unauthorized access! No access token provided."
      );
    }
    const verifiedToken = jwtUtils.verifyToken(
      accessToken,
      envVars.ACCESS_TOKEN_SECRET
    );
    if (!verifiedToken.success) {
      throw new AppError_default(
        status6.UNAUTHORIZED,
        "Unauthorized access! Invalid access token."
      );
    }
    if (authRoles.length > 0 && !authRoles.includes(verifiedToken.data.role)) {
      throw new AppError_default(
        status6.FORBIDDEN,
        "Forbidden access! You do not have permission to access this resource."
      );
    }
    next();
  } catch (error) {
    next(error);
  }
};

// src/app/module/admin/admin.controller.ts
import status8 from "http-status";

// src/app/shared/catchAsync.ts
var catchAsync = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};

// src/app/shared/sendResponse.ts
var sendResponse = (res, responseData) => {
  const { httpStatusCode, success, message, data, meta } = responseData;
  res.status(httpStatusCode).json({
    success,
    message,
    data,
    meta
  });
};

// src/app/module/admin/admin.service.ts
import status7 from "http-status";
var createAdmin = async (payload) => {
  const userExists = await prisma.user.findUnique({
    where: {
      email: payload.admin.email
    }
  });
  if (userExists) {
    throw new AppError_default(
      status7.CONFLICT,
      "User with this email already exists"
    );
  }
  const { admin, role, password } = payload;
  try {
    const userData = await auth.api.signUpEmail({
      body: {
        ...admin,
        password,
        role
      }
    });
    return userData;
  } catch (error) {
    console.log("Error creating admin: ", error);
    throw error;
  }
};
var getAllAdmins = async () => {
  const admins = await prisma.user.findMany({
    where: {
      role: Role.ADMIN
    }
  });
  return admins;
};
var getAdminById = async (id) => {
  const admin = await prisma.user.findUnique({
    where: {
      id
    }
  });
  return admin;
};
var updateAdmin = async (id, payload) => {
  const isAdminExist = await prisma.user.findUnique({
    where: {
      id
    }
  });
  if (!isAdminExist) {
    throw new AppError_default(status7.NOT_FOUND, "Admin  not found");
  }
  const { admin } = payload;
  const updatedAdmin = await prisma.user.update({
    where: {
      id
    },
    data: {
      ...admin
    }
  });
  return updatedAdmin;
};
var deleteAdmin = async (id, user) => {
  const isAdminExist = await prisma.user.findUnique({
    where: {
      id
    }
  });
  if (!isAdminExist) {
    throw new AppError_default(status7.NOT_FOUND, "Admin not found");
  }
  if (isAdminExist.id === user.userId) {
    throw new AppError_default(status7.BAD_REQUEST, "You cannot delete yourself");
  }
  const result = await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: isAdminExist.id },
      data: {
        isDeleted: true,
        deletedAt: /* @__PURE__ */ new Date(),
        status: UserStatus.DELETED
        // Optional: you may also want to block the user
      }
    });
    await tx.session.deleteMany({
      where: { userId: isAdminExist.id }
    });
    await tx.account.deleteMany({
      where: { userId: isAdminExist.id }
    });
    const admin = await getAdminById(id);
    return admin;
  });
  return result;
};
var changeUserStatus = async (user, payload) => {
  const currentUser = await prisma.user.findUniqueOrThrow({
    where: { email: user.email }
  });
  const { userId, userStatus } = payload;
  const targetUser = await prisma.user.findUniqueOrThrow({
    where: { id: userId }
  });
  if (currentUser.id === userId) {
    throw new AppError_default(
      status7.BAD_REQUEST,
      "You cannot change your own status"
    );
  }
  if (currentUser.role === Role.ADMIN && targetUser.role === Role.ADMIN) {
    throw new AppError_default(
      status7.BAD_REQUEST,
      "You cannot change another admin's status"
    );
  }
  if (userStatus === UserStatus.DELETED) {
    throw new AppError_default(
      status7.BAD_REQUEST,
      "Use delete API instead of setting DELETED status"
    );
  }
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { status: userStatus }
  });
  return updatedUser;
};
var changeUserRole = async (user, payload) => {
  const currentUser = await prisma.user.findUniqueOrThrow({
    where: { email: user.email }
  });
  const { userId, role } = payload;
  const targetUser = await prisma.user.findUniqueOrThrow({
    where: { id: userId }
  });
  if (currentUser.role !== Role.ADMIN) {
    throw new AppError_default(
      status7.FORBIDDEN,
      "Only admin can change user roles"
    );
  }
  if (currentUser.id === userId) {
    throw new AppError_default(
      status7.BAD_REQUEST,
      "You cannot change your own role"
    );
  }
  if (targetUser.role === Role.ADMIN) {
    throw new AppError_default(
      status7.BAD_REQUEST,
      "You cannot change another admin's role"
    );
  }
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { role }
  });
  return updatedUser;
};
var AdminService = {
  createAdmin,
  getAllAdmins,
  getAdminById,
  updateAdmin,
  deleteAdmin,
  changeUserStatus,
  changeUserRole
};

// src/app/module/admin/admin.controller.ts
var createAdmin2 = catchAsync(async (req, res) => {
  const payload = req.body;
  const result = await AdminService.createAdmin(payload);
  sendResponse(res, {
    httpStatusCode: status8.CREATED,
    success: true,
    message: "Admin registered successfully",
    data: result
  });
});
var getAllAdmins2 = catchAsync(async (req, res) => {
  const result = await AdminService.getAllAdmins();
  sendResponse(res, {
    httpStatusCode: status8.OK,
    success: true,
    message: "Admins fetched successfully",
    data: result
  });
});
var getAdminById2 = catchAsync(async (req, res) => {
  const { id } = req.params;
  const admin = await AdminService.getAdminById(id);
  sendResponse(res, {
    httpStatusCode: status8.OK,
    success: true,
    message: "Admin fetched successfully",
    data: admin
  });
});
var updateAdmin2 = catchAsync(async (req, res) => {
  const { id } = req.params;
  const payload = req.body;
  const updatedAdmin = await AdminService.updateAdmin(id, payload);
  sendResponse(res, {
    httpStatusCode: status8.OK,
    success: true,
    message: "Admin updated successfully",
    data: updatedAdmin
  });
});
var deleteAdmin2 = catchAsync(async (req, res) => {
  const { id } = req.params;
  const user = req.user;
  const result = await AdminService.deleteAdmin(id, user);
  sendResponse(res, {
    httpStatusCode: status8.OK,
    success: true,
    message: "Admin deleted successfully",
    data: result
  });
});
var changeUserStatus2 = catchAsync(async (req, res) => {
  const user = req.user;
  const payload = req.body;
  const result = await AdminService.changeUserStatus(user, payload);
  sendResponse(res, {
    httpStatusCode: status8.OK,
    success: true,
    message: "User status changed successfully",
    data: result
  });
});
var changeUserRole2 = catchAsync(async (req, res) => {
  const user = req.user;
  const payload = req.body;
  const result = await AdminService.changeUserRole(user, payload);
  sendResponse(res, {
    httpStatusCode: status8.OK,
    success: true,
    message: "User role changed successfully",
    data: result
  });
});
var AdminController = {
  createAdmin: createAdmin2,
  getAllAdmins: getAllAdmins2,
  updateAdmin: updateAdmin2,
  deleteAdmin: deleteAdmin2,
  getAdminById: getAdminById2,
  changeUserStatus: changeUserStatus2,
  changeUserRole: changeUserRole2
};

// src/app/module/admin/admin.route.ts
var router = Router();
router.post(
  "/create-admin",
  checkAuth(Role.ADMIN),
  AdminController.createAdmin
);
router.get("/", checkAuth(Role.ADMIN), AdminController.getAllAdmins);
router.get("/:id", checkAuth(Role.ADMIN), AdminController.getAdminById);
router.patch("/:id", checkAuth(Role.ADMIN), AdminController.updateAdmin);
router.delete("/:id", checkAuth(Role.ADMIN), AdminController.deleteAdmin);
router.patch(
  "/change-user-status",
  checkAuth(Role.ADMIN),
  AdminController.changeUserStatus
);
router.patch(
  "/change-user-role",
  checkAuth(Role.ADMIN),
  AdminController.changeUserRole
);
var AdminRoutes = router;

// src/app/module/auth/auth.route.ts
import { Router as Router2 } from "express";

// src/app/module/auth/auth.controller.ts
import status10 from "http-status";
import ms from "ms";

// src/app/utils/token.ts
var getAccessToken = (payload) => {
  const accessToken = jwtUtils.createToken(
    payload,
    envVars.ACCESS_TOKEN_SECRET,
    { expiresIn: envVars.ACCESS_TOKEN_EXPIRES_IN }
  );
  return accessToken;
};
var getRefreshToken = (payload) => {
  const refreshToken = jwtUtils.createToken(
    payload,
    envVars.REFRESH_TOKEN_SECRET,
    { expiresIn: envVars.REFRESH_TOKEN_EXPIRES_IN }
  );
  return refreshToken;
};
var setAccessTokenCookie = (res, token) => {
  CookieUtils.setCookie(res, "accessToken", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    //1 day
    maxAge: 60 * 60 * 24 * 1e3
  });
};
var setRefreshTokenCookie = (res, token) => {
  CookieUtils.setCookie(res, "refreshToken", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    //7d
    maxAge: 60 * 60 * 24 * 1e3 * 7
  });
};
var setBetterAuthSessionCookie = (res, token) => {
  CookieUtils.setCookie(res, "better-auth.session_token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    //1 day
    maxAge: 60 * 60 * 24 * 1e3
  });
};
var tokenUtils = {
  getAccessToken,
  getRefreshToken,
  setAccessTokenCookie,
  setRefreshTokenCookie,
  setBetterAuthSessionCookie
};

// src/app/module/auth/auth.service.ts
import status9 from "http-status";
var register = async (payload) => {
  const { name, email, password } = payload;
  const data = await auth.api.signUpEmail({
    body: {
      name,
      email,
      password,
      role: Role.USER
    }
  });
  if (!data.user) {
    throw new AppError_default(status9.BAD_REQUEST, "Failed to register user");
  }
  try {
    const accessToken = tokenUtils.getAccessToken({
      userId: data.user.id,
      role: data.user.role,
      name: data.user.name,
      email: data.user.email,
      status: data.user.status,
      isDeleted: data.user.isDeleted,
      emailVerified: data.user.emailVerified
    });
    const refreshToken = tokenUtils.getRefreshToken({
      userId: data.user.id,
      role: data.user.role,
      name: data.user.name,
      email: data.user.email,
      status: data.user.status,
      isDeleted: data.user.isDeleted,
      emailVerified: data.user.emailVerified
    });
    return {
      ...data,
      accessToken,
      refreshToken
    };
  } catch (error) {
    console.log("Transaction error : ", error);
    await prisma.user.delete({
      where: {
        id: data.user.id
      }
    });
    throw error;
  }
};
var loginUser = async (payload) => {
  const { email, password } = payload;
  const data = await auth.api.signInEmail({
    body: {
      email,
      password
    }
  });
  if (data.user.status === UserStatus.BLOCKED) {
    throw new AppError_default(status9.FORBIDDEN, "User is blocked");
  }
  if (data.user.isDeleted || data.user.status === UserStatus.DELETED) {
    throw new AppError_default(status9.NOT_FOUND, "User is deleted");
  }
  const accessToken = tokenUtils.getAccessToken({
    userId: data.user.id,
    role: data.user.role,
    name: data.user.name,
    email: data.user.email,
    status: data.user.status,
    isDeleted: data.user.isDeleted,
    emailVerified: data.user.emailVerified
  });
  const refreshToken = tokenUtils.getRefreshToken({
    userId: data.user.id,
    role: data.user.role,
    name: data.user.name,
    email: data.user.email,
    status: data.user.status,
    isDeleted: data.user.isDeleted,
    emailVerified: data.user.emailVerified
  });
  return {
    ...data,
    accessToken,
    refreshToken
  };
};
var getMe = async (user) => {
  const isUserExists = await prisma.user.findUnique({
    where: {
      id: user.userId
    }
  });
  if (!isUserExists) {
    throw new AppError_default(status9.NOT_FOUND, "User not found");
  }
  return isUserExists;
};
var getNewToken = async (refreshToken, sessionToken) => {
  const isSessionTokenExists = await prisma.session.findUnique({
    where: {
      token: sessionToken
    },
    include: {
      user: true
    }
  });
  if (!isSessionTokenExists) {
    throw new AppError_default(status9.UNAUTHORIZED, "Invalid session token");
  }
  const verifiedRefreshToken = jwtUtils.verifyToken(
    refreshToken,
    envVars.REFRESH_TOKEN_SECRET
  );
  if (!verifiedRefreshToken.success && verifiedRefreshToken.error) {
    throw new AppError_default(status9.UNAUTHORIZED, "Invalid refresh token");
  }
  const data = verifiedRefreshToken.data;
  const newAccessToken = tokenUtils.getAccessToken({
    userId: data.userId,
    role: data.role,
    name: data.name,
    email: data.email,
    status: data.status,
    isDeleted: data.isDeleted,
    emailVerified: data.emailVerified
  });
  const newRefreshToken = tokenUtils.getRefreshToken({
    userId: data.userId,
    role: data.role,
    name: data.name,
    email: data.email,
    status: data.status,
    isDeleted: data.isDeleted,
    emailVerified: data.emailVerified
  });
  const { token } = await prisma.session.update({
    where: {
      token: sessionToken
    },
    data: {
      token: sessionToken,
      expiresAt: new Date(Date.now() + 60 * 60 * 60 * 24 * 1e3),
      updatedAt: /* @__PURE__ */ new Date()
    }
  });
  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
    sessionToken: token,
    user: isSessionTokenExists.user
  };
};
var changePassword = async (payload, sessionToken) => {
  const session = await auth.api.getSession({
    headers: new Headers({
      Authorization: `Bearer ${sessionToken}`
    })
  });
  if (!session) {
    throw new AppError_default(status9.UNAUTHORIZED, "Invalid session token");
  }
  const { currentPassword, newPassword } = payload;
  const result = await auth.api.changePassword({
    body: {
      currentPassword,
      newPassword,
      revokeOtherSessions: true
    },
    headers: new Headers({
      Authorization: `Bearer ${sessionToken}`
    })
  });
  const accessToken = tokenUtils.getAccessToken({
    userId: session.user.id,
    role: session.user.role,
    name: session.user.name,
    email: session.user.email,
    status: session.user.status,
    isDeleted: session.user.isDeleted,
    emailVerified: session.user.emailVerified
  });
  const refreshToken = tokenUtils.getRefreshToken({
    userId: session.user.id,
    role: session.user.role,
    name: session.user.name,
    email: session.user.email,
    status: session.user.status,
    isDeleted: session.user.isDeleted,
    emailVerified: session.user.emailVerified
  });
  return {
    ...result,
    accessToken,
    refreshToken
  };
};
var logoutUser = async (sessionToken) => {
  const result = await auth.api.signOut({
    headers: new Headers({
      Authorization: `Bearer ${sessionToken}`
    })
  });
  return result;
};
var updateProfile = async (user, payload) => {
  const isUserExists = await prisma.user.findUnique({
    where: {
      id: user.userId
    }
  });
  if (!isUserExists) {
    throw new AppError_default(status9.NOT_FOUND, "User not found");
  }
  if (isUserExists.isDeleted || isUserExists.status === UserStatus.DELETED) {
    throw new AppError_default(status9.BAD_REQUEST, "User is deleted");
  }
  const updatedUser = await prisma.user.update({
    where: {
      id: user.userId
    },
    data: {
      ...payload
    }
  });
  return updatedUser;
};
var AuthService = {
  register,
  loginUser,
  getMe,
  getNewToken,
  changePassword,
  logoutUser,
  updateProfile
};

// src/app/module/auth/auth.controller.ts
var register2 = catchAsync(async (req, res) => {
  const maxAge = ms(envVars.ACCESS_TOKEN_EXPIRES_IN);
  console.log({ maxAge });
  const payload = req.body;
  console.log(payload);
  const result = await AuthService.register(payload);
  const { accessToken, refreshToken, token, ...rest } = result;
  tokenUtils.setAccessTokenCookie(res, accessToken);
  tokenUtils.setRefreshTokenCookie(res, refreshToken);
  tokenUtils.setBetterAuthSessionCookie(res, token);
  sendResponse(res, {
    httpStatusCode: status10.CREATED,
    success: true,
    message: "User registered successfully",
    data: {
      token,
      accessToken,
      refreshToken,
      ...rest
    }
  });
});
var loginUser2 = catchAsync(async (req, res) => {
  const payload = req.body;
  const result = await AuthService.loginUser(payload);
  const { accessToken, refreshToken, token, ...rest } = result;
  tokenUtils.setAccessTokenCookie(res, accessToken);
  tokenUtils.setRefreshTokenCookie(res, refreshToken);
  tokenUtils.setBetterAuthSessionCookie(res, token);
  sendResponse(res, {
    httpStatusCode: status10.OK,
    success: true,
    message: "User logged in successfully",
    data: {
      token,
      accessToken,
      refreshToken,
      ...rest
    }
  });
});
var getMe2 = catchAsync(async (req, res) => {
  const user = req.user;
  console.log({ user });
  const result = await AuthService.getMe(user);
  sendResponse(res, {
    httpStatusCode: status10.OK,
    success: true,
    message: "User profile fetched successfully",
    data: result
  });
});
var getNewToken2 = catchAsync(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  const betterAuthSessionToken = req.cookies["better-auth.session_token"];
  if (!refreshToken) {
    throw new AppError_default(status10.UNAUTHORIZED, "Refresh token is missing");
  }
  const result = await AuthService.getNewToken(
    refreshToken,
    betterAuthSessionToken
  );
  const {
    user,
    accessToken,
    refreshToken: newRefreshToken,
    sessionToken
  } = result;
  tokenUtils.setAccessTokenCookie(res, accessToken);
  tokenUtils.setRefreshTokenCookie(res, newRefreshToken);
  tokenUtils.setBetterAuthSessionCookie(res, sessionToken);
  sendResponse(res, {
    httpStatusCode: status10.OK,
    success: true,
    message: "New tokens generated successfully",
    data: {
      accessToken,
      refreshToken: newRefreshToken,
      sessionToken,
      user
    }
  });
});
var changePassword2 = catchAsync(async (req, res) => {
  const payload = req.body;
  const betterAuthSessionToken = req.cookies["better-auth.session_token"];
  const result = await AuthService.changePassword(
    payload,
    betterAuthSessionToken
  );
  const { accessToken, refreshToken, token } = result;
  tokenUtils.setAccessTokenCookie(res, accessToken);
  tokenUtils.setRefreshTokenCookie(res, refreshToken);
  tokenUtils.setBetterAuthSessionCookie(res, token);
  sendResponse(res, {
    httpStatusCode: status10.OK,
    success: true,
    message: "Password changed successfully",
    data: result
  });
});
var logoutUser2 = catchAsync(async (req, res) => {
  const betterAuthSessionToken = req.cookies["better-auth.session_token"];
  const result = await AuthService.logoutUser(betterAuthSessionToken);
  CookieUtils.clearCookie(res, "accessToken", {
    httpOnly: true,
    secure: true,
    sameSite: "none"
  });
  CookieUtils.clearCookie(res, "refreshToken", {
    httpOnly: true,
    secure: true,
    sameSite: "none"
  });
  CookieUtils.clearCookie(res, "better-auth.session_token", {
    httpOnly: true,
    secure: true,
    sameSite: "none"
  });
  sendResponse(res, {
    httpStatusCode: status10.OK,
    success: true,
    message: "User logged out successfully",
    data: result
  });
});
var updateProfile2 = catchAsync(async (req, res) => {
  const user = req.user;
  const payload = req.body;
  const result = await AuthService.updateProfile(user, payload);
  sendResponse(res, {
    httpStatusCode: status10.OK,
    success: true,
    message: "Profile updated successfully",
    data: result
  });
});
var AuthController = {
  register: register2,
  loginUser: loginUser2,
  getMe: getMe2,
  getNewToken: getNewToken2,
  changePassword: changePassword2,
  logoutUser: logoutUser2,
  updateProfile: updateProfile2
};

// src/app/module/auth/auth.route.ts
var router2 = Router2();
router2.post("/register", AuthController.register);
router2.post("/login", AuthController.loginUser);
router2.get("/me", checkAuth(Role.ADMIN, Role.USER), AuthController.getMe);
router2.post("/refresh-token", AuthController.getNewToken);
router2.post(
  "/change-password",
  checkAuth(Role.ADMIN, Role.USER),
  AuthController.changePassword
);
router2.post(
  "/logout",
  checkAuth(Role.ADMIN, Role.USER),
  AuthController.logoutUser
);
router2.patch(
  "/me",
  checkAuth(Role.ADMIN, Role.USER),
  AuthController.updateProfile
);
var AuthRoutes = router2;

// src/app/module/user/user.route.ts
import { Router as Router3 } from "express";

// src/app/module/user/user.controller.ts
import status12 from "http-status";

// src/app/module/user/user.service.ts
import status11 from "http-status";
var getAllUsers = async () => {
  const users = await prisma.user.findMany();
  return users;
};
var getUserById = async (userid) => {
  const user = await prisma.user.findFirst({
    where: {
      id: userid
    }
  });
  if (!user) {
    throw new AppError_default(status11.NOT_FOUND, "User not found!");
  }
  return user;
};
var searchUsers = async (params) => {
  const { search, limit = "20", page = "1" } = params;
  const take = Math.min(parseInt(limit), 50);
  const skip = (parseInt(page) - 1) * take;
  const where = {
    isDeleted: false,
    status: "ACTIVE",
    ...search && {
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } }
      ]
    }
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
        image: true
      },
      orderBy: { name: "asc" }
    }),
    prisma.user.count({ where })
  ]);
  return {
    data: users,
    meta: {
      total,
      page: parseInt(page),
      limit: take,
      totalPages: Math.ceil(total / take)
    }
  };
};
var UserService = {
  getAllUsers,
  getUserById,
  searchUsers
};

// src/app/module/user/user.controller.ts
var getAllUsers2 = catchAsync(async (req, res) => {
  const result = await UserService.getAllUsers();
  sendResponse(res, {
    httpStatusCode: status12.CREATED,
    success: true,
    message: "Users fetched successfully",
    data: result
  });
});
var getUserById2 = catchAsync(async (req, res) => {
  const result = await UserService.getUserById(req.params.id);
  sendResponse(res, {
    httpStatusCode: status12.OK,
    success: true,
    message: "User fetched successfully",
    data: result
  });
});
var searchUsers2 = catchAsync(async (req, res) => {
  const result = await UserService.searchUsers({
    search: req.query.search,
    limit: req.query.limit,
    page: req.query.page
  });
  sendResponse(res, {
    httpStatusCode: status12.OK,
    success: true,
    message: "Users fetched successfully",
    data: result.data,
    meta: result.meta
  });
});
var UserController = {
  getAllUsers: getAllUsers2,
  getUserById: getUserById2,
  searchUsers: searchUsers2
};

// src/app/module/user/user.route.ts
var router3 = Router3();
router3.get("/", UserController.getAllUsers);
router3.get(
  "/search",
  checkAuth(Role.USER, Role.ADMIN),
  UserController.searchUsers
);
router3.get("/:id", UserController.getUserById);
var UserRoutes = router3;

// src/app/module/upload/upload.route.ts
import { Router as Router4 } from "express";

// src/app/config/multer.config.ts
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";

// src/app/config/cloudinary.config.ts
import { v2 as cloudinary } from "cloudinary";
import status13 from "http-status";
cloudinary.config({
  cloud_name: envVars.CLOUDINARY.CLOUDINARY_CLOUD_NAME,
  api_key: envVars.CLOUDINARY.CLOUDINARY_API_KEY,
  api_secret: envVars.CLOUDINARY.CLOUDINARY_API_SECRET
});
var deleteFileFromCloudinary = async (url) => {
  try {
    const regex = /\/v\d+\/(.+?)(?:\.[a-zA-Z0-9]+)+$/;
    const match = url.match(regex);
    if (match && match[1]) {
      const publicId = match[1];
      await cloudinary.uploader.destroy(
        publicId,
        {
          resource_type: "image"
        }
      );
      console.log(`File ${publicId} deleted from cloudinary`);
    }
  } catch (error) {
    console.error("Error deleting file from Cloudinary:", error);
    throw new AppError_default(status13.INTERNAL_SERVER_ERROR, "Failed to delete file from Cloudinary");
  }
};
var cloudinaryUpload = cloudinary;

// src/app/config/multer.config.ts
var storage = new CloudinaryStorage({
  cloudinary: cloudinaryUpload,
  params: async (req, file) => {
    const originalName = file.originalname;
    const extension = originalName.split(".").pop()?.toLocaleLowerCase();
    const fileNameWithoutExtension = originalName.split(".").slice(0, -1).join(".").toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9\-]/g, "");
    const uniqueName = Math.random().toString(36).substring(2) + "-" + Date.now() + "-" + fileNameWithoutExtension;
    const folder = extension === "pdf" ? "pdfs" : "images";
    return {
      folder: `ph-healthcare/${folder}`,
      public_id: uniqueName,
      resource_type: "auto"
    };
  }
});
var multerUpload = multer({ storage });

// src/app/module/upload/upload.controller.ts
import status15 from "http-status";

// src/app/module/upload/upload.service.ts
import status14 from "http-status";
var uploadImage = async (files) => {
  if (!files || files.length === 0) {
    throw new AppError_default(status14.BAD_REQUEST, "No file uploaded");
  }
  if (files.length === 1) {
    return {
      url: files[0].path
    };
  }
  return files.map((file) => ({
    url: file.path
  }));
};
var deleteImage = async (urls) => {
  if (!urls) {
    throw new AppError_default(status14.BAD_REQUEST, "Image URL is required");
  }
  if (Array.isArray(urls)) {
    await Promise.all(urls.map((url) => deleteFileFromCloudinary(url)));
    return null;
  }
  await deleteFileFromCloudinary(urls);
  return null;
};
var UploadService = {
  uploadImage,
  deleteImage
};

// src/app/module/upload/upload.controller.ts
var uploadImage2 = catchAsync(async (req, res) => {
  const files = req.files;
  if (files?.length > 10) {
    throw new AppError_default(status15.BAD_REQUEST, "Maximum 10 images are allowed");
  }
  const result = await UploadService.uploadImage(files);
  sendResponse(res, {
    httpStatusCode: status15.OK,
    success: true,
    message: "Image uploaded successfully",
    data: result
  });
});
var deleteImage2 = catchAsync(async (req, res) => {
  const { url } = req.body;
  const result = await UploadService.deleteImage(url);
  sendResponse(res, {
    httpStatusCode: status15.OK,
    success: true,
    message: "Image deleted successfully",
    data: result
  });
});
var UploadController = {
  uploadImage: uploadImage2,
  deleteImage: deleteImage2
};

// src/app/module/upload/upload.route.ts
var router4 = Router4();
router4.post(
  "/",
  checkAuth(Role.USER, Role.ADMIN),
  multerUpload.array("file", 10),
  // supports 1 or many
  UploadController.uploadImage
);
router4.delete(
  "/delete-image",
  checkAuth(Role.USER, Role.ADMIN),
  UploadController.deleteImage
);
var UploadRoutes = router4;

// src/app/module/event/event.route.ts
import { Router as Router5 } from "express";

// src/app/module/event/event.controller.ts
import status18 from "http-status";

// src/app/module/event/event.service.ts
import status17 from "http-status";

// src/app/module/payment/payment.service.ts
import status16 from "http-status";

// src/app/module/sslcommerz/sslcommerz.service.ts
import axios from "axios";
var sslcommerzInitPayment = async (payload) => {
  const url = `${envVars.SSLCOMMERZ.BASE_URL}/gwprocess/v4/api.php`;
  const data = {
    store_id: envVars.SSLCOMMERZ.STORE_ID,
    store_passwd: envVars.SSLCOMMERZ.STORE_PASSWORD,
    ...payload
  };
  const response = await axios.post(url, data, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  });
  return response.data;
};
var sslcommerzValidatePayment = async (val_id) => {
  const url = `${envVars.SSLCOMMERZ.BASE_URL}/validator/api/validationserverAPI.php`;
  const response = await axios.get(url, {
    params: {
      val_id,
      store_id: envVars.SSLCOMMERZ.STORE_ID,
      store_passwd: envVars.SSLCOMMERZ.STORE_PASSWORD,
      format: "json"
    }
  });
  return response.data;
};
var SSLCommerzService = {
  sslcommerzInitPayment,
  sslcommerzValidatePayment
};

// src/app/module/payment/payment.service.ts
var createPaymentSession = async (userId, payload) => {
  const event = await prisma.event.findFirst({
    where: {
      id: payload.eventId,
      isDeleted: false,
      status: EventStatus.PUBLISHED
    }
  });
  if (!event) throw new AppError_default(status16.NOT_FOUND, "Event not found");
  if (event.feeType !== EventFeeType.PAID || Number(event.registrationFee) <= 0) {
    throw new AppError_default(
      status16.BAD_REQUEST,
      "This event is free. Payment not required"
    );
  }
  if (payload.invitationId) {
    const invitation = await prisma.invitation.findUnique({
      where: { id: payload.invitationId }
    });
    if (!invitation)
      throw new AppError_default(status16.NOT_FOUND, "Invitation not found");
    if (invitation.invitedUserId !== userId) {
      throw new AppError_default(
        status16.FORBIDDEN,
        "This invitation is not for you"
      );
    }
    if (invitation.status !== InvitationStatus.PENDING) {
      throw new AppError_default(
        status16.BAD_REQUEST,
        "Invitation already responded"
      );
    }
  }
  const transactionId = `TXN-${Date.now()}-${Math.floor(Math.random() * 9999)}`;
  const payment = await prisma.payment.create({
    data: {
      amount: event.registrationFee,
      currency: event.currency,
      status: PaymentStatus.UNPAID,
      provider: PaymentProvider.SSLCOMMERZ,
      transactionId,
      userId,
      eventId: event.id
    }
  });
  const initResponse = await SSLCommerzService.sslcommerzInitPayment({
    total_amount: Number(event.registrationFee),
    currency: event.currency,
    tran_id: transactionId,
    success_url: `${envVars.SSLCOMMERZ.SUCCESS_URL}?tran_id=${transactionId}`,
    fail_url: envVars.SSLCOMMERZ.FAIL_URL,
    cancel_url: envVars.SSLCOMMERZ.CANCEL_URL,
    ipn_url: envVars.SSLCOMMERZ.IPN_URL,
    cus_name: "Planora User",
    cus_email: "user@email.com",
    cus_add1: "Dhaka",
    cus_city: "Dhaka",
    cus_postcode: "1207",
    cus_country: "Bangladesh",
    cus_phone: "01700000000",
    product_name: event.title,
    product_category: "Event",
    product_profile: "general"
  });
  if (!initResponse?.GatewayPageURL) {
    throw new AppError_default(
      status16.BAD_REQUEST,
      "SSLCommerz payment session failed"
    );
  }
  await prisma.payment.update({
    where: { id: payment.id },
    data: { paymentUrl: initResponse.GatewayPageURL }
  });
  if (payload.invitationId) {
    await prisma.invitation.update({
      where: { id: payload.invitationId },
      data: { paymentId: payment.id }
    });
  }
  return {
    paymentId: payment.id,
    transactionId,
    paymentUrl: initResponse.GatewayPageURL
  };
};
var sslcommerzSuccess = async (query) => {
  const transactionId = query.tran_id;
  if (!transactionId) {
    throw new AppError_default(status16.BAD_REQUEST, "Invalid SSLCommerz callback");
  }
  const payment = await prisma.payment.findUnique({
    where: { transactionId },
    include: { event: true }
  });
  if (!payment) {
    throw new AppError_default(status16.NOT_FOUND, "Payment record not found");
  }
  if (payment.status === PaymentStatus.PAID) {
    return payment;
  }
  const updated = await prisma.$transaction(async (tx) => {
    const updatedPayment = await tx.payment.update({
      where: { id: payment.id },
      data: {
        status: PaymentStatus.PAID,
        paidAt: /* @__PURE__ */ new Date(),
        gatewayResponse: query
      }
    });
    const autoApprove = payment.event.visibility === EventVisibility.PUBLIC;
    await tx.eventParticipant.upsert({
      where: {
        eventId_userId: {
          eventId: payment.eventId,
          userId: payment.userId
        }
      },
      create: {
        eventId: payment.eventId,
        userId: payment.userId,
        status: autoApprove ? ParticipantStatus.APPROVED : ParticipantStatus.PENDING,
        joinedAt: autoApprove ? /* @__PURE__ */ new Date() : void 0,
        paymentId: payment.id
      },
      update: {
        status: autoApprove ? ParticipantStatus.APPROVED : ParticipantStatus.PENDING,
        joinedAt: autoApprove ? /* @__PURE__ */ new Date() : void 0,
        paymentId: payment.id
      }
    });
    await tx.notification.create({
      data: {
        userId: payment.userId,
        type: NotificationType.PAYMENT_SUCCESS,
        title: "Payment Successful",
        message: `Your payment for "${payment.event.title}" was successful.`,
        metadata: {
          eventId: payment.eventId,
          paymentId: payment.id
        }
      }
    });
    if (!autoApprove) {
      await tx.notification.create({
        data: {
          userId: payment.event.ownerId,
          type: NotificationType.JOIN_REQUEST,
          title: "New Paid Join Request",
          message: `A user has paid and requested to join "${payment.event.title}".`,
          metadata: {
            eventId: payment.eventId,
            paymentId: payment.id,
            userId: payment.userId
          }
        }
      });
    }
    return updatedPayment;
  });
  return updated;
};
var sslcommerzFail = async (query) => {
  const transactionId = query.tran_id;
  if (!transactionId)
    throw new AppError_default(status16.BAD_REQUEST, "Invalid callback");
  const payment = await prisma.payment.findUnique({
    where: { transactionId }
  });
  if (!payment) throw new AppError_default(status16.NOT_FOUND, "Payment not found");
  await prisma.payment.update({
    where: { id: payment.id },
    data: {
      status: PaymentStatus.FAILED,
      gatewayResponse: query
    }
  });
  await prisma.notification.create({
    data: {
      userId: payment.userId,
      type: NotificationType.PAYMENT_FAILED,
      title: "Payment Failed",
      message: "Your payment attempt has failed.",
      metadata: {
        eventId: payment.eventId,
        paymentId: payment.id
      }
    }
  });
  return { message: "Payment failed" };
};
var sslcommerzCancel = async (query) => {
  const transactionId = query.tran_id;
  if (!transactionId)
    throw new AppError_default(status16.BAD_REQUEST, "Invalid callback");
  const payment = await prisma.payment.findUnique({
    where: { transactionId }
  });
  if (!payment) throw new AppError_default(status16.NOT_FOUND, "Payment not found");
  await prisma.payment.update({
    where: { id: payment.id },
    data: {
      status: PaymentStatus.CANCELLED,
      gatewayResponse: query
    }
  });
  return { message: "Payment cancelled" };
};
var getMyPayments = async (userId) => {
  return prisma.payment.findMany({
    where: { userId },
    include: {
      event: { select: { id: true, title: true } }
    },
    orderBy: { createdAt: "desc" }
  });
};
var getPaymentByTransactionId = async (transactionId) => {
  const payment = await prisma.payment.findUnique({
    where: { transactionId },
    include: {
      user: true,
      event: true
    }
  });
  if (!payment) {
    throw new AppError_default(status16.NOT_FOUND, "Payment not found");
  }
  return payment;
};
var getAllPaymentsAdmin = async () => {
  return prisma.payment.findMany({
    include: {
      user: { select: { id: true, name: true, email: true } },
      event: { select: { id: true, title: true } }
    },
    orderBy: { createdAt: "desc" }
  });
};
var PaymentService = {
  createPaymentSession,
  sslcommerzSuccess,
  sslcommerzFail,
  sslcommerzCancel,
  getMyPayments,
  getAllPaymentsAdmin,
  getPaymentByTransactionId
};

// src/app/module/event/event.service.ts
var generateSlug = (title) => {
  return title.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-") + "-" + Date.now();
};
var assertEventOwner = async (eventId, userId) => {
  const event = await prisma.event.findFirst({
    where: { id: eventId, isDeleted: false }
  });
  if (!event) throw new AppError_default(status17.NOT_FOUND, "Event not found");
  if (event.ownerId !== userId) {
    throw new AppError_default(
      status17.FORBIDDEN,
      "You are not the owner of this event"
    );
  }
  return event;
};
var sendNotification = async (tx, userId, type, title, message, metadata) => {
  await tx.notification.create({
    data: {
      userId,
      type,
      title,
      message,
      metadata
    }
  });
};
var createEvent = async (ownerId, payload) => {
  const slug = generateSlug(payload.title);
  const event = await prisma.event.create({
    data: {
      ...payload,
      slug,
      ownerId,
      date: new Date(payload.date),
      endDate: payload.endDate ? new Date(payload.endDate) : void 0,
      registrationFee: payload.registrationFee ?? 0
    },
    include: {
      owner: { select: { id: true, name: true, image: true } },
      category: true
    }
  });
  return event;
};
var getAllEvents = async (query) => {
  const {
    search,
    visibility,
    feeType,
    status: eventStatus,
    categoryId,
    page = "1",
    limit = "10",
    sortBy = "date",
    sortOrder = "asc"
  } = query;
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const take = parseInt(limit);
  const where = {
    isDeleted: false,
    status: eventStatus ?? EventStatus.PUBLISHED,
    ...visibility && { visibility },
    ...feeType && { feeType },
    ...categoryId && { categoryId },
    ...search && {
      OR: [
        { title: { contains: search, mode: "insensitive" } },
        { owner: { name: { contains: search, mode: "insensitive" } } }
      ]
    }
  };
  const [events, total] = await Promise.all([
    prisma.event.findMany({
      where,
      skip,
      take,
      orderBy: { [sortBy]: sortOrder },
      include: {
        owner: { select: { id: true, name: true, image: true } },
        category: { select: { id: true, name: true } },
        _count: { select: { participants: true, reviews: true } }
      }
    }),
    prisma.event.count({ where })
  ]);
  return {
    data: events,
    meta: {
      total,
      page: parseInt(page),
      limit: take,
      totalPages: Math.ceil(total / take)
    }
  };
};
var getEventById = async (eventId, requesterId) => {
  const event = await prisma.event.findFirst({
    where: { id: eventId, isDeleted: false },
    include: {
      owner: { select: { id: true, name: true, image: true } },
      category: true,
      featuredEvent: true,
      _count: { select: { participants: true, reviews: true } },
      reviews: {
        where: { isDeleted: false },
        orderBy: { createdAt: "desc" },
        take: 5,
        include: {
          user: { select: { id: true, name: true, image: true } }
        }
      }
    }
  });
  if (!event) throw new AppError_default(status17.NOT_FOUND, "Event not found");
  if (event.visibility === EventVisibility.PRIVATE && event.ownerId !== requesterId) {
    if (!requesterId) {
      throw new AppError_default(status17.FORBIDDEN, "This is a private event");
    }
    const participant = await prisma.eventParticipant.findUnique({
      where: { eventId_userId: { eventId, userId: requesterId } }
    });
    if (!participant || participant.status !== ParticipantStatus.APPROVED) {
      throw new AppError_default(status17.FORBIDDEN, "This is a private event");
    }
  }
  return event;
};
var updateEvent = async (eventId, ownerId, payload) => {
  const event = await assertEventOwner(eventId, ownerId);
  const updatedEvent = await prisma.$transaction(async (tx) => {
    const updated = await tx.event.update({
      where: { id: eventId },
      data: {
        ...payload,
        ...payload.date && { date: new Date(payload.date) },
        ...payload.endDate && { endDate: new Date(payload.endDate) }
      },
      include: {
        owner: { select: { id: true, name: true, image: true } },
        category: true
      }
    });
    const participants = await tx.eventParticipant.findMany({
      where: {
        eventId,
        status: ParticipantStatus.APPROVED
      },
      select: { userId: true }
    });
    for (const p of participants) {
      if (p.userId !== ownerId) {
        await sendNotification(
          tx,
          p.userId,
          NotificationType.EVENT_UPDATED,
          "Event Updated",
          `"${event.title}" has been updated`,
          { eventId }
        );
      }
    }
    return updated;
  });
  return updatedEvent;
};
var deleteEvent = async (eventId, ownerId) => {
  const event = await assertEventOwner(eventId, ownerId);
  await prisma.$transaction(async (tx) => {
    await tx.event.update({
      where: { id: eventId },
      data: {
        isDeleted: true,
        deletedAt: /* @__PURE__ */ new Date(),
        status: EventStatus.CANCELLED
      }
    });
    const participants = await tx.eventParticipant.findMany({
      where: {
        eventId,
        status: ParticipantStatus.APPROVED
      },
      select: { userId: true }
    });
    for (const p of participants) {
      if (p.userId !== ownerId) {
        await sendNotification(
          tx,
          p.userId,
          NotificationType.EVENT_CANCELLED,
          "Event Cancelled",
          `"${event.title}" has been cancelled`,
          { eventId }
        );
      }
    }
  });
  return { message: "Event deleted successfully" };
};
var getAllEventsAdmin = async (query) => {
  const {
    search,
    visibility,
    feeType,
    status: eventStatus,
    page = "1",
    limit = "10",
    sortBy = "createdAt",
    sortOrder = "desc"
  } = query;
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const take = parseInt(limit);
  const where = {
    ...visibility && { visibility },
    ...feeType && { feeType },
    ...eventStatus && { status: eventStatus },
    ...search && {
      OR: [
        { title: { contains: search, mode: "insensitive" } },
        { owner: { name: { contains: search, mode: "insensitive" } } }
      ]
    }
  };
  const [events, total] = await Promise.all([
    prisma.event.findMany({
      where,
      skip,
      take,
      orderBy: { [sortBy]: sortOrder },
      include: {
        owner: { select: { id: true, name: true, email: true } },
        category: { select: { id: true, name: true } },
        _count: { select: { participants: true, reviews: true } }
      }
    }),
    prisma.event.count({ where })
  ]);
  return {
    data: events,
    meta: {
      total,
      page: parseInt(page),
      limit: take,
      totalPages: Math.ceil(total / take)
    }
  };
};
var adminDeleteEvent = async (eventId) => {
  const event = await prisma.event.findUnique({ where: { id: eventId } });
  if (!event) throw new AppError_default(status17.NOT_FOUND, "Event not found");
  await prisma.$transaction(async (tx) => {
    await tx.event.update({
      where: { id: eventId },
      data: {
        isDeleted: true,
        deletedAt: /* @__PURE__ */ new Date(),
        status: EventStatus.CANCELLED
      }
    });
    const participants = await tx.eventParticipant.findMany({
      where: {
        eventId,
        status: ParticipantStatus.APPROVED
      },
      select: { userId: true }
    });
    for (const p of participants) {
      if (p.userId !== event.ownerId) {
        await sendNotification(
          tx,
          p.userId,
          NotificationType.EVENT_CANCELLED,
          "Event Cancelled",
          `"${event.title}" has been cancelled by Admin`,
          { eventId }
        );
      }
    }
  });
  return { message: "Event removed by admin" };
};
var setFeaturedEvent = async (eventId) => {
  const event = await prisma.event.findFirst({
    where: { id: eventId, isDeleted: false, status: EventStatus.PUBLISHED }
  });
  if (!event)
    throw new AppError_default(status17.NOT_FOUND, "Published event not found");
  await prisma.$transaction([
    prisma.event.updateMany({
      where: { isFeatured: true },
      data: { isFeatured: false }
    }),
    prisma.featuredEvent.deleteMany(),
    prisma.featuredEvent.create({ data: { eventId } }),
    prisma.event.update({
      where: { id: eventId },
      data: { isFeatured: true }
    })
  ]);
  return { message: "Featured event updated" };
};
var getFeaturedEvent = async () => {
  const featured = await prisma.featuredEvent.findFirst({
    include: {
      event: {
        include: {
          owner: { select: { id: true, name: true, image: true } },
          category: true,
          _count: { select: { participants: true } }
        }
      }
    }
  });
  if (!featured)
    throw new AppError_default(status17.NOT_FOUND, "No featured event set");
  return featured.event;
};
var joinEvent = async (eventId, userId) => {
  const event = await prisma.event.findFirst({
    where: {
      id: eventId,
      isDeleted: false,
      status: EventStatus.PUBLISHED
    }
  });
  if (!event) throw new AppError_default(status17.NOT_FOUND, "Event not found");
  const existing = await prisma.eventParticipant.findUnique({
    where: { eventId_userId: { eventId, userId } }
  });
  if (existing) {
    if (existing.status === ParticipantStatus.BANNED) {
      throw new AppError_default(status17.FORBIDDEN, "You have been banned from this event");
    }
    throw new AppError_default(
      status17.CONFLICT,
      "You have already joined or requested to join this event"
    );
  }
  if (event.feeType === EventFeeType.PAID) {
    const paymentSession = await PaymentService.createPaymentSession(userId, {
      eventId
    });
    return {
      status: "PAYMENT_REQUIRED",
      payment: paymentSession
    };
  }
  const autoApprove = event.visibility === EventVisibility.PUBLIC;
  const participant = await prisma.$transaction(async (tx) => {
    const created = await tx.eventParticipant.create({
      data: {
        eventId,
        userId,
        status: autoApprove ? ParticipantStatus.APPROVED : ParticipantStatus.PENDING,
        joinedAt: autoApprove ? /* @__PURE__ */ new Date() : void 0
      }
    });
    if (!autoApprove) {
      await sendNotification(
        tx,
        event.ownerId,
        NotificationType.JOIN_REQUEST,
        "New Join Request",
        `Someone requested to join "${event.title}"`,
        { eventId, userId }
      );
    }
    return created;
  });
  return participant;
};
var getEventParticipants = async (eventId, ownerId, participantStatus) => {
  await assertEventOwner(eventId, ownerId);
  const participants = await prisma.eventParticipant.findMany({
    where: {
      eventId,
      ...participantStatus && { status: participantStatus }
    },
    include: {
      user: {
        select: { id: true, name: true, email: true, image: true }
      },
      payment: {
        select: { id: true, status: true, amount: true, paidAt: true }
      }
    },
    orderBy: { createdAt: "desc" }
  });
  return participants;
};
var approveParticipant = async (eventId, ownerId, participantUserId) => {
  const event = await assertEventOwner(eventId, ownerId);
  const participant = await prisma.eventParticipant.findUnique({
    where: { eventId_userId: { eventId, userId: participantUserId } }
  });
  if (!participant)
    throw new AppError_default(status17.NOT_FOUND, "Participant not found");
  if (participant.status !== ParticipantStatus.PENDING)
    throw new AppError_default(
      status17.BAD_REQUEST,
      "Participant is not in pending state"
    );
  const updated = await prisma.$transaction(async (tx) => {
    const updatedParticipant = await tx.eventParticipant.update({
      where: { eventId_userId: { eventId, userId: participantUserId } },
      data: { status: ParticipantStatus.APPROVED, joinedAt: /* @__PURE__ */ new Date() }
    });
    await sendNotification(
      tx,
      participantUserId,
      NotificationType.REQUEST_APPROVED,
      "Request Approved",
      `Your request to join "${event.title}" has been approved`,
      { eventId }
    );
    return updatedParticipant;
  });
  return updated;
};
var rejectParticipant = async (eventId, ownerId, participantUserId) => {
  const event = await assertEventOwner(eventId, ownerId);
  const participant = await prisma.eventParticipant.findUnique({
    where: { eventId_userId: { eventId, userId: participantUserId } }
  });
  if (!participant)
    throw new AppError_default(status17.NOT_FOUND, "Participant not found");
  if (participant.status !== ParticipantStatus.PENDING)
    throw new AppError_default(
      status17.BAD_REQUEST,
      "Can only reject a pending request"
    );
  const updated = await prisma.$transaction(async (tx) => {
    const updatedParticipant = await tx.eventParticipant.update({
      where: { eventId_userId: { eventId, userId: participantUserId } },
      data: { status: ParticipantStatus.REJECTED }
    });
    await sendNotification(
      tx,
      participantUserId,
      NotificationType.REQUEST_REJECTED,
      "Request Rejected",
      `Your request to join "${event.title}" has been rejected`,
      { eventId }
    );
    return updatedParticipant;
  });
  return updated;
};
var banParticipant = async (eventId, ownerId, participantUserId, banReason) => {
  const event = await assertEventOwner(eventId, ownerId);
  const participant = await prisma.eventParticipant.findUnique({
    where: { eventId_userId: { eventId, userId: participantUserId } }
  });
  if (!participant)
    throw new AppError_default(status17.NOT_FOUND, "Participant not found");
  if (participant.status === ParticipantStatus.BANNED)
    throw new AppError_default(status17.BAD_REQUEST, "Participant is already banned");
  const updated = await prisma.$transaction(async (tx) => {
    const updatedParticipant = await tx.eventParticipant.update({
      where: { eventId_userId: { eventId, userId: participantUserId } },
      data: {
        status: ParticipantStatus.BANNED,
        bannedAt: /* @__PURE__ */ new Date(),
        banReason: banReason ?? null
      }
    });
    await sendNotification(
      tx,
      participantUserId,
      NotificationType.PARTICIPANT_BANNED,
      "You Have Been Banned",
      `You have been banned from "${event.title}"`,
      { eventId, banReason }
    );
    return updatedParticipant;
  });
  return updated;
};
var inviteUser = async (eventId, invitedById, invitedUserId, message) => {
  const event = await assertEventOwner(eventId, invitedById);
  if (invitedById === invitedUserId)
    throw new AppError_default(status17.BAD_REQUEST, "You cannot invite yourself");
  const invitedUser = await prisma.user.findUnique({
    where: { id: invitedUserId }
  });
  if (!invitedUser)
    throw new AppError_default(status17.NOT_FOUND, "User to invite not found");
  const existing = await prisma.invitation.findUnique({
    where: { eventId_invitedUserId: { eventId, invitedUserId } }
  });
  if (existing)
    throw new AppError_default(status17.CONFLICT, "User has already been invited");
  const result = await prisma.$transaction(async (tx) => {
    const invitation = await tx.invitation.create({
      data: { eventId, invitedById, invitedUserId, message },
      include: {
        invitedUser: {
          select: { id: true, name: true, email: true, image: true }
        },
        event: { select: { id: true, title: true } }
      }
    });
    await sendNotification(
      tx,
      invitedUserId,
      NotificationType.INVITATION_RECEIVED,
      "New Event Invitation",
      `You have been invited to join "${event.title}"`,
      { eventId, invitationId: invitation.id, invitedById }
    );
    return invitation;
  });
  return result;
};
var getMyInvitations = async (userId) => {
  return prisma.invitation.findMany({
    where: { invitedUserId: userId },
    include: {
      event: {
        include: {
          owner: { select: { id: true, name: true, image: true } }
        }
      },
      payment: { select: { id: true, status: true, amount: true } }
    },
    orderBy: { createdAt: "desc" }
  });
};
var respondToInvitation = async (invitationId, userId, action) => {
  const invitation = await prisma.invitation.findUnique({
    where: { id: invitationId },
    include: { event: true }
  });
  if (!invitation)
    throw new AppError_default(status17.NOT_FOUND, "Invitation not found");
  if (invitation.invitedUserId !== userId)
    throw new AppError_default(status17.FORBIDDEN, "This invitation is not for you");
  if (invitation.status !== InvitationStatus.PENDING)
    throw new AppError_default(status17.BAD_REQUEST, "Invitation already responded");
  if (invitation.expiresAt && /* @__PURE__ */ new Date() > invitation.expiresAt)
    throw new AppError_default(status17.BAD_REQUEST, "This invitation has expired");
  const event = invitation.event;
  const updatedInvitation = await prisma.$transaction(async (tx) => {
    const updated = await tx.invitation.update({
      where: { id: invitationId },
      data: { status: action }
    });
    await sendNotification(
      tx,
      event.ownerId,
      NotificationType.EVENT_UPDATED,
      "Invitation Response",
      `A user ${action.toLowerCase()} your invitation for "${event.title}"`,
      {
        eventId: invitation.eventId,
        invitationId: invitation.id,
        userId
      }
    );
    return updated;
  });
  return updatedInvitation;
};
var getMyEvents = async (ownerId, query) => {
  const { page = "1", limit = "10", status: eventStatus } = query;
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const take = parseInt(limit);
  const where = {
    ownerId,
    isDeleted: false,
    ...eventStatus && { status: eventStatus }
  };
  const [events, total] = await Promise.all([
    prisma.event.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: "desc" },
      include: {
        category: { select: { id: true, name: true } },
        _count: {
          select: {
            participants: true,
            reviews: true,
            invitations: true
          }
        }
      }
    }),
    prisma.event.count({ where })
  ]);
  return {
    data: events,
    meta: {
      total,
      page: parseInt(page),
      limit: take,
      totalPages: Math.ceil(total / take)
    }
  };
};
var getMyParticipation = async (userId) => {
  return prisma.eventParticipant.findMany({
    where: { userId },
    include: {
      event: {
        include: {
          owner: { select: { id: true, name: true, image: true } },
          category: { select: { id: true, name: true } }
        }
      },
      payment: { select: { id: true, status: true, amount: true } }
    },
    orderBy: { createdAt: "desc" }
  });
};
var sendBulkInvitations = async (eventId, invitedById, invitedUserIds, message) => {
  const event = await assertEventOwner(eventId, invitedById);
  if (!invitedUserIds || invitedUserIds.length === 0) {
    throw new AppError_default(status17.BAD_REQUEST, "No users to invite");
  }
  const uniqueIds = [...new Set(invitedUserIds)];
  const filteredIds = uniqueIds.filter((id) => id !== invitedById);
  const successful = [];
  const failed = [];
  for (const invitedUserId of filteredIds) {
    try {
      const invitedUser = await prisma.user.findUnique({
        where: { id: invitedUserId },
        select: { id: true, name: true }
      });
      if (!invitedUser) {
        failed.push({
          userId: invitedUserId,
          reason: "User not found"
        });
        continue;
      }
      const existing = await prisma.invitation.findUnique({
        where: {
          eventId_invitedUserId: { eventId, invitedUserId }
        }
      });
      if (existing) {
        failed.push({
          userId: invitedUserId,
          reason: "User has already been invited"
        });
        continue;
      }
      const invitation = await prisma.$transaction(async (tx) => {
        const inv = await tx.invitation.create({
          data: { eventId, invitedById, invitedUserId, message }
        });
        await tx.notification.create({
          data: {
            userId: invitedUserId,
            type: NotificationType.INVITATION_RECEIVED,
            title: "New Event Invitation",
            message: `You have been invited to join "${event.title}"`,
            metadata: {
              eventId,
              invitationId: inv.id,
              invitedById
            }
          }
        });
        return inv;
      });
      successful.push({
        userId: invitedUserId,
        invitationId: invitation.id
      });
    } catch (err) {
      failed.push({
        userId: invitedUserId,
        reason: err?.message ?? "Unknown error"
      });
    }
  }
  return {
    summary: {
      total: filteredIds.length,
      successCount: successful.length,
      failedCount: failed.length
    },
    successful,
    failed
  };
};
var getEventInvitations = async (eventId, ownerId) => {
  await assertEventOwner(eventId, ownerId);
  const invitations = await prisma.invitation.findMany({
    where: { eventId },
    select: {
      id: true,
      invitedUserId: true,
      status: true,
      createdAt: true,
      invitedUser: {
        select: { id: true, name: true, email: true, image: true }
      }
    },
    orderBy: { createdAt: "desc" }
  });
  return invitations;
};
var EventService = {
  // Event CRUD
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  // Admin
  getAllEventsAdmin,
  adminDeleteEvent,
  // Featured
  setFeaturedEvent,
  getFeaturedEvent,
  // Participation
  joinEvent,
  getEventParticipants,
  approveParticipant,
  rejectParticipant,
  banParticipant,
  // Invitations
  inviteUser,
  getMyInvitations,
  respondToInvitation,
  // Dashboard
  getMyEvents,
  getMyParticipation,
  // bulk invitation
  sendBulkInvitations,
  getEventInvitations
};

// src/app/module/event/event.controller.ts
var createEvent2 = catchAsync(async (req, res) => {
  const ownerId = req.user.userId;
  const result = await EventService.createEvent(ownerId, req.body);
  sendResponse(res, {
    httpStatusCode: status18.CREATED,
    success: true,
    message: "Event created successfully",
    data: result
  });
});
var getAllEvents2 = catchAsync(async (req, res) => {
  const result = await EventService.getAllEvents(req.query);
  sendResponse(res, {
    httpStatusCode: status18.OK,
    success: true,
    message: "Events fetched successfully",
    data: result.data,
    meta: result.meta
  });
});
var getEventById2 = catchAsync(async (req, res) => {
  const requesterId = req.user?.userId;
  const result = await EventService.getEventById(
    req.params.id,
    requesterId
  );
  sendResponse(res, {
    httpStatusCode: status18.OK,
    success: true,
    message: "Event fetched successfully",
    data: result
  });
});
var updateEvent2 = catchAsync(async (req, res) => {
  const ownerId = req.user.userId;
  const result = await EventService.updateEvent(
    req.params.id,
    ownerId,
    req.body
  );
  sendResponse(res, {
    httpStatusCode: status18.OK,
    success: true,
    message: "Event updated successfully",
    data: result
  });
});
var deleteEvent2 = catchAsync(async (req, res) => {
  const ownerId = req.user.userId;
  const result = await EventService.deleteEvent(
    req.params.id,
    ownerId
  );
  sendResponse(res, {
    httpStatusCode: status18.OK,
    success: true,
    message: result.message,
    data: null
  });
});
var getAllEventsAdmin2 = catchAsync(async (req, res) => {
  const result = await EventService.getAllEventsAdmin(req.query);
  sendResponse(res, {
    httpStatusCode: status18.OK,
    success: true,
    message: "All events fetched",
    data: result.data,
    meta: result.meta
  });
});
var adminDeleteEvent2 = catchAsync(async (req, res) => {
  const result = await EventService.adminDeleteEvent(req.params.id);
  sendResponse(res, {
    httpStatusCode: status18.OK,
    success: true,
    message: result.message,
    data: null
  });
});
var getFeaturedEvent2 = catchAsync(async (_req, res) => {
  const result = await EventService.getFeaturedEvent();
  sendResponse(res, {
    httpStatusCode: status18.OK,
    success: true,
    message: "Featured event fetched",
    data: result
  });
});
var setFeaturedEvent2 = catchAsync(async (req, res) => {
  const result = await EventService.setFeaturedEvent(req.params.id);
  sendResponse(res, {
    httpStatusCode: status18.OK,
    success: true,
    message: result.message,
    data: null
  });
});
var joinEvent2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const result = await EventService.joinEvent(
    req.params.id,
    userId
  );
  if (result.status === "PAYMENT_REQUIRED") {
    return sendResponse(res, {
      httpStatusCode: status18.OK,
      success: true,
      message: "Payment required to join this event",
      data: result
    });
  }
  sendResponse(res, {
    httpStatusCode: status18.CREATED,
    success: true,
    message: result.status === "APPROVED" ? "Joined event successfully" : "Join request sent, awaiting approval",
    data: result
  });
});
var getEventParticipants2 = catchAsync(async (req, res) => {
  const ownerId = req.user.userId;
  const participantStatus = req.query.status;
  const result = await EventService.getEventParticipants(
    req.params.id,
    ownerId,
    participantStatus
  );
  sendResponse(res, {
    httpStatusCode: status18.OK,
    success: true,
    message: "Participants fetched successfully",
    data: result
  });
});
var approveParticipant2 = catchAsync(async (req, res) => {
  const ownerId = req.user.userId;
  const result = await EventService.approveParticipant(
    req.params.id,
    ownerId,
    req.params.userId
  );
  sendResponse(res, {
    httpStatusCode: status18.OK,
    success: true,
    message: "Participant approved",
    data: result
  });
});
var rejectParticipant2 = catchAsync(async (req, res) => {
  const ownerId = req.user.userId;
  const result = await EventService.rejectParticipant(
    req.params.id,
    ownerId,
    req.params.userId
  );
  sendResponse(res, {
    httpStatusCode: status18.OK,
    success: true,
    message: "Participant rejected",
    data: result
  });
});
var banParticipant2 = catchAsync(async (req, res) => {
  const ownerId = req.user.userId;
  const { banReason } = req.body;
  const result = await EventService.banParticipant(
    req.params.id,
    ownerId,
    req.params.userId,
    banReason
  );
  sendResponse(res, {
    httpStatusCode: status18.OK,
    success: true,
    message: "Participant banned",
    data: result
  });
});
var inviteUser2 = catchAsync(async (req, res) => {
  const invitedById = req.user.userId;
  const { invitedUserId, message } = req.body;
  const result = await EventService.inviteUser(
    req.params.id,
    invitedById,
    invitedUserId,
    message
  );
  sendResponse(res, {
    httpStatusCode: status18.CREATED,
    success: true,
    message: "Invitation sent successfully",
    data: result
  });
});
var getMyInvitations2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const result = await EventService.getMyInvitations(userId);
  sendResponse(res, {
    httpStatusCode: status18.OK,
    success: true,
    message: "Invitations fetched successfully",
    data: result
  });
});
var respondToInvitation2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const { action } = req.body;
  const result = await EventService.respondToInvitation(
    req.params.invitationId,
    userId,
    action
  );
  sendResponse(res, {
    httpStatusCode: status18.OK,
    success: true,
    message: `Invitation ${action.toLowerCase()} successfully`,
    data: result
  });
});
var getMyEvents2 = catchAsync(async (req, res) => {
  const ownerId = req.user.userId;
  const result = await EventService.getMyEvents(ownerId, req.query);
  sendResponse(res, {
    httpStatusCode: status18.OK,
    success: true,
    message: "Your events fetched successfully",
    data: result.data,
    meta: result.meta
  });
});
var getMyParticipation2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const result = await EventService.getMyParticipation(userId);
  sendResponse(res, {
    httpStatusCode: status18.OK,
    success: true,
    message: "Your participation fetched successfully",
    data: result
  });
});
var sendBulkInvitations2 = catchAsync(async (req, res) => {
  const invitedById = req.user.userId;
  const { invitedUserIds, message } = req.body;
  const userIds = invitedUserIds ?? (req.body.invitedUserId ? [req.body.invitedUserId] : []);
  const result = await EventService.sendBulkInvitations(
    req.params.id,
    invitedById,
    userIds,
    message
  );
  sendResponse(res, {
    httpStatusCode: status18.CREATED,
    success: true,
    message: `${result.summary.successCount} invitation(s) sent successfully`,
    data: result
  });
});
var getEventInvitations2 = catchAsync(async (req, res) => {
  const ownerId = req.user.userId;
  const result = await EventService.getEventInvitations(
    req.params.id,
    ownerId
  );
  sendResponse(res, {
    httpStatusCode: status18.OK,
    success: true,
    message: "Event invitations fetched successfully",
    data: result
  });
});
var EventController = {
  createEvent: createEvent2,
  getAllEvents: getAllEvents2,
  getEventById: getEventById2,
  updateEvent: updateEvent2,
  deleteEvent: deleteEvent2,
  getAllEventsAdmin: getAllEventsAdmin2,
  adminDeleteEvent: adminDeleteEvent2,
  getFeaturedEvent: getFeaturedEvent2,
  setFeaturedEvent: setFeaturedEvent2,
  joinEvent: joinEvent2,
  getEventParticipants: getEventParticipants2,
  approveParticipant: approveParticipant2,
  rejectParticipant: rejectParticipant2,
  banParticipant: banParticipant2,
  inviteUser: inviteUser2,
  getMyInvitations: getMyInvitations2,
  respondToInvitation: respondToInvitation2,
  getMyEvents: getMyEvents2,
  getMyParticipation: getMyParticipation2,
  sendBulkInvitations: sendBulkInvitations2,
  getEventInvitations: getEventInvitations2
};

// src/app/middleware/optionalCheckAuth.ts
var optionalCheckAuth = (...authRoles) => async (req, res, next) => {
  try {
    const sessionToken = CookieUtils.getCookie(
      req,
      "better-auth.session_token"
    );
    if (sessionToken) {
      const sessionExists = await prisma.session.findFirst({
        where: {
          token: sessionToken,
          expiresAt: {
            gt: /* @__PURE__ */ new Date()
          }
        },
        include: {
          user: true
        }
      });
      if (sessionExists?.user) {
        const user = sessionExists.user;
        if (user.status === UserStatus.BLOCKED || user.status === UserStatus.DELETED || user.isDeleted) {
          return next();
        }
        if (authRoles.length > 0 && !authRoles.includes(user.role)) {
          return next();
        }
        req.user = {
          userId: user.id,
          role: user.role,
          email: user.email
        };
        return next();
      }
    }
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
    if (authRoles.length > 0 && !authRoles.includes(verifiedToken.data.role)) {
      return next();
    }
    req.user = {
      userId: verifiedToken.data.userId,
      role: verifiedToken.data.role,
      email: verifiedToken.data.email
    };
    next();
  } catch (error) {
    next();
  }
};

// src/app/module/event/event.route.ts
var router5 = Router5();
router5.get("/featured", EventController.getFeaturedEvent);
router5.get("/", EventController.getAllEvents);
router5.get("/:id", optionalCheckAuth(), EventController.getEventById);
router5.get(
  "/me/events",
  checkAuth(Role.USER, Role.ADMIN),
  EventController.getMyEvents
);
router5.get(
  "/me/joined",
  checkAuth(Role.USER, Role.ADMIN),
  EventController.getMyParticipation
);
router5.get(
  "/invitations/me",
  checkAuth(Role.USER, Role.ADMIN),
  EventController.getMyInvitations
);
router5.patch(
  "/invitations/:invitationId",
  checkAuth(Role.USER, Role.ADMIN),
  EventController.respondToInvitation
);
router5.post("/", checkAuth(Role.USER, Role.ADMIN), EventController.createEvent);
router5.put(
  "/:id",
  checkAuth(Role.USER, Role.ADMIN),
  EventController.updateEvent
);
router5.delete(
  "/:id",
  checkAuth(Role.USER, Role.ADMIN),
  EventController.deleteEvent
);
router5.post(
  "/:id/join",
  checkAuth(Role.USER, Role.ADMIN),
  EventController.joinEvent
);
router5.post(
  "/:id/invite",
  checkAuth(Role.USER, Role.ADMIN),
  EventController.inviteUser
);
router5.post(
  "/:id/bulk-invite",
  checkAuth(Role.USER, Role.ADMIN),
  EventController.sendBulkInvitations
  // handles both single & bulk
);
router5.get(
  "/:id/invitations",
  checkAuth(Role.USER, Role.ADMIN),
  EventController.getEventInvitations
  // fetch existing invitations
);
router5.get(
  "/:id/participants",
  checkAuth(Role.USER, Role.ADMIN),
  EventController.getEventParticipants
);
router5.patch(
  "/:id/participants/:userId/approve",
  checkAuth(Role.USER, Role.ADMIN),
  EventController.approveParticipant
);
router5.patch(
  "/:id/participants/:userId/reject",
  checkAuth(Role.USER, Role.ADMIN),
  EventController.rejectParticipant
);
router5.patch(
  "/:id/participants/:userId/ban",
  checkAuth(Role.USER, Role.ADMIN),
  EventController.banParticipant
);
router5.get(
  "/admin/all",
  checkAuth(Role.ADMIN),
  EventController.getAllEventsAdmin
);
router5.delete(
  "/admin/:id",
  checkAuth(Role.ADMIN),
  EventController.adminDeleteEvent
);
router5.patch(
  "/admin/:id/feature",
  checkAuth(Role.ADMIN),
  EventController.setFeaturedEvent
);
var EventRoutes = router5;

// src/app/module/eventCategory/eventCategory.route.ts
import { Router as Router6 } from "express";

// src/app/module/eventCategory/eventCategory.controller.ts
import status20 from "http-status";

// src/app/module/eventCategory/eventCategory.service.ts
import status19 from "http-status";
var createCategory = async (payload) => {
  const existing = await prisma.eventCategory.findUnique({
    where: { name: payload.name }
  });
  if (existing) {
    throw new AppError_default(status19.CONFLICT, "Category already exists!");
  }
  const category = await prisma.eventCategory.create({
    data: {
      name: payload.name,
      description: payload.description
    }
  });
  return category;
};
var getAllCategories = async () => {
  const categories = await prisma.eventCategory.findMany({
    orderBy: { createdAt: "desc" }
  });
  return categories;
};
var getCategoryById = async (id) => {
  const category = await prisma.eventCategory.findUnique({
    where: { id }
  });
  if (!category) {
    throw new AppError_default(status19.NOT_FOUND, "Category not found!");
  }
  return category;
};
var updateCategory = async (id, payload) => {
  const category = await prisma.eventCategory.findUnique({
    where: { id }
  });
  if (!category) {
    throw new AppError_default(status19.NOT_FOUND, "Category not found!");
  }
  if (payload.name) {
    const existing = await prisma.eventCategory.findFirst({
      where: {
        name: payload.name,
        NOT: { id }
      }
    });
    if (existing) {
      throw new AppError_default(
        status19.CONFLICT,
        "Category name already exists!"
      );
    }
  }
  const updatedCategory = await prisma.eventCategory.update({
    where: { id },
    data: payload
  });
  return updatedCategory;
};
var deleteCategory = async (id) => {
  const category = await prisma.eventCategory.findUnique({
    where: { id }
  });
  if (!category) {
    throw new AppError_default(status19.NOT_FOUND, "Category not found!");
  }
  const deletedCategory = await prisma.eventCategory.delete({
    where: { id }
  });
  return deletedCategory;
};
var EventCategoryService = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory
};

// src/app/module/eventCategory/eventCategory.controller.ts
var createCategory2 = catchAsync(async (req, res) => {
  const result = await EventCategoryService.createCategory(req.body);
  sendResponse(res, {
    httpStatusCode: status20.CREATED,
    success: true,
    message: "Category created successfully",
    data: result
  });
});
var getAllCategories2 = catchAsync(async (req, res) => {
  const result = await EventCategoryService.getAllCategories();
  sendResponse(res, {
    httpStatusCode: status20.OK,
    success: true,
    message: "Categories fetched successfully",
    data: result
  });
});
var getCategoryById2 = catchAsync(async (req, res) => {
  const result = await EventCategoryService.getCategoryById(
    req.params.id
  );
  sendResponse(res, {
    httpStatusCode: status20.OK,
    success: true,
    message: "Category fetched successfully",
    data: result
  });
});
var updateCategory2 = catchAsync(async (req, res) => {
  const result = await EventCategoryService.updateCategory(
    req.params.id,
    req.body
  );
  sendResponse(res, {
    httpStatusCode: status20.OK,
    success: true,
    message: "Category updated successfully",
    data: result
  });
});
var deleteCategory2 = catchAsync(async (req, res) => {
  const result = await EventCategoryService.deleteCategory(
    req.params.id
  );
  sendResponse(res, {
    httpStatusCode: status20.OK,
    success: true,
    message: "Category deleted successfully",
    data: result
  });
});
var EventCategoryController = {
  createCategory: createCategory2,
  getAllCategories: getAllCategories2,
  getCategoryById: getCategoryById2,
  updateCategory: updateCategory2,
  deleteCategory: deleteCategory2
};

// src/app/module/eventCategory/eventCategory.route.ts
var router6 = Router6();
router6.post("/", EventCategoryController.createCategory);
router6.get("/", EventCategoryController.getAllCategories);
router6.get("/:id", EventCategoryController.getCategoryById);
router6.patch("/:id", EventCategoryController.updateCategory);
router6.delete("/:id", EventCategoryController.deleteCategory);
var EventCategoryRoutes = router6;

// src/app/module/review/review.route.ts
import { Router as Router7 } from "express";

// src/app/module/review/review.controller.ts
import status22 from "http-status";

// src/app/module/review/review.service.ts
import status21 from "http-status";
var createReview = async (userId, payload) => {
  const { eventId, rating, comment } = payload;
  if (rating < 1 || rating > 5) {
    throw new AppError_default(status21.BAD_REQUEST, "Rating must be between 1 and 5!");
  }
  const event = await prisma.event.findUnique({
    where: { id: eventId }
  });
  if (!event || event.isDeleted) {
    throw new AppError_default(status21.NOT_FOUND, "Event not found!");
  }
  const participant = await prisma.eventParticipant.findFirst({
    where: {
      eventId,
      userId,
      status: ParticipantStatus.APPROVED
    }
  });
  if (!participant) {
    throw new AppError_default(
      status21.FORBIDDEN,
      "You must join and be approved to review this event!"
    );
  }
  const existingReview = await prisma.review.findFirst({
    where: {
      eventId,
      userId,
      isDeleted: false
    }
  });
  if (existingReview) {
    throw new AppError_default(status21.CONFLICT, "You already reviewed this event!");
  }
  const review = await prisma.review.create({
    data: {
      eventId,
      userId,
      rating,
      comment
    }
  });
  return review;
};
var getReviewsByEvent = async (eventId) => {
  const event = await prisma.event.findUnique({
    where: { id: eventId }
  });
  if (!event || event.isDeleted) {
    throw new AppError_default(status21.NOT_FOUND, "Event not found!");
  }
  const reviews = await prisma.review.findMany({
    where: {
      eventId,
      isDeleted: false
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          image: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });
  return reviews;
};
var getMyReviews = async (userId) => {
  const reviews = await prisma.review.findMany({
    where: {
      userId,
      isDeleted: false
    },
    include: {
      event: {
        select: {
          id: true,
          title: true,
          slug: true,
          date: true,
          banner: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });
  return reviews;
};
var updateReview = async (userId, reviewId, payload) => {
  const review = await prisma.review.findUnique({
    where: { id: reviewId }
  });
  if (!review || review.isDeleted) {
    throw new AppError_default(status21.NOT_FOUND, "Review not found!");
  }
  if (review.userId !== userId) {
    throw new AppError_default(status21.FORBIDDEN, "You are not allowed to update this review!");
  }
  if (payload.rating && (payload.rating < 1 || payload.rating > 5)) {
    throw new AppError_default(status21.BAD_REQUEST, "Rating must be between 1 and 5!");
  }
  const updatedReview = await prisma.review.update({
    where: { id: reviewId },
    data: {
      rating: payload.rating ?? review.rating,
      comment: payload.comment ?? review.comment,
      isEdited: true,
      editedAt: /* @__PURE__ */ new Date()
    }
  });
  return updatedReview;
};
var deleteReview = async (userId, reviewId) => {
  const review = await prisma.review.findUnique({
    where: { id: reviewId }
  });
  if (!review || review.isDeleted) {
    throw new AppError_default(status21.NOT_FOUND, "Review not found!");
  }
  if (review.userId !== userId) {
    throw new AppError_default(status21.FORBIDDEN, "You are not allowed to delete this review!");
  }
  const deletedReview = await prisma.review.update({
    where: { id: reviewId },
    data: {
      isDeleted: true,
      deletedAt: /* @__PURE__ */ new Date()
    }
  });
  return deletedReview;
};
var ReviewService = {
  createReview,
  getReviewsByEvent,
  getMyReviews,
  updateReview,
  deleteReview
};

// src/app/module/review/review.controller.ts
var createReview2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const result = await ReviewService.createReview(userId, req.body);
  sendResponse(res, {
    httpStatusCode: status22.CREATED,
    success: true,
    message: "Review created successfully",
    data: result
  });
});
var getReviewsByEvent2 = catchAsync(async (req, res) => {
  const result = await ReviewService.getReviewsByEvent(
    req.params.eventId
  );
  sendResponse(res, {
    httpStatusCode: status22.OK,
    success: true,
    message: "Reviews fetched successfully",
    data: result
  });
});
var getMyReviews2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const result = await ReviewService.getMyReviews(userId);
  sendResponse(res, {
    httpStatusCode: status22.OK,
    success: true,
    message: "My reviews fetched successfully",
    data: result
  });
});
var updateReview2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const result = await ReviewService.updateReview(
    userId,
    req.params.id,
    req.body
  );
  sendResponse(res, {
    httpStatusCode: status22.OK,
    success: true,
    message: "Review updated successfully",
    data: result
  });
});
var deleteReview2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const result = await ReviewService.deleteReview(
    userId,
    req.params.id
  );
  sendResponse(res, {
    httpStatusCode: status22.OK,
    success: true,
    message: "Review deleted successfully",
    data: result
  });
});
var ReviewController = {
  createReview: createReview2,
  getReviewsByEvent: getReviewsByEvent2,
  getMyReviews: getMyReviews2,
  updateReview: updateReview2,
  deleteReview: deleteReview2
};

// src/app/module/review/review.route.ts
var router7 = Router7();
router7.post("/", checkAuth(Role.USER, Role.ADMIN), ReviewController.createReview);
router7.get("/event/:eventId", ReviewController.getReviewsByEvent);
router7.get("/me", checkAuth(Role.USER, Role.ADMIN), ReviewController.getMyReviews);
router7.patch("/:id", checkAuth(Role.USER, Role.ADMIN), ReviewController.updateReview);
router7.delete("/:id", checkAuth(Role.USER, Role.ADMIN), ReviewController.deleteReview);
var ReviewRoutes = router7;

// src/app/module/notification/notification.route.ts
import { Router as Router8 } from "express";

// src/app/module/notification/notification.controller.ts
import status24 from "http-status";

// src/app/module/notification/notification.service.ts
import status23 from "http-status";
var createNotification = async (payload) => {
  const notification = await prisma.notification.create({
    data: {
      userId: payload.userId,
      type: payload.type,
      title: payload.title,
      message: payload.message,
      metadata: payload.metadata
    }
  });
  return notification;
};
var getMyNotifications = async (userId, query) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;
  const whereCondition = {
    userId
  };
  if (query.unread === "true") {
    whereCondition.isRead = false;
  }
  const notifications = await prisma.notification.findMany({
    where: whereCondition,
    orderBy: {
      createdAt: "desc"
    },
    skip,
    take: limit
  });
  const total = await prisma.notification.count({
    where: whereCondition
  });
  return {
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    },
    data: notifications
  };
};
var getUnreadCount = async (userId) => {
  const count = await prisma.notification.count({
    where: {
      userId,
      isRead: false
    }
  });
  return count;
};
var markAsRead = async (userId, notificationId) => {
  const notification = await prisma.notification.findUnique({
    where: { id: notificationId }
  });
  if (!notification) {
    throw new AppError_default(status23.NOT_FOUND, "Notification not found!");
  }
  if (notification.userId !== userId) {
    throw new AppError_default(
      status23.FORBIDDEN,
      "You are not allowed to access this notification!"
    );
  }
  const updatedNotification = await prisma.notification.update({
    where: { id: notificationId },
    data: {
      isRead: true,
      readAt: /* @__PURE__ */ new Date()
    }
  });
  return updatedNotification;
};
var markAllAsRead = async (userId) => {
  const result = await prisma.notification.updateMany({
    where: {
      userId,
      isRead: false
    },
    data: {
      isRead: true,
      readAt: /* @__PURE__ */ new Date()
    }
  });
  return result;
};
var deleteNotification = async (userId, notificationId) => {
  const notification = await prisma.notification.findUnique({
    where: { id: notificationId }
  });
  if (!notification) {
    throw new AppError_default(status23.NOT_FOUND, "Notification not found!");
  }
  if (notification.userId !== userId) {
    throw new AppError_default(
      status23.FORBIDDEN,
      "You are not allowed to delete this notification!"
    );
  }
  const deleted = await prisma.notification.delete({
    where: { id: notificationId }
  });
  return deleted;
};
var NotificationService = {
  createNotification,
  getMyNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification
};

// src/app/module/notification/notification.controller.ts
var getMyNotifications2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const { data, meta } = await NotificationService.getMyNotifications(
    userId,
    req.query
  );
  sendResponse(res, {
    httpStatusCode: status24.OK,
    success: true,
    message: "Notifications fetched successfully",
    data,
    meta
  });
});
var getUnreadCount2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const result = await NotificationService.getUnreadCount(userId);
  sendResponse(res, {
    httpStatusCode: status24.OK,
    success: true,
    message: "Unread notification count fetched successfully",
    data: { unreadCount: result }
  });
});
var markAsRead2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const notificationId = req.params.id;
  const result = await NotificationService.markAsRead(
    userId,
    notificationId
  );
  sendResponse(res, {
    httpStatusCode: status24.OK,
    success: true,
    message: "Notification marked as read",
    data: result
  });
});
var markAllAsRead2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const result = await NotificationService.markAllAsRead(userId);
  sendResponse(res, {
    httpStatusCode: status24.OK,
    success: true,
    message: "All notifications marked as read",
    data: result
  });
});
var deleteNotification2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const notificationId = req.params.id;
  const result = await NotificationService.deleteNotification(
    userId,
    notificationId
  );
  sendResponse(res, {
    httpStatusCode: status24.OK,
    success: true,
    message: "Notification deleted successfully",
    data: result
  });
});
var NotificationController = {
  getMyNotifications: getMyNotifications2,
  getUnreadCount: getUnreadCount2,
  markAsRead: markAsRead2,
  markAllAsRead: markAllAsRead2,
  deleteNotification: deleteNotification2
};

// src/app/module/notification/notification.route.ts
var router8 = Router8();
router8.get(
  "/",
  checkAuth(Role.USER, Role.ADMIN),
  NotificationController.getMyNotifications
);
router8.get(
  "/unread-count",
  checkAuth(Role.USER, Role.ADMIN),
  NotificationController.getUnreadCount
);
router8.patch(
  "/mark-read/:id",
  checkAuth(Role.USER, Role.ADMIN),
  NotificationController.markAsRead
);
router8.patch(
  "/mark-read",
  checkAuth(Role.USER, Role.ADMIN),
  NotificationController.markAllAsRead
);
router8.delete(
  "/:id",
  checkAuth(Role.USER, Role.ADMIN),
  NotificationController.deleteNotification
);
var NotificationRoutes = router8;

// src/app/module/payment/payment.route.ts
import { Router as Router9 } from "express";

// src/app/module/payment/payment.controller.ts
import status25 from "http-status";
var createPaymentSession2 = catchAsync(async (req, res) => {
  const result = await PaymentService.createPaymentSession(
    req.user.userId,
    req.body
  );
  sendResponse(res, {
    httpStatusCode: status25.CREATED,
    success: true,
    message: "Payment session created successfully",
    data: result
  });
});
var sslcommerzSuccess2 = catchAsync(async (req, res) => {
  console.log("query from ssl success", req.query);
  console.log("body from ssl success", req.body);
  await PaymentService.sslcommerzSuccess(req.query);
  res.redirect(
    `${envVars.FRONTEND_URL}/payment-success?tran_id=${req.body.tran_id}`
  );
});
var sslcommerzFail2 = catchAsync(async (req, res) => {
  await PaymentService.sslcommerzFail(req.query);
  res.redirect(
    `${envVars.FRONTEND_URL}/payment-failed?tran_id=${req.body.tran_id}&status=failed`
  );
});
var sslcommerzCancel2 = catchAsync(async (req, res) => {
  await PaymentService.sslcommerzCancel(req.query);
  res.redirect(
    `${envVars.FRONTEND_URL}/payment-failed?tran_id=${req.body.tran_id}&status=cancelled`
  );
});
var getMyPayments2 = catchAsync(async (req, res) => {
  const result = await PaymentService.getMyPayments(req.user.userId);
  sendResponse(res, {
    httpStatusCode: status25.OK,
    success: true,
    message: "Payments fetched successfully",
    data: result
  });
});
var getAllPaymentsAdmin2 = catchAsync(async (req, res) => {
  const result = await PaymentService.getAllPaymentsAdmin();
  sendResponse(res, {
    httpStatusCode: status25.OK,
    success: true,
    message: "All payments fetched successfully",
    data: result
  });
});
var getPaymentByTransactionId2 = catchAsync(
  async (req, res) => {
    const { transactionId } = req.params;
    const result = await PaymentService.getPaymentByTransactionId(
      transactionId
    );
    sendResponse(res, {
      httpStatusCode: status25.OK,
      success: true,
      message: "Payment fetched successfully",
      data: result
    });
  }
);
var PaymentController = {
  createPaymentSession: createPaymentSession2,
  sslcommerzSuccess: sslcommerzSuccess2,
  sslcommerzFail: sslcommerzFail2,
  sslcommerzCancel: sslcommerzCancel2,
  getMyPayments: getMyPayments2,
  getAllPaymentsAdmin: getAllPaymentsAdmin2,
  getPaymentByTransactionId: getPaymentByTransactionId2
};

// src/app/module/payment/payment.route.ts
var router9 = Router9();
router9.post(
  "/create-session",
  checkAuth(Role.USER, Role.ADMIN),
  PaymentController.createPaymentSession
);
router9.post("/sslcommerz/success", PaymentController.sslcommerzSuccess);
router9.post("/sslcommerz/fail", PaymentController.sslcommerzFail);
router9.post("/sslcommerz/cancel", PaymentController.sslcommerzCancel);
router9.get(
  "/my",
  checkAuth(Role.USER, Role.ADMIN),
  PaymentController.getMyPayments
);
router9.get(
  "/transaction/:transactionId",
  checkAuth(Role.USER, Role.ADMIN),
  PaymentController.getPaymentByTransactionId
);
router9.get("/", checkAuth(Role.ADMIN), PaymentController.getAllPaymentsAdmin);
var PaymentRoutes = router9;

// src/app/module/stats/stats.route.ts
import { Router as Router10 } from "express";

// src/app/module/stats/stats.controller.ts
import status26 from "http-status";

// src/app/module/stats/stats.service.ts
var getAdminDashboardStats = async () => {
  const [
    totalUsers,
    totalEvents,
    totalPayments,
    revenueResult,
    pendingParticipants,
    activeEvents
  ] = await Promise.all([
    // Total registered users (non-deleted)
    prisma.user.count({
      where: { isDeleted: false }
    }),
    // Total events (non-deleted)
    prisma.event.count({
      where: { isDeleted: false }
    }),
    // Total payment records
    prisma.payment.count(),
    // Sum of all PAID payments
    prisma.payment.aggregate({
      _sum: { amount: true },
      where: { status: "PAID" }
    }),
    // Participants still waiting for approval
    prisma.eventParticipant.count({
      where: { status: "PENDING" }
    }),
    // Events currently published and not deleted
    prisma.event.count({
      where: {
        status: "PUBLISHED",
        isDeleted: false
      }
    })
  ]);
  return {
    totalUsers,
    totalEvents,
    totalPayments,
    totalRevenue: (revenueResult._sum.amount ?? 0).toString(),
    pendingParticipants,
    activeEvents
  };
};
var StatsService = {
  getAdminDashboardStats
};

// src/app/module/stats/stats.controller.ts
var getAdminDashboardStats2 = catchAsync(
  async (req, res) => {
    const result = await StatsService.getAdminDashboardStats();
    sendResponse(res, {
      httpStatusCode: status26.CREATED,
      success: true,
      message: "Dashboard stats fetched successfully.",
      data: result
    });
  }
);
var StatsController = {
  getAdminDashboardStats: getAdminDashboardStats2
};

// src/app/module/stats/stats.route.ts
var router10 = Router10();
router10.get("/admin", checkAuth(Role.ADMIN), StatsController.getAdminDashboardStats);
var StatsRoutes = router10;

// src/app/routes/index.ts
var router11 = Router11();
router11.use("/auth", AuthRoutes);
router11.use("/users", UserRoutes);
router11.use("/admins", AdminRoutes);
router11.use("/upload", UploadRoutes);
router11.use("/events", EventRoutes);
router11.use("/event-categories", EventCategoryRoutes);
router11.use("/reviews", ReviewRoutes);
router11.use("/notifications", NotificationRoutes);
router11.use("/payment", PaymentRoutes);
router11.use("/stats", StatsRoutes);
var IndexRoutes = router11;

// src/app.ts
var app = express();
app.set("query parser", (str) => qs.parse(str));
app.set("view engine", "ejs");
app.set("views", path2.resolve(process.cwd(), `src/app/templates`));
app.use("/api/v1/payment/sslcommerz", (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});
app.use(
  cors({
    origin: function(origin, callback) {
      const allowedOrigins = [
        process.env.FRONTEND_URL,
        process.env.PROD_CLIENT_URL,
        "https://sandbox.sslcommerz.com",
        "https://securepay.sslcommerz.com"
      ];
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, false);
      }
    },
    credentials: true
  })
);
app.use("/api/auth", toNodeHandler(auth));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use("/api/v1", IndexRoutes);
app.get("/", async (req, res) => {
  res.status(201).json({
    success: true,
    message: "Welcome in Eventro Backend"
  });
});
app.use(globalErrorHandler);
app.use(notFound);
var app_default = app;

// src/index.ts
var index_default = app_default;
export {
  index_default as default
};
