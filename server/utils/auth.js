import jwt from "jsonwebtoken";
import { JWT_SECRET } from "./config.js";

const COOKIE_OPTIONS = {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 1000 * 60 * 60 * 24 * 7,
};

export const signAuthToken = (payload) => jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });

export const setAuthCookie = (res, token) => {
    res.cookie("auth_token", token, COOKIE_OPTIONS);
};

export const clearAuthCookie = (res) => {
    res.clearCookie("auth_token", COOKIE_OPTIONS);
};

export const requireAuth = async (req, res, next) => {
    try {
        const token = req.cookies?.auth_token || req.headers.authorization?.replace(/^Bearer\s+/i, "");

        if (!token) {
            return res.status(401).json({ message: "Authentication required" });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch {
        return res.status(401).json({ message: "Invalid or expired session" });
    }
};
