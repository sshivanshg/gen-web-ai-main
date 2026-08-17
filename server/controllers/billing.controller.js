import { PLANS } from "../utils/plan.js";
import { FRONTEND_URL, STRIPE_SECRET_KEY } from "../utils/config.js";
import stripe from "../utils/stripe.js";

const normalizedFrontendUrl = (FRONTEND_URL || "").replace(/\/$/, "");

export const billing = async (req, res) => {
    try {
        if (!stripe || !STRIPE_SECRET_KEY) {
            return res.status(503).json({
                message: "Stripe is not configured yet",
            });
        }

        const { plan } = req.body;
        const selectedPlan = PLANS[plan];

        if (!selectedPlan || plan === "free") {
            return res.status(400).json({
                message: "Please choose a paid plan",
            });
        }

        if (!req.user?.id) {
            return res.status(401).json({
                message: "Authentication required",
            });
        }

        const session = await stripe.checkout.sessions.create({
            mode: "payment",
            customer_email: req.user.email,
            success_url: `${normalizedFrontendUrl}/projects?checkout=success`,
            cancel_url: `${normalizedFrontendUrl}/pricing?checkout=cancelled`,
            metadata: {
                userId: req.user.id,
                plan: selectedPlan.plan,
                credits: String(selectedPlan.credits),
            },
            line_items: [
                {
                    quantity: 1,
                    price_data: {
                        currency: "inr",
                        unit_amount: selectedPlan.price * 100,
                        product_data: {
                            name: `${selectedPlan.plan.toUpperCase()} Plan`,
                            description: `${selectedPlan.credits} credits for GenWeb.ai`,
                        },
                    },
                },
            ],
        });

        return res.status(200).json({
            url: session.url,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Billing Error",
            error: `${error}`,
        });
    }
};
