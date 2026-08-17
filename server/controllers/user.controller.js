import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import { clearAuthCookie, setAuthCookie, signAuthToken } from "../utils/auth.js";

const publicUserFields = "name email credits plan avatar createdAt updatedAt";

const userPayload = (user) => ({
    id: user._id,
    name: user.name,
    email: user.email,
    credits: user.credits,
    plan: user.plan,
    avatar: user.avatar,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
});

export const getCurrentUser = async (req, res) => {
    try {
        if (!req.user?.id) {
            return res.json({ user: null });
        }

        const user = await User.findById(req.user.id).select(publicUserFields);

        return res.json({ user: user ? userPayload(user) : null });
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: `Get Current User Error : ${error}`,
        });
    }
};

export const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Name, email, and password are required",
            });
        }

        const normalizedEmail = email.trim().toLowerCase();
        const existingUser = await User.findOne({ email: normalizedEmail });

        if (existingUser) {
            return res.status(409).json({
                message: "An account with this email already exists",
            });
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const user = await User.create({
            name: name.trim(),
            email: normalizedEmail,
            passwordHash,
        });

        const token = signAuthToken({ id: user._id.toString(), email: user.email });
        setAuthCookie(res, token);

        return res.status(201).json({
            message: "Account created",
            token,
            user: userPayload(user),
        });
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: `Signup Error : ${error}`,
        });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required",
            });
        }

        const user = await User.findOne({
            email: email.trim().toLowerCase(),
        }).select("+passwordHash");

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password",
            });
        }

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid email or password",
            });
        }

        const token = signAuthToken({ id: user._id.toString(), email: user.email });
        setAuthCookie(res, token);

        return res.status(200).json({
            message: "Logged in",
            token,
            user: userPayload(user),
        });
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: `Login Error : ${error}`,
        });
    }
};

export const logout = async (req, res) => {
    clearAuthCookie(res);
    return res.status(200).json({
        message: "Logged out",
    });
};
