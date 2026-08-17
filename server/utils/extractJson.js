const extractJson = async (raw) => {
    if (!raw) return null;

    const cleaned = raw
        .replace(/```json/gi, "")
        .replace(/```/g, "")
        .trim();

    const start = cleaned.search(/\{\s*"message"\s*:/);
    const firstBracket = start === -1 ? cleaned.indexOf("{") : start;
    const lastBracket = cleaned.lastIndexOf("}");

    if (firstBracket === -1 || lastBracket === -1) return null;

    const jsonString = cleaned.slice(firstBracket, lastBracket + 1);

    try {
        const parsed = JSON.parse(jsonString);
        if (parsed?.code) return parsed;
    } catch {
        // fall through to a looser extractor
    }

    const messageMatch = jsonString.match(
        /"message"\s*:\s*"((?:\\.|[^"\\])*)"/,
    );
    const codeKey = jsonString.search(/"code"\s*:\s*"/);
    if (codeKey === -1) return null;

    const codeStart = jsonString.indexOf('"', jsonString.indexOf(":", codeKey)) + 1;
    let codeEnd = jsonString.lastIndexOf('"');
    const trailing = jsonString.lastIndexOf('"}');
    if (trailing > codeStart) codeEnd = trailing;

    if (codeStart <= 0 || codeEnd <= codeStart) return null;

    return {
        message: messageMatch ? messageMatch[1] : "Website generated",
        code: jsonString
            .slice(codeStart, codeEnd)
            .replace(/\\n/g, "\n")
            .replace(/\\"/g, '"')
            .replace(/\\t/g, "\t"),
    };
};

export default extractJson;
