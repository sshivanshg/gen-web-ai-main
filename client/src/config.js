const DEFAULT_API_URL = "https://gen-web-ai-main.onrender.com";

export const serverURL = (
    import.meta.env.VITE_API_URL || DEFAULT_API_URL
).replace(/\/$/, "");
