/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable no-unused-vars */
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import axios from "axios";
import { serverURL } from "../config";
import useDocumentTitle from "../hooks/useDocumentTitle";
import Navbar from "../components/Navbar";
import { BRAND } from "../brand";

const PHASES = [
    "Reading the brief...",
    "Planning the page flow...",
    "Writing the custom code...",
    "Checking mobile layout...",
    "Preparing the editor...",
];

const Generate = () => {
    useDocumentTitle(`Generate — ${BRAND.name}`);
    const [prompt, setPrompt] = useState("");
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [phaseIndex, setPhaseIndex] = useState(0);
    const [error, setError] = useState("");

    const navigate = useNavigate();
    const handleGenerateWebsite = async () => {
        if (!prompt.trim() || loading) return;
        try {
            setLoading(true);
            const result = await axios.post(
                `${serverURL}/api/website/generate`,
                { prompt },
                { withCredentials: true },
            );

            setLoading(false);
            setProgress(100);
            navigate(`/editor/${result.data.websiteId}`);
        } catch (error) {
            setLoading(false);
            console.log(error);
            setError(error.response?.data?.message || "Something went wrong");
        }
    };

    useEffect(() => {
        if (!loading) {
            setPhaseIndex(0);
            setProgress(0);
            return;
        }

        let value = 0;

        const interval = setInterval(() => {
            const increment =
                value < 20
                    ? Math.random() * 1.5
                    : value < 60
                      ? Math.random() * 1.2
                      : Math.random() * 0.6;

            value += increment;

            if (value >= 93) {
                value = 93;
            }

            const phase = Math.min(
                Math.floor((value / 100) * PHASES.length),
                PHASES.length - 1,
            );

            setProgress(Math.floor(value));
            setPhaseIndex(phase);
        }, 1200);

        return () => clearInterval(interval);
    }, [loading]);

    return (
        <div className="min-h-screen bg-paper text-ink">
            <Navbar>
                <button
                    className="rounded-full p-2 text-muted transition hover:bg-cream hover:text-ink"
                    onClick={() => navigate("/")}
                >
                    <ArrowLeft size={16} />
                </button>
            </Navbar>

            <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 md:py-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-14 text-center"
                >
                    <p className="mb-4 text-[11px] uppercase tracking-[0.28em] text-muted">
                        Agentic brief
                    </p>
                    <h1 className="font-display text-4xl font-medium leading-tight tracking-tight md:text-5xl">
                        What should Brixloop{" "}
                        <span className="italic text-accent">generate</span>?
                    </h1>

                    <p className="mx-auto mt-5 max-w-lg font-light leading-relaxed text-muted">
                        Give the agent a clear website idea. It will generate the
                        first version, open the editor, and keep everything ready
                        for customization and publishing.
                    </p>
                </motion.div>

                <div className="mb-10">
                    <textarea
                        onChange={(e) => setPrompt(e.target.value)}
                        value={prompt}
                        placeholder="A simple aesthetic website for a boutique coffee studio, with warm colors, a hero, menu preview, feature cards, and a contact CTA..."
                        className="h-48 w-full resize-none rounded-2xl border border-line bg-cream p-5 text-base leading-relaxed text-ink outline-none placeholder:text-muted/70 focus:border-accent/40 sm:h-52 sm:rounded-3xl sm:p-6 sm:text-sm"
                    ></textarea>

                    {error && (
                        <p className="mt-4 text-sm text-accent">{error}</p>
                    )}
                </div>

                <div className="flex justify-center">
                    <motion.button
                        whileTap={{ scale: 0.97 }}
                        disabled={!prompt.trim() || loading}
                        className={`min-h-11 w-full rounded-full px-8 py-3.5 text-sm font-medium tracking-wide sm:w-auto sm:px-12 ${prompt.trim() && !loading ? "bg-accent text-cream hover:bg-accent-dark" : "cursor-not-allowed bg-line text-muted"}`}
                        onClick={handleGenerateWebsite}
                    >
                        Generate site
                    </motion.button>
                </div>

                {loading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mx-auto mt-14 max-w-md"
                    >
                        <div className="mb-2 flex justify-between text-xs text-muted">
                            <span className="italic">{PHASES[phaseIndex]}</span>
                            <span>{progress}%</span>
                        </div>

                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-line">
                            <motion.div
                                className="h-full rounded-full bg-accent"
                                animate={{ width: `${progress}%` }}
                                transition={{
                                    ease: "easeOut",
                                    duration: 0.8,
                                }}
                            />
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default Generate;
