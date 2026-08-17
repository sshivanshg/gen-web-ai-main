import express from "express";
import {
    getCurrentUser,
    login,
    logout,
    signup,
} from "../controllers/user.controller.js";
import { requireAuth } from "../utils/auth.js";

const authRouter = express.Router();

authRouter.post("/signup", signup);
authRouter.post("/login", login);
authRouter.post("/logout", logout);
authRouter.get("/me", requireAuth, getCurrentUser);

export default authRouter;
