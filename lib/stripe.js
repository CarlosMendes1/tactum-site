import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY não está definida (ver .env.local.example).");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
