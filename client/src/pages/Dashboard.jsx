/* eslint-disable no-unused-vars */
import { ArrowLeft, Check, ChevronDown, RocketIcon, Share2 } from "lucide-react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "motion/react";
import { useLocation, useNavigate } from "react-router-dom";
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
    const location = useLocation();
    const [websites, setWebsites] = useState([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [copiedId, setCopiedId] = useState(null);
    const [promptHistoryOpen, setPromptHistoryOpen] = useState(false);
    const [expandedPromptIds, setExpandedPromptIds] = useState([]);
    const focusProjectId = location.state?.focusProjectId;
    const focusedProjectRef = useRef(null);

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

    useEffect(() => {
        if (focusProjectId && focusedProjectRef.current) {
            focusedProjectRef.current.scrollIntoView({
                behavior: "smooth",
                block: "center",
            });
        }
    }, [focusProjectId, websites.length]);

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

    const toggleProjectPrompts = (id) => {
        setExpandedPromptIds((current) =>
            current.includes(id)
                ? current.filter((projectId) => projectId !== id)
                : [...current, id],
        );
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

            <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 sm:mb-10"
                >
                    <p className="mb-2 text-[11px] uppercase tracking-[0.24em] text-muted">
                        Shivansh Studio
                    </p>
                    <h1 className="font-display text-4xl font-medium tracking-tight sm:text-5xl">
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
                    <div className="mx-auto mt-12 max-w-md rounded-2xl border border-dashed border-line bg-cream/60 px-6 py-12 text-center sm:mt-16 sm:rounded-3xl sm:px-8 sm:py-16">
                        <p className="font-display text-2xl">No projects yet</p>
                        <p className="mt-3 text-sm font-light text-muted">
                            Generate a first custom website. Every brief and
                            refinement will live here.
                        </p>
                        <button
                            onClick={() => navigate("/generate")}
                            className="mt-8 rounded-full bg-accent px-6 py-2.5 text-sm text-cream hover:bg-accent-dark"
                        >
                            Generate
                        </button>
                    </div>
                )}

                {!loading && !error && websites.length > 0 && (
                    <div className="space-y-10">
                        {promptLog.length > 0 && (
                            <section className="overflow-hidden rounded-2xl border border-line bg-cream/80">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setPromptHistoryOpen((open) => !open)
                                    }
                                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-paper/70"
                                >
                                    <span>
                                        <span className="block font-display text-2xl font-medium">
                                            Prompt history
                                        </span>
                                        <span className="mt-1 block text-xs tracking-wide text-muted">
                                            {promptLog.length} total prompt
                                            {promptLog.length === 1 ? "" : "s"}{" "}
                                            across all projects
                                        </span>
                                    </span>
                                    <ChevronDown
                                        size={18}
                                        className={`shrink-0 text-muted transition ${
                                            promptHistoryOpen ? "rotate-180" : ""
                                        }`}
                                    />
                                </button>

                                {promptHistoryOpen && (
                                    <div className="border-t border-line">
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
                                )}
                            </section>
                        )}

                        <section>
                                <div className="mb-5 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                                <h2 className="font-display text-2xl font-medium">
                                    Projects
                                </h2>
                                <p className="text-xs tracking-wide text-muted sm:text-right">
                                    Customize, publish, or share your generated sites
                                </p>
                            </div>
                            <div className="grid gap-5 lg:grid-cols-2">
                                {websites.map((w, i) => {
                                    const copied = copiedId === w._id;
                                    const prompts = userPrompts(w);
                                    const expanded = expandedPromptIds.includes(
                                        w._id,
                                    );
                                    const latestPrompt =
                                        prompts[prompts.length - 1]?.content;
                                    return (
                                        <motion.article
                                            key={w._id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.04 }}
                                            ref={
                                                focusProjectId === w._id
                                                    ? focusedProjectRef
                                                    : null
                                            }
                                            className={`overflow-hidden rounded-2xl border bg-cream shadow-[0_24px_50px_-32px_rgba(44,38,34,0.28)] ${
                                                focusProjectId === w._id
                                                    ? "border-accent/40 ring-1 ring-accent/15"
                                                    : "border-line"
                                            }`}
                                        >
                                            <button
                                                onClick={() =>
                                                    navigate(`/editor/${w._id}`)
                                                }
                                                className="relative block h-44 w-full overflow-hidden border-b border-line bg-paper text-left sm:h-52"
                                            >
                                                <iframe
                                                    srcDoc={w.latestCode}
                                                    className="pointer-events-none absolute inset-0 origin-top-left h-[140%] w-[140%] scale-[0.72] bg-white"
                                                    title=""
                                                />
                                                <div className="absolute inset-0 bg-ink/5" />
                                            </button>

                                            <div className="p-4 sm:p-5">
                                                <div className="flex items-start justify-between gap-3 sm:gap-4">
                                                    <div className="min-w-0">
                                                        <h3 className="line-clamp-2 font-display text-2xl font-medium leading-tight">
                                                            {w.title}
                                                        </h3>
                                                        <p className="mt-1 text-xs font-light tracking-wide text-muted">
                                                            Updated{" "}
                                                            {formatWhen(
                                                                w.updatedAt,
                                                            )}{" "}
                                                            · {prompts.length} prompt
                                                            {prompts.length === 1
                                                                ? ""
                                                                : "s"}
                                                        </p>
                                                    </div>
                                                    <span
                                                        className={`shrink-0 rounded-full px-3 py-1 text-[11px] font-medium ${
                                                            w.deployed
                                                                ? "bg-paper text-muted"
                                                                : "bg-ink text-cream"
                                                        }`}
                                                    >
                                                        {w.deployed
                                                            ? "Published"
                                                            : "Draft"}
                                                    </span>
                                                </div>

                                                {latestPrompt && (
                                                    <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-ink/75">
                                                        {latestPrompt}
                                                    </p>
                                                )}

                                                <div className="mt-5 flex flex-wrap gap-2">
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
                                                            <RocketIcon size={14} />
                                                            Publish
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() =>
                                                                handleCopy(w)
                                                            }
                                                            className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm ${
                                                                copied
                                                                    ? "border border-line bg-paper"
                                                                    : "border border-line hover:border-ink/20"
                                                            }`}
                                                        >
                                                            {copied ? (
                                                                <>
                                                                    <Check size={14} />
                                                                    Copied
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <Share2 size={14} />
                                                                    Share
                                                                </>
                                                            )}
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() =>
                                                            toggleProjectPrompts(
                                                                w._id,
                                                            )
                                                        }
                                                        className="flex items-center gap-2 rounded-full px-3 py-2 text-sm text-muted hover:bg-paper sm:ml-auto"
                                                    >
                                                        Prompts
                                                        <ChevronDown
                                                            size={15}
                                                            className={`transition ${
                                                                expanded
                                                                    ? "rotate-180"
                                                                    : ""
                                                            }`}
                                                        />
                                                    </button>
                                                </div>

                                                {expanded && (
                                                    <div className="mt-5 border-t border-line pt-5">
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
                                                                            <div className="min-w-0">
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
                                                )}
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
