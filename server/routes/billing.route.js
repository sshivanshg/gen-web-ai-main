import express from "express";
import { billing } from "../controllers/billing.controller.js";
import { requireAuth } from "../utils/auth.js";

const billingRouter = express.Router();

billingRouter.post("/", requireAuth, billing);

export default billingRouter;
