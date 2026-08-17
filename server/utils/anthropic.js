import { ANTHROPIC_API_KEY, ANTHROPIC_URL, MODEL_NAME } from "./config.js";

export const generateRespone = async (prompt) => {
    const response = await fetch(ANTHROPIC_URL, {
        method: "POST",
        headers: {
            "x-api-key": ANTHROPIC_API_KEY,
            "anthropic-version": "2023-06-01",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            model: MODEL_NAME,
            max_tokens: 16384,
            system: "You must return ONLY valid raw JSON",
            messages: [
                {
                    role: "user",
                    content: prompt,
                },
            ],
        }),
    });

    if (!response.ok) {
        const error = await response.text();
        console.error("Anthropic API error:", response.status, error);
        throw new Error(`Anthropic Error : ${error}`);
    }

    const data = await response.json();
    const text = (data.content || [])
        .filter((block) => block.type === "text")
        .map((block) => block.text)
        .join("");

    if (!text) {
        throw new Error("Anthropic Error : empty response");
    }

    return text;
};
