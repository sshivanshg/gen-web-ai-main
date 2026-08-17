/* eslint-disable no-unused-vars */
import { ArrowLeft, Check, RocketIcon, Share2 } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverURL } from "../config";
import useDocumentTitle from "../hooks/useDocumentTitle";
import Navbar from "../components/Navbar";
import { BRAND } from "../brand";

const userPrompts = (website) =>
    (website.conversations || []).filter((message) => message.role === "user");

const formatWhen = (value) => {
    if (!value) return "";
    return new Date(value).toLocaleString(undefined, {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
    });
};

const Dashboard = () => {
    useDocumentTitle(`Projects — ${BRAND.name}`);
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
            } catch (err) {
                console.log(err);
                setError(err.response?.data?.message || "Could not load projects");
                setLoading(false);
            }
        };

        handleGetAllWebsites();
    }, []);

    const promptLog = useMemo(() => {
        return websites
            .flatMap((website) =>
                userPrompts(website).map((message, index) => ({
                    id: `${website._id}-${index}`,
                    websiteId: website._id,
                    title: website.title,
                    content: message.content,
                    at: message.createdAt || website.updatedAt,
                    step: index + 1,
                })),
            )
            .sort((a, b) => new Date(b.at) - new Date(a.at));
    }, [websites]);

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
        } catch (err) {
            console.log(err);
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
                    New project
                </button>
            </Navbar>

            <div className="mx-auto max-w-6xl px-6 py-12">
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-10"
                >
                    <p className="mb-2 text-[11px] uppercase tracking-[0.24em] text-muted">
                        Studio
                    </p>
                    <h1 className="font-display text-4xl font-medium tracking-tight">
                        Projects
                    </h1>
                    {!loading && websites.length > 0 && (
                        <p className="mt-3 text-sm font-light text-muted">
                            {websites.length} project
                            {websites.length === 1 ? "" : "s"} · {promptLog.length}{" "}
                            prompt{promptLog.length === 1 ? "" : "s"}
                        </p>
                    )}
                </motion.div>

                {loading && (
                    <div className="mt-24 text-center font-light text-muted">
                        Gathering your work…
                    </div>
                )}

                {error && !loading && (
                    <div className="mt-24 text-center text-accent">{error}</div>
                )}

                {websites.length === 0 && !loading && !error && (
                    <div className="mx-auto mt-16 max-w-md rounded-3xl border border-dashed border-line bg-cream/60 px-8 py-16 text-center">
                        <p className="font-display text-2xl">No projects yet</p>
                        <p className="mt-3 text-sm font-light text-muted">
                            Compose a first site. Every prompt you type will live
                            here.
                        </p>
                        <button
                            onClick={() => navigate("/generate")}
                            className="mt-8 rounded-full bg-accent px-6 py-2.5 text-sm text-cream hover:bg-accent-dark"
                        >
                            Begin
                        </button>
                    </div>
                )}

                {!loading && !error && websites.length > 0 && (
                    <div className="space-y-16">
                        {promptLog.length > 0 && (
                            <section>
                                <div className="mb-5 flex items-end justify-between">
                                    <h2 className="font-display text-2xl font-medium">
                                        All prompts
                                    </h2>
                                    <p className="text-xs tracking-wide text-muted">
                                        Everything you have typed
                                    </p>
                                </div>
                                <div className="overflow-hidden rounded-3xl border border-line bg-cream/80">
                                    {promptLog.map((entry, i) => (
                                        <button
                                            key={entry.id}
                                            onClick={() =>
                                                navigate(
                                                    `/editor/${entry.websiteId}`,
                                                )
                                            }
                                            className={`flex w-full flex-col gap-1 px-5 py-4 text-left transition hover:bg-paper/80 md:flex-row md:items-start md:gap-6 ${
                                                i !== 0
                                                    ? "border-t border-line"
                                                    : ""
                                            }`}
                                        >
                                            <span className="w-36 shrink-0 pt-0.5 text-[11px] uppercase tracking-[0.16em] text-muted">
                                                {formatWhen(entry.at)}
                                            </span>
                                            <span className="min-w-0 flex-1">
                                                <span className="block font-display text-lg leading-snug">
                                                    {entry.content}
                                                </span>
                                                <span className="mt-1 block text-xs text-muted">
                                                    {entry.title} · Prompt{" "}
                                                    {entry.step}
                                                </span>
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </section>
                        )}

                        <section>
                            <h2 className="font-display mb-5 text-2xl font-medium">
                                Projects
                            </h2>
                            <div className="space-y-8">
                                {websites.map((w, i) => {
                                    const copied = copiedId === w._id;
                                    const prompts = userPrompts(w);
                                    return (
                                        <motion.article
                                            key={w._id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.04 }}
                                            className="overflow-hidden rounded-3xl border border-line bg-cream shadow-[0_24px_50px_-32px_rgba(44,38,34,0.28)]"
                                        >
                                            <div className="grid gap-0 md:grid-cols-[220px_1fr]">
                                                <button
                                                    onClick={() =>
                                                        navigate(
                                                            `/editor/${w._id}`,
                                                        )
                                                    }
                                                    className="relative h-44 bg-paper md:h-full md:min-h-[220px]"
                                                >
                                                    <iframe
                                                        srcDoc={w.latestCode}
                                                        className="pointer-events-none absolute inset-0 origin-top-left h-[140%] w-[140%] scale-[0.72] bg-white"
                                                        title=""
                                                    />
                                                    <div className="absolute inset-0 bg-ink/5" />
                                                </button>

                                                <div className="flex flex-col p-6">
                                                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                                        <div>
                                                            <h3 className="font-display text-2xl font-medium">
                                                                {w.title}
                                                            </h3>
                                                            <p className="mt-1 text-xs font-light tracking-wide text-muted">
                                                                Updated{" "}
                                                                {formatWhen(
                                                                    w.updatedAt,
                                                                )}{" "}
                                                                · {prompts.length}{" "}
                                                                prompt
                                                                {prompts.length ===
                                                                1
                                                                    ? ""
                                                                    : "s"}
                                                            </p>
                                                        </div>
                                                        <div className="flex shrink-0 gap-2">
                                                            <button
                                                                onClick={() =>
                                                                    navigate(
                                                                        `/editor/${w._id}`,
                                                                    )
                                                                }
                                                                className="rounded-full border border-line px-4 py-2 text-sm hover:border-ink/20"
                                                            >
                                                                Open
                                                            </button>
                                                            {!w.deployed ? (
                                                                <button
                                                                    onClick={() =>
                                                                        handleDeploy(
                                                                            w._id,
                                                                        )
                                                                    }
                                                                    className="flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-sm font-medium text-cream hover:bg-accent"
                                                                >
                                                                    <RocketIcon
                                                                        size={14}
                                                                    />
                                                                    Publish
                                                                </button>
                                                            ) : (
                                                                <button
                                                                    onClick={() =>
                                                                        handleCopy(
                                                                            w,
                                                                        )
                                                                    }
                                                                    className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm ${
                                                                        copied
                                                                            ? "border border-line bg-paper"
                                                                            : "border border-line hover:border-ink/20"
                                                                    }`}
                                                                >
                                                                    {copied ? (
                                                                        <>
                                                                            <Check
                                                                                size={14}
                                                                            />
                                                                            Copied
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <Share2
                                                                                size={14}
                                                                            />
                                                                            Share
                                                                        </>
                                                                    )}
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="mt-6">
                                                        <p className="mb-3 text-[11px] uppercase tracking-[0.2em] text-muted">
                                                            Prompts
                                                        </p>
                                                        {prompts.length === 0 ? (
                                                            <p className="text-sm font-light text-muted">
                                                                No prompts saved
                                                                for this project.
                                                            </p>
                                                        ) : (
                                                            <ol className="space-y-3">
                                                                {prompts.map(
                                                                    (
                                                                        message,
                                                                        index,
                                                                    ) => (
                                                                        <li
                                                                            key={`${w._id}-prompt-${index}`}
                                                                            className="flex gap-3"
                                                                        >
                                                                            <span className="mt-0.5 w-5 shrink-0 text-xs text-accent">
                                                                                {String(
                                                                                    index +
                                                                                        1,
                                                                                ).padStart(
                                                                                    2,
                                                                                    "0",
                                                                                )}
                                                                            </span>
                                                                            <div>
                                                                                <p className="text-sm leading-relaxed text-ink">
                                                                                    {
                                                                                        message.content
                                                                                    }
                                                                                </p>
                                                                                {message.createdAt && (
                                                                                    <p className="mt-1 text-[11px] text-muted">
                                                                                        {formatWhen(
                                                                                            message.createdAt,
                                                                                        )}
                                                                                    </p>
                                                                                )}
                                                                            </div>
                                                                        </li>
                                                                    ),
                                                                )}
                                                            </ol>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.article>
                                    );
                                })}
                            </div>
                        </section>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
