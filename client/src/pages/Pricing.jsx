/* eslint-disable no-unused-vars */
import { ArrowLeft, Check } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import useDocumentTitle from "../hooks/useDocumentTitle";
import Navbar from "../components/Navbar";
import { BRAND } from "../brand";

const plans = [
    {
        key: "free",
        name: "Studio",
        price: "Free",
        note: "To begin",
        description: "Compose and refine at your own pace.",
        features: [
            "AI site composition",
            "Responsive HTML",
            "Live preview",
        ],
        popular: false,
        button: "Begin",
    },
    {
        key: "pro",
        name: "Atelier",
        price: "₹499",
        note: "one-time",
        description: "For independent makers and studios.",
        features: [
            "Everything in Studio",
            "Faster generation",
            "Iterate and reshape",
        ],
        popular: true,
        button: "Continue",
    },
    {
        key: "enterprise",
        name: "House",
        price: "₹1499",
        note: "one-time",
        description: "For teams that ship often.",
        features: [
            "Open iteration",
            "Priority composition",
            "Shared library",
        ],
        popular: false,
        button: "Continue",
    },
];

const Pricing = () => {
    useDocumentTitle(`Plans — ${BRAND.name}`);
    const navigate = useNavigate();

    const [loading, setLoading] = useState("");

    const handleBuy = async () => {
        navigate("/generate");
    };

    return (
        <div className="relative min-h-screen overflow-hidden bg-paper px-6 pb-24 text-ink">
            <Navbar>
                <button
                    onClick={() => navigate("/")}
                    className="flex items-center gap-2 text-[13px] text-muted transition hover:text-ink"
                >
                    <ArrowLeft size={14} />
                    Back
                </button>
            </Navbar>

            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative z-10 mx-auto mb-16 mt-16 max-w-3xl text-center"
            >
                <p className="mb-4 text-[11px] uppercase tracking-[0.28em] text-muted">
                    Plans
                </p>
                <h1 className="font-display text-4xl font-medium tracking-tight md:text-5xl">
                    Simple, considered pricing
                </h1>

                <p className="mt-4 text-lg font-light text-muted">
                    Start quietly. Grow when the work asks for it.
                </p>
            </motion.div>

            <div className="relative z-10 mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-3">
                {plans.map((p, i) => (
                    <motion.div
                        key={p.key}
                        initial={{ opacity: 0, y: 32 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.08 }}
                        viewport={{ once: true }}
                        className={`relative rounded-3xl border p-8 ${
                            p.popular
                                ? "border-accent/40 bg-cream shadow-[0_28px_60px_-36px_rgba(196,92,58,0.45)]"
                                : "border-line bg-cream/70"
                        }`}
                    >
                        {p.popular && (
                            <span className="absolute right-5 top-5 rounded-full bg-accent px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-cream">
                                Chosen
                            </span>
                        )}

                        <h2 className="font-display text-2xl font-medium">
                            {p.name}
                        </h2>

                        <p className="mt-2 mb-6 text-sm font-light text-muted">
                            {p.description}
                        </p>

                        <div className="mb-8 flex items-end gap-2">
                            <span className="font-display text-4xl">
                                {p.price}
                            </span>

                            <span className="mb-1 text-sm font-light text-muted">
                                {p.note}
                            </span>
                        </div>

                        <ul className="mb-10 space-y-3">
                            {p.features.map((feature, idx) => (
                                <li
                                    key={idx}
                                    className="flex items-center gap-2 text-sm font-light text-ink/80"
                                >
                                    <Check
                                        size={15}
                                        className="text-accent"
                                    />
                                    {feature}
                                </li>
                            ))}
                        </ul>

                        <motion.button
                            whileTap={{ scale: 0.97 }}
                            disabled={loading !== ""}
                            onClick={() => handleBuy(p.key)}
                            className={`w-full rounded-full py-3 text-sm font-medium tracking-wide transition ${
                                p.popular
                                    ? "bg-accent text-cream hover:bg-accent-dark"
                                    : "border border-line bg-paper text-ink hover:border-ink/20"
                            } disabled:cursor-not-allowed disabled:opacity-60`}
                        >
                            {loading === p.key ? "Opening…" : p.button}
                        </motion.button>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default Pricing;
