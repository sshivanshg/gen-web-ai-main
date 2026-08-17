import { useState } from "react";
import axios from "axios";
import { motion } from "motion/react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { clearUserData, setUserData } from "../redux/userSlice";
import useDocumentTitle from "../hooks/useDocumentTitle";
import { BRAND } from "../brand";
import { serverURL } from "../config";

const Auth = () => {
    useDocumentTitle(`Auth — ${BRAND.name}`);
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const [mode, setMode] = useState("login");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const returnTo = location.state?.from?.pathname || "/projects";

    const submit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const payload = { email, password };
            const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/signup";
            if (mode === "signup") payload.name = name;

            const result = await axios.post(`${serverURL}${endpoint}`, payload, {
                withCredentials: true,
            });

            dispatch(setUserData(result.data.user));
            navigate(returnTo, { replace: true });
        } catch (err) {
            dispatch(clearUserData());
            setError(err.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-paper px-6 text-ink">
            <motion.form
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                onSubmit={submit}
                className="w-full max-w-md rounded-3xl border border-line bg-cream p-6 shadow-[0_28px_60px_-40px_rgba(44,38,34,0.35)]"
            >
                <p className="text-[11px] uppercase tracking-[0.24em] text-muted">
                    {BRAND.name}
                </p>
                <h1 className="mt-3 font-display text-4xl font-medium leading-none">
                    {mode === "login" ? "Welcome back" : "Create account"}
                </h1>
                <p className="mt-4 text-sm leading-relaxed text-muted">
                    {mode === "login"
                        ? "Sign in to access your projects and pricing."
                        : "Create a first-party account with email and password."}
                </p>

                {mode === "signup" && (
                    <input
                        className="mt-6 w-full rounded-2xl border border-line bg-paper px-4 py-3 text-sm outline-none placeholder:text-muted/60 focus:border-accent/40"
                        placeholder="Full name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                )}
                <input
                    className="mt-6 w-full rounded-2xl border border-line bg-paper px-4 py-3 text-sm outline-none placeholder:text-muted/60 focus:border-accent/40"
                    placeholder="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    className="mt-4 w-full rounded-2xl border border-line bg-paper px-4 py-3 text-sm outline-none placeholder:text-muted/60 focus:border-accent/40"
                    placeholder="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                {error && <p className="mt-3 text-sm text-accent">{error}</p>}
                <button
                    disabled={loading}
                    className="mt-6 w-full rounded-full bg-accent px-4 py-3 text-sm font-medium text-cream transition hover:bg-accent-dark disabled:opacity-60"
                >
                    {loading ? "Please wait…" : mode === "login" ? "Sign in" : "Create account"}
                </button>
                <button
                    type="button"
                    className="mt-3 w-full text-sm text-muted transition hover:text-ink"
                    onClick={() => {
                        setError("");
                        setMode((prev) => (prev === "login" ? "signup" : "login"));
                    }}
                >
                    {mode === "login"
                        ? "Need an account? Create one"
                        : "Already have an account? Sign in"}
                </button>
            </motion.form>
        </div>
    );
};

export default Auth;
