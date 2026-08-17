import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Generate from "./pages/Generate";
import Editor from "./pages/WebSiteEditor";
import LiveSite from "./pages/LiveSite";
import Pricing from "./pages/Pricing";

const SITE_PASSWORD = "Shivansh123321";
const PASSWORD_STORAGE_KEY = "gen-web-ai-unlocked";

const LockScreen = ({ onUnlock, error }) => {
    const [password, setPassword] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (submitting) return;
        setSubmitting(true);
        const success = onUnlock(password);
        if (!success) {
            setSubmitting(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-paper px-6 text-ink">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-sm rounded-3xl border border-line bg-cream p-6 shadow-[0_24px_60px_-40px_rgba(44,38,34,0.35)]"
            >
                <p className="text-[11px] uppercase tracking-[0.24em] text-muted">
                    Private access
                </p>
                <h1 className="mt-3 font-display text-4xl font-medium leading-none">
                    Enter password
                </h1>
                <p className="mt-4 text-sm leading-relaxed text-muted">
                    This site is temporarily gated.
                </p>
                <input
                    type="password"
                    autoFocus
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="mt-6 w-full rounded-2xl border border-line bg-paper px-4 py-3 text-sm text-ink outline-none placeholder:text-muted/60 focus:border-accent/40"
                />
                {error && (
                    <p className="mt-3 text-sm text-accent">{error}</p>
                )}
                <button
                    type="submit"
                    className="mt-6 w-full rounded-full bg-accent px-4 py-3 text-sm font-medium text-cream transition hover:bg-accent-dark disabled:opacity-60"
                    disabled={submitting}
                >
                    Unlock
                </button>
            </form>
        </div>
    );
};

const App = () => {
    const [unlocked, setUnlocked] = useState(
        () => localStorage.getItem(PASSWORD_STORAGE_KEY) === "true",
    );
    const [error, setError] = useState("");

    const handleUnlock = (enteredPassword) => {
        if (enteredPassword !== SITE_PASSWORD) {
            setError("Incorrect password.");
            setUnlocked(false);
            localStorage.removeItem(PASSWORD_STORAGE_KEY);
            return false;
        }

        localStorage.setItem(PASSWORD_STORAGE_KEY, "true");
        setError("");
        setUnlocked(true);
        return true;
    };

    return (
        unlocked ? (
            <BrowserRouter>
                <div className="min-h-screen bg-paper font-sans text-ink">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/site/:id" element={<LiveSite />} />
                        <Route path="pricing" element={<Pricing />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/projects" element={<Dashboard />} />
                        <Route path="/generate" element={<Generate />} />
                        <Route path="/editor/:id" element={<Editor />} />
                    </Routes>
                </div>
            </BrowserRouter>
        ) : (
            <LockScreen
                error={error}
                onUnlock={handleUnlock}
            />
        )
    );
};

export default App;
