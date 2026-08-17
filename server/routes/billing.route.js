import express from "express";
import { billing } from "../controllers/billing.controller.js";

const billingRouter = express.Router();

billingRouter.post("/", billing);

export default billingRouter;
