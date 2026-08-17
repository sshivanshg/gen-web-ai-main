import Stripe from "stripe";
import { STRIPE_SECRET_KEY } from "./config.js";

let stripe;

if (STRIPE_SECRET_KEY) {
    stripe = new Stripe(STRIPE_SECRET_KEY);
} else {
    console.warn("⚠️  Stripe API key not configured. Stripe features will be disabled.");
    stripe = null;
}

export default stripe;
