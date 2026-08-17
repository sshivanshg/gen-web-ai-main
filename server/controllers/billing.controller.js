export const billing = async (req, res) => {
    return res.status(400).json({
        message: "Billing is disabled while authentication is off",
    });
};
