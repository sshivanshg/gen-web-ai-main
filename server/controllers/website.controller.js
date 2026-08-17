import Website from "../models/website.model.js";
import { FRONTEND_URL, SYSTEM_PROMPT } from "../utils/config.js";
import extractJson from "../utils/extractJson.js";
import { generateRespone } from "../utils/anthropic.js";

export const generateWebsite = async (req, res) => {
    try {
        const { prompt } = req.body;
        if (!prompt) {
            return res.status(400).json({
                message: "prompt is required",
            });
        }

        const finalPrompt = `${SYSTEM_PROMPT.replaceAll("{USER_PROMPT}", prompt)}

------------------------------------------------------------
USER BRIEF (IMPLEMENT THIS, NOTHING ELSE):
${prompt}
------------------------------------------------------------`;
        let raw = "";
        let parsed = null;

        for (let i = 0; i < 2 && !parsed; i++) {
            raw = await generateRespone(finalPrompt);
            parsed = await extractJson(raw);

            if (!parsed) {
                raw = await generateRespone(
                    finalPrompt + "\n\n RETURN ONLY VALID JSON",
                );

                parsed = await extractJson(raw);
            }
        }

        if (!parsed || !parsed.code) {
            console.log("AI returned invalid response", raw);
            return res.status(500).json({
                message: "AI returned invalid response",
            });
        }

        const website = await Website.create({
            title: prompt.slice(0, 60),
            latestCode: parsed.code,
            conversations: [
                {
                    role: "user",
                    content: prompt,
                },
                {
                    role: "ai",
                    content: parsed.message,
                },
            ],
        });

        return res.status(200).json({
            websiteId: website._id,
        });
    } catch (error) {
        console.error("Generate Website Error:", error);
        return res.status(500).json({
            message: "Internal Server Error",
            error: `Generate Website Error : ${error}`,
        });
    }
};

export const getWebsiteById = async (req, res) => {
    try {
        const website = await Website.findById(req.params.id);

        if (!website) {
            return res.status(404).json({
                message: "Website not found",
            });
        }

        return res.status(200).json(website);
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: `Get Website By Id Error : ${error}`,
        });
    }
};

export const changes = async (req, res) => {
    try {
        const { prompt } = req.body;
        if (!prompt) {
            return res.status(400).json({
                message: "prompt is required",
            });
        }

        const website = await Website.findById(req.params.id);

        if (!website) {
            return res.status(404).json({
                message: "Website not found",
            });
        }

        let UPDATE_PROMPT = `
USER REQUEST (MUST APPLY — returning the previous HTML unchanged is invalid):
${prompt}

UPDATE THE HTML WEBSITE TO SATISFY THAT REQUEST.
KEEP WHAT STILL FITS. CHANGE EVERYTHING THE REQUEST ASKS FOR.
DO NOT RETURN THE ORIGINAL SITE.

CURRENT CODE:
${website.latestCode}

RETURN RAW JSON ONLY:
{
    "message": "Short confirmation of what changed",
    "code": "<UPDATED FULL HTML DOCUMENT>"
}
            `;

        let raw = "";
        let parsed = null;

        for (let i = 0; i < 2 && !parsed; i++) {
            raw = await generateRespone(UPDATE_PROMPT);
            parsed = await extractJson(raw);

            if (!parsed) {
                raw = await generateRespone(
                    UPDATE_PROMPT + "\n\n RETURN ONLY VALID JSON",
                );

                parsed = await extractJson(raw);
            }
        }

        if (!parsed || !parsed.code) {
            console.log("AI returned invalid response", raw);
            return res.status(500).json({
                message: "AI returned invalid response",
            });
        }

        website.conversations.push({
            role: "user",
            content: prompt,
        });

        website.conversations.push({
            role: "ai",
            content: parsed.message,
        });

        website.latestCode = parsed.code;
        await website.save();

        return res.status(200).json({
            message: parsed.message,
            code: parsed.code,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: `Changes Error : ${error}`,
        });
    }
};

export const getAll = async (req, res) => {
    try {
        const websites = await Website.find().sort({ updatedAt: -1 });

        return res.status(200).json(websites);
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: `Get All Error : ${error}`,
        });
    }
};

export const deploy = async (req, res) => {
    try {
        const website = await Website.findById(req.params.id);

        if (!website) {
            return res.status(404).json({
                message: "Website not found",
            });
        }

        if (!website.slug) {
            website.slug =
                website.title
                    .toLowerCase()
                    .replace(/[^a-z0-9]/g, "")
                    .slice(0, 60) +
                "-" +
                website._id.toString().slice(-5);
        }
        website.deployed = true;

        website.deployedUrl = `${FRONTEND_URL}/site/${website.slug}`;

        await website.save();

        return res.status(200).json({
            url: website.deployedUrl,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: `Deploy Error : ${error}`,
        });
    }
};

export const getWebsiteBySlug = async (req, res) => {
    try {
        const website = await Website.findOne({
            slug: req.params.slug,
        });

        if (!website) {
            return res.status(404).json({
                message: "Website not found",
            });
        }

        return res.status(200).json(website);
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: `Get By Slug Error : ${error}`,
        });
    }
};
