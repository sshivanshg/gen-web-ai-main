import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import fs from "fs";
import { FRONTEND_URL } from "./utils/config.js";
import morgan from "morgan";
import websiteRouter from "./routes/website.route.js";
import billingRouter from "./routes/billing.route.js";
import { stripeWebhook } from "./controllers/stripeWebhook.controller.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const normalizeOrigin = (origin) => origin?.replace(/\/$/, "");

app.post(
    "/api/stripe/webhook",
    express.raw({ type: "application/json" }),
    stripeWebhook,
);

app.use(morgan("dev"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

const allowedOrigins = new Set([
    normalizeOrigin(FRONTEND_URL),
    "https://aiwebgen-ecru.vercel.app",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:4173",
    "http://127.0.0.1:4173",
]);

app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin) {
                callback(null, true);
                return;
            }

            const isAllowed =
                allowedOrigins.has(origin) ||
                origin.includes("localhost") ||
                origin.includes("127.0.0.1") ||
                origin.endsWith(".vercel.app");

            if (isAllowed) {
                callback(null, origin);
                return;
            }

            callback(new Error("Not allowed by CORS"));
        },
        credentials: true,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization", "x-csrf-token", "Cookie"],
    }),
);

app.use("/api/website", websiteRouter);
app.use("/api/billing", billingRouter);

const clientDist = path.resolve(__dirname, "../client/dist");
const clientIndex = path.join(clientDist, "index.html");
const clientBuildExists = fs.existsSync(clientDist) && fs.existsSync(clientIndex);

if (clientBuildExists) {
    app.use(express.static(clientDist));

    app.get("/{*path}", (req, res) => {
        res.sendFile(clientIndex);
    });
} else {
    app.get("/", (req, res) => {
        res.status(200).json({
            message: "GenWeb.ai API is running.",
            status: "ok",
            frontendBuilt: false,
        });
    });

    app.get("/{*path}", (req, res) => {
        res.status(404).json({
            message: "Route not found. The frontend build is not deployed yet.",
            status: "not_found",
        });
    });
}

export default app;
