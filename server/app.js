import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
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

app.post(
    "/api/stripe/webhook",
    express.raw({ type: "application/json" }),
    stripeWebhook,
);

app.use(morgan("dev"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(
    cors({
        origin: FRONTEND_URL,
        credentials: true,
    }),
);

app.use("/api/website", websiteRouter);
app.use("/api/billing", billingRouter);

const clientDist = path.resolve(__dirname, "../client/dist");
app.use(express.static(clientDist));

app.get("/{*path}", (req, res) => {
    res.sendFile(path.join(clientDist, "index.html"));
});

export default app;
