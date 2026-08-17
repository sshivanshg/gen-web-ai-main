/* eslint-disable no-unused-vars */
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { serverURL } from "../config";
import { Code2, MessageSquare, Monitor, Rocket, Send, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Editor from "@monaco-editor/react";
import useDocumentTitle from "../hooks/useDocumentTitle";
import { BRAND } from "../brand";

const thinkingSteps = [
    "Reading the request...",
    "Considering the layout...",
    "Adjusting the rhythm...",
    "Refining the motion...",
    "Closing the piece...",
];

const ChatPane = ({
    title,
    onTitleClick,
    onClose,
    messages,
    updateLoading,
    thinkingIndex,
    prompt,
    setPrompt,
    onSubmit,
}) => (
    <>
        <div className="flex h-14 items-center justify-between border-b border-line px-4">
            <button
                onClick={onTitleClick}
                className="truncate font-display text-lg font-medium"
            >
                {title}
            </button>
            {onClose && (
                <button className="cursor-pointer lg:hidden" onClick={onClose}>
                    <X size={18} />
                </button>
            )}
        </div>
        <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
            {messages.map((m, i) => (
                <div
                    key={`${m.role}-${i}-${m.content?.slice(0, 24)}`}
                    className={`max-w-[85%] ${m.role === "user" ? "ml-auto" : "mr-auto"}`}
                >
                    <div
                        className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                            m.role === "user"
                                ? "bg-ink text-cream"
                                : "border border-line bg-cream text-ink/80"
                        }`}
                    >
                        {m.content}
                    </div>
                </div>
            ))}

            {updateLoading && (
                <div className="mr-auto max-w-[85%]">
                    <div className="rounded-2xl border border-line bg-paper px-4 py-2.5 text-xs italic text-muted">
                        {thinkingSteps[thinkingIndex]}
                    </div>
                </div>
            )}
        </div>
        <form
            className="border-t border-line p-3"
            onSubmit={(e) => {
                e.preventDefault();
                onSubmit();
            }}
        >
            <div className="flex gap-2">
                <input
                    type="text"
                    placeholder="Describe a change…"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    disabled={updateLoading}
                    className="flex-1 rounded-full border border-line bg-cream px-4 py-3 text-sm text-ink outline-none placeholder:text-muted/70 focus:border-accent/40 disabled:opacity-60"
                />
                <button
                    type="submit"
                    className="rounded-full bg-accent px-4 py-3 text-cream transition hover:bg-accent-dark disabled:opacity-50"
                    disabled={updateLoading || !prompt.trim()}
                >
                    <Send size={14} />
                </button>
            </div>
        </form>
    </>
);

const WebSiteEditor = () => {
    const [website, setWebsite] = useState(null);
    useDocumentTitle(
        website?.title
            ? `${website.title} — ${BRAND.name}`
            : `Editor — ${BRAND.name}`,
    );
    const [error, setError] = useState("");
    const [code, setCode] = useState("");
    const [messages, setMessages] = useState([]);
    const [prompt, setPrompt] = useState("");
    const [updateLoading, setUpdateLoading] = useState(false);
    const [index, setIndex] = useState(0);
    const [showCode, setShowCode] = useState(false);
    const [showFullPreview, setShowFullPreview] = useState(false);
    const [showChat, setShowChat] = useState(false);

    const { id } = useParams();
    const navigate = useNavigate();

    const handleUpdate = async () => {
        const currentPrompt = prompt.trim();
        if (!currentPrompt || updateLoading) return;

        setMessages((m) => [...m, { role: "user", content: currentPrompt }]);
        setUpdateLoading(true);
        setPrompt("");

        try {
            const result = await axios.post(
                `${serverURL}/api/website/update/${id}`,
                { prompt: currentPrompt },
                { withCredentials: true },
            );

            setMessages((m) => [
                ...m,
                { role: "ai", content: result.data.message },
            ]);

            setCode(result.data.code);
            setWebsite((prev) =>
                prev
                    ? {
                          ...prev,
                          latestCode: result.data.code,
                          updatedAt: new Date().toISOString(),
                      }
                    : prev,
            );
        } catch (err) {
            console.log(err);
            setPrompt(currentPrompt);
            setMessages((m) => m.slice(0, -1));
        } finally {
            setUpdateLoading(false);
        }
    };

    useEffect(() => {
        if (!updateLoading) return;
        const i = setInterval(() => {
            setIndex((step) => (step + 1) % thinkingSteps.length);
        }, 1300);

        return () => clearInterval(i);
    }, [updateLoading]);

    useEffect(() => {
        let cancelled = false;

        const handleGetWebsite = async () => {
            try {
                const result = await axios.get(
                    `${serverURL}/api/website/get-by-id/${id}`,
                    { withCredentials: true },
                );
                if (cancelled) return;

                setWebsite(result.data);
                setCode(result.data.latestCode);
                setMessages(result.data.conversations || []);
            } catch (err) {
                console.log(err);
                if (!cancelled) {
                    setError(err.response?.data?.message || "Not found");
                }
            }
        };

        handleGetWebsite();
        return () => {
            cancelled = true;
        };
    }, [id]);

    const handleDeploy = async () => {
        try {
            const result = await axios.get(
                `${serverURL}/api/website/deploy/${website._id}`,
                {
                    withCredentials: true,
                },
            );

            window.open(`${result.data.url}`, "_blank");
            setWebsite((prev) =>
                prev ? { ...prev, deployed: true, deployedUrl: result.data.url } : prev,
            );
        } catch (err) {
            console.log(err);
        }
    };

    if (error)
        return (
            <div className="flex h-screen items-center justify-center bg-paper font-light text-accent">
                {error}
            </div>
        );

    if (!website) {
        return (
            <div className="flex h-screen items-center justify-center bg-paper font-light text-muted">
                Opening the studio…
            </div>
        );
    }

    const chatProps = {
        title: website.title,
        onTitleClick: () => navigate("/dashboard"),
        messages,
        updateLoading,
        thinkingIndex: index,
        prompt,
        setPrompt,
        onSubmit: handleUpdate,
    };

    return (
        <div className="flex h-screen w-screen overflow-hidden bg-paper text-ink">
            <aside className="hidden w-96 flex-col border-r border-line bg-cream/80 lg:flex">
                <ChatPane {...chatProps} />
            </aside>

            <div className="flex flex-1 flex-col">
                <div className="flex h-14 items-center justify-between border-b border-line bg-cream/80 px-4">
                    <span className="text-[11px] uppercase tracking-[0.2em] text-muted">
                        Preview
                    </span>
                    <div className="flex items-center gap-2">
                        {!website.deployed && (
                            <button
                                onClick={() => handleDeploy()}
                                className="flex items-center gap-2 rounded-full bg-ink px-4 py-1.5 text-sm font-medium text-cream transition hover:bg-accent"
                            >
                                <Rocket size={14} /> Publish
                            </button>
                        )}

                        <button
                            onClick={() => setShowChat(true)}
                            className="cursor-pointer rounded-full p-2 text-muted hover:bg-paper lg:hidden"
                        >
                            <MessageSquare size={18} />
                        </button>
                        <button
                            className="cursor-pointer rounded-full p-2 text-muted hover:bg-paper"
                            onClick={() => setShowCode(true)}
                        >
                            <Code2 size={18} />
                        </button>
                        <button
                            className="cursor-pointer rounded-full p-2 text-muted hover:bg-paper"
                            onClick={() => setShowFullPreview(true)}
                        >
                            <Monitor size={18} />
                        </button>
                    </div>
                </div>

                <iframe
                    key={`${id}-${website.updatedAt || code.length}`}
                    srcDoc={code}
                    className="w-full flex-1 bg-white"
                    sandbox="allow-scripts allow-same-origin allow-forms"
                    title="Preview"
                />
            </div>

            <AnimatePresence>
                {showChat && (
                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        className="fixed inset-0 z-9999 flex flex-col bg-cream"
                    >
                        <ChatPane
                            {...chatProps}
                            onClose={() => setShowChat(false)}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showCode && (
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        className="fixed inset-y-0 right-0 z-9999 flex w-full flex-col border-l border-line bg-cream lg:w-[45%]"
                    >
                        <div className="flex h-12 items-center justify-between border-b border-line px-4">
                            <span className="text-sm font-medium tracking-wide">
                                index.html
                            </span>
                            <button onClick={() => setShowCode(false)}>
                                <X size={18} />
                            </button>
                        </div>

                        <Editor
                            theme="vs"
                            value={code}
                            language="html"
                            onChange={(v) => setCode(v || "")}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showFullPreview && (
                    <motion.div className="fixed inset-0 z-9999 bg-paper">
                        <iframe
                            key={`full-${id}-${code.length}`}
                            className="h-full w-full bg-white"
                            srcDoc={code}
                            sandbox="allow-scripts allow-same-origin allow-forms"
                            title="Full preview"
                        />

                        <button
                            className="absolute top-4 right-4 rounded-full bg-cream/90 p-2 text-ink shadow-sm"
                            onClick={() => setShowFullPreview(false)}
                        >
                            <X size={18} />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default WebSiteEditor;
