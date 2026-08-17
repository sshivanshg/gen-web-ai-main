/* eslint-disable no-unused-vars */
import React from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import useDocumentTitle from "../hooks/useDocumentTitle";
import Navbar from "../components/Navbar";
import { BRAND } from "../brand";

const Home = () => {
    useDocumentTitle(BRAND.name);
    const highlights = [
        {
            title: "Brief to blueprint",
            description:
                "Describe the website you want. The agent turns your intent into structure, copy, layout, and code.",
        },
        {
            title: "Customize with chat",
            description:
                "Ask for changes in plain language and watch the site update beside the code and preview.",
        },
        {
            title: "Publish the final site",
            description:
                "When it feels right, publish a public link you can share with clients, teams, or prospects.",
        },
    ];

    const navigate = useNavigate();

    return (
        <div className="relative min-h-screen overflow-hidden bg-paper text-ink">
            <Navbar>
                <button
                    onClick={() => navigate("/pricing")}
                    className="hidden text-[13px] tracking-wide text-muted transition hover:text-ink md:inline"
                >
                    Plans
                </button>
            </Navbar>

            <section className="px-6 pb-28 pt-28 text-center md:pt-36">
                <motion.p
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 text-[11px] uppercase tracking-[0.28em] text-muted"
                >
                    {BRAND.tagline}
                </motion.p>
                <motion.h1
                    initial={{ y: 28, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="font-display text-5xl font-medium leading-[1.05] tracking-tight md:text-7xl"
                >
                    Agentic websites
                    <br />
                    <span className="italic text-accent">by Brixloop.</span>
                </motion.h1>

                <motion.p
                    initial={{ y: 16, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="mx-auto mt-8 max-w-xl text-lg font-light leading-relaxed text-muted"
                >
                    Generate a custom website from a short brief, refine it in a
                    live editor, then publish a shareable link in one flow.
                </motion.p>

                <button
                    className="mt-12 rounded-full bg-accent px-10 py-3.5 text-sm font-medium tracking-wide text-cream transition hover:bg-accent-dark"
                    onClick={() => navigate("/generate")}
                >
                    Generate a site
                </button>
            </section>

            <section className="mx-auto max-w-6xl px-6 pb-28">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    {highlights.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 28 }}
                            whileInView={{
                                opacity: 1,
                                y: 0,
                            }}
                            viewport={{ once: true }}
                            className="rounded-3xl border border-line bg-cream/70 p-8 shadow-[0_24px_50px_-32px_rgba(44,38,34,0.35)]"
                        >
                            <p className="mb-4 text-[11px] uppercase tracking-[0.22em] text-accent">
                                0{index + 1}
                            </p>
                            <h2 className="font-display mb-3 text-2xl font-medium">
                                {item.title}
                            </h2>
                            <p className="text-sm font-light leading-relaxed text-muted">
                                {item.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </section>

            <footer className="border-t border-line py-10 text-center text-sm font-light text-muted">
                &copy; {new Date().getFullYear()} {BRAND.name}
                {BRAND.kicker ? ` · ${BRAND.kicker}` : ""} · Powered by{" "}
                <a
                    href="https://brixloop.com"
                    target="_blank"
                    rel="noreferrer"
                    className="text-ink transition hover:text-accent"
                >
                    {BRAND.poweredBy}
                </a>
            </footer>
        </div>
    );
};

export default Home;
