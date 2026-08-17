/* eslint-disable no-unused-vars */
import { ArrowLeft, Check, RocketIcon, Share2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverURL } from "../App";
import useDocumentTitle from "../hooks/useDocumentTitle";
import Navbar from "../components/Navbar";
import { BRAND } from "../brand";

const Dashboard = () => {
    useDocumentTitle(`Library — ${BRAND.name}`);
    const navigate = useNavigate();
    const [websites, setWebsites] = useState([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [copiedId, setCopiedId] = useState(null);

    useEffect(() => {
        const handleGetAllWebsites = async () => {
            setLoading(true);
            try {
                const result = await axios.get(
                    `${serverURL}/api/website/get-all`,
                    {
                        withCredentials: true,
                    },
                );

                setWebsites(result.data);
                setLoading(false);
            } catch (error) {
                console.log(error);
                setError(error.response?.data?.message || "Could not load sites");
                setLoading(false);
            }
        };

        handleGetAllWebsites();
    }, []);

    const handleDeploy = async (id) => {
        try {
            const result = await axios.get(
                `${serverURL}/api/website/deploy/${id}`,
                {
                    withCredentials: true,
                },
            );

            window.open(`${result.data.url}`, "_blank");

            setWebsites((prev) =>
                prev.map((w) =>
                    w._id === id
                        ? { ...w, deployedUrl: result.data.url, deployed: true }
                        : w,
                ),
            );
        } catch (error) {
            console.log(error);
        }
    };

    const handleCopy = async (site) => {
        await navigator.clipboard.writeText(site.deployedUrl);
        setCopiedId(site._id);
        setTimeout(() => {
            setCopiedId(null);
        }, 2000);
    };

    return (
        <div className="min-h-screen bg-paper text-ink">
            <Navbar>
                <button
                    className="rounded-full p-2 text-muted transition hover:bg-cream hover:text-ink"
                    onClick={() => navigate("/")}
                >
                    <ArrowLeft size={16} />
                </button>
                <button
                    onClick={() => navigate("/generate")}
                    className="rounded-full bg-accent px-4 py-2 text-[13px] font-medium tracking-wide text-cream transition hover:bg-accent-dark"
                >
                    New site
                </button>
            </Navbar>

            <div className="mx-auto max-w-6xl px-6 py-12">
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12"
                >
                    <p className="mb-2 text-[11px] uppercase tracking-[0.24em] text-muted">
                        Library
                    </p>
                    <h1 className="font-display text-4xl font-medium tracking-tight">
                        Your collection
                    </h1>
                </motion.div>

                {loading && (
                    <div className="mt-24 text-center font-light text-muted">
                        Gathering your work…
                    </div>
                )}

                {error && !loading && (
                    <div className="mt-24 text-center text-accent">
                        {error}
                    </div>
                )}

                {websites.length === 0 && !loading && !error && (
                    <div className="mx-auto mt-16 max-w-md rounded-3xl border border-dashed border-line bg-cream/60 px-8 py-16 text-center">
                        <p className="font-display text-2xl">Nothing here yet</p>
                        <p className="mt-3 text-sm font-light text-muted">
                            Compose a first site and it will appear in this
                            collection.
                        </p>
                        <button
                            onClick={() => navigate("/generate")}
                            className="mt-8 rounded-full bg-accent px-6 py-2.5 text-sm text-cream hover:bg-accent-dark"
                        >
                            Begin
                        </button>
                    </div>
                )}

                {!loading && !error && websites?.length > 0 && (
                    <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 xl:grid-cols-3">
                        {websites.map((w, i) => {
                            const copied = copiedId === w._id;
                            return (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.04 }}
                                    onClick={() => navigate(`/editor/${w._id}`)}
                                    whileHover={{ y: -6 }}
                                    className="flex cursor-pointer flex-col overflow-hidden rounded-3xl border border-line bg-cream shadow-[0_24px_50px_-32px_rgba(44,38,34,0.28)] transition"
                                >
                                    <div className="relative h-44 bg-paper">
                                        <iframe
                                            srcDoc={w.latestCode}
                                            className="pointer-events-none absolute inset-0 origin-top-left h-[140%] w-[140%] scale-[0.72] bg-white"
                                        />
                                        <div className="absolute inset-0 bg-ink/5" />
                                    </div>

                                    <div className="flex flex-1 flex-col gap-4 p-5">
                                        <h3 className="font-display line-clamp-2 text-xl font-medium">
                                            {w.title}
                                        </h3>
                                        <p className="text-xs font-light tracking-wide text-muted">
                                            Updated{" "}
                                            {new Date(
                                                w.updatedAt,
                                            ).toLocaleDateString()}
                                        </p>

                                        {!w.deployed ? (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    return handleDeploy(w._id);
                                                }}
                                                className="mt-auto flex items-center justify-center gap-2 rounded-full bg-ink px-4 py-2.5 text-sm font-medium text-cream transition hover:bg-accent"
                                            >
                                                <RocketIcon size={16} />
                                                Publish
                                            </button>
                                        ) : (
                                            <motion.button
                                                whileTap={{ scale: 0.95 }}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    return handleCopy(w);
                                                }}
                                                className={`mt-auto flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition-all ${copied ? "border border-line bg-paper text-ink" : "border border-line bg-cream text-ink hover:border-ink/20"}`}
                                            >
                                                {copied ? (
                                                    <>
                                                        <Check size={16} />
                                                        Copied
                                                    </>
                                                ) : (
                                                    <>
                                                        <Share2 size={16} />
                                                        Share
                                                    </>
                                                )}
                                            </motion.button>
                                        )}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
