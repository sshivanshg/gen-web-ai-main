import express from "express";
import {
    changes,
    deploy,
    generateWebsite,
    getAll,
    getWebsiteById,
    getWebsiteBySlug,
} from "../controllers/website.controller.js";

const websiteRouter = express.Router();

websiteRouter.post("/generate", generateWebsite);
websiteRouter.post("/update/:id", changes);

websiteRouter.get("/get-by-id/:id", getWebsiteById);
websiteRouter.get("/get-by-slug/:slug", getWebsiteBySlug);
websiteRouter.get("/get-all", getAll);
websiteRouter.get("/deploy/:id", deploy);

export default websiteRouter;
