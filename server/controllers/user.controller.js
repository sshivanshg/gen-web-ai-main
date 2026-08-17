import extractJson from "../utils/extractJson.js";
import { generateRespone } from "../utils/anthropic.js";

export const getCurrentUser = async (req, res) => {
    try {
        if (!req.user) {
            return res.json({
                user: null,
            });
        }

        return res.json({
            user: req.user,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: `Get Current User Error : ${error}`,
        });
    }
};

// export const generateDemo = async (req, res) => {
//     try {
//         const data = await generateRespone("hello");

//         const jsonData = await extractJson(data);

//         return res.status(200).json(jsonData);
//     } catch (error) {
//         res.status(500).json({
//             message: "Internal Server Error",
//             error: `Generate Demo Error : ${error}`,
//         });
//     }
// };
