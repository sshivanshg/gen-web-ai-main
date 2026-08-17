/* eslint-disable no-unused-vars */
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { serverURL } from "../config";
import useDocumentTitle from "../hooks/useDocumentTitle";
import { BRAND } from "../brand";

const LiveSite = () => {
    useDocumentTitle(`Live — ${BRAND.name}`);
    const { id } = useParams();

    const [htmlPage, setHtmlPage] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        const handleGetWebsite = async () => {
            try {
                const result = await axios.get(
                    `${serverURL}/api/website/get-by-slug/${id}`,
                );

                if (!result.data) {
                    setError("Site not found");
                    return;
                }

                setHtmlPage(result.data.latestCode);
            } catch (error) {
                console.log(error);
                setError(error.response?.data?.message || "Site not found");
            }
        };

        handleGetWebsite();
    }, [id]);

    if (error) {
        return (
            <div className="flex h-screen items-center justify-center bg-paper px-4 text-center font-light text-muted">
                {error}
            </div>
        );
    }
    return (
        <iframe
            title="Live site"
            srcDoc={htmlPage}
            className="h-screen w-full border-none"
            sandbox="allow-scripts allow-same-origin allow-forms"
        />
    );
};

export default LiveSite;
