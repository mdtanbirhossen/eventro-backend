/* eslint-disable @typescript-eslint/no-explicit-any */
import { toNodeHandler } from "better-auth/node";
import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application, Request, Response } from "express";
import cron from "node-cron";
import path from "path";
import qs from "qs";
import { envVars } from "./app/config/env";
import { auth } from "./app/lib/auth";
import { globalErrorHandler } from "./app/middleware/globalErrorHandler";
import { notFound } from "./app/middleware/notFound";
import { IndexRoutes } from "./app/routes";

const app: Application = express();
app.set("query parser", (str: string) => qs.parse(str));

app.set("view engine", "ejs");
app.set("views", path.resolve(process.cwd(), `src/app/templates`));

// app.use(
//   "/api/v1/payment/sslcommerz",
//   cors({ origin: "*", credentials: false }) // SSLCommerz hits these, not the browser
// );

app.use("/api/v1/payment/sslcommerz", (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

app.use(
    cors({
        origin: function (origin, callback) {
            const allowedOrigins = [
                process.env.FRONTEND_URL,
                process.env.PROD_CLIENT_URL,
                "https://sandbox.sslcommerz.com",
                "https://securepay.sslcommerz.com",
            ];

            if (!origin) return callback(null, true);

            if (allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(null, false);
            }
        },
        credentials: true,
    }),
);

app.use("/api/auth", toNodeHandler(auth));

// Enable URL-encoded form data parsing
app.use(express.urlencoded({ extended: true }));

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1", IndexRoutes);

// Basic route
app.get("/", async (req: Request, res: Response) => {
    res.status(201).json({
        success: true,
        message: "API is working",
    });
});

app.use(globalErrorHandler);
app.use(notFound);

export default app;
