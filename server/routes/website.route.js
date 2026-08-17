import express from "express";
import {
    changes,
    deploy,
    generateWebsite,
    getAll,
    getWebsiteById,
    getWebsiteBySlug,
} from "../controllers/website.controller.js";
import { requireAuth } from "../utils/auth.js";

const websiteRouter = express.Router();

websiteRouter.post("/generate", requireAuth, generateWebsite);
websiteRouter.post("/update/:id", requireAuth, changes);

websiteRouter.get("/get-by-id/:id", requireAuth, getWebsiteById);
websiteRouter.get("/get-by-slug/:slug", getWebsiteBySlug);
websiteRouter.get("/get-all", requireAuth, getAll);
websiteRouter.get("/deploy/:id", requireAuth, deploy);

export default websiteRouter;
