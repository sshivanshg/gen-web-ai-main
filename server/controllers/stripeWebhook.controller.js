import User from "../models/user.model.js";
import { STRIPE_WEBHOOK_SECRET } from "../utils/config.js";
import stripe from "../utils/stripe.js";

export const stripeWebhook = async (req, res) => {
    try {
        const signature = req.headers["stripe-signature"];
        let event = await stripe.webhooks.constructEvent(
            req.body,
            signature,
            STRIPE_WEBHOOK_SECRET,
        );

        if (event.type === "checkout.session.completed") {
            const session = event.data.object;
            // console.log(session);
            const userId = session.metadata.userId;
            const credits = Number(session.metadata.credits);
            const plan = session.metadata.plan;

            const user = await User.findByIdAndUpdate(userId, {
                $inc: { credits: credits },
                plan: plan,
            });
        }

        return res.status(200).json({ message: "success" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Stripe Webhook Error",
            error: "webhook error from stripe",
        });
    }
};


