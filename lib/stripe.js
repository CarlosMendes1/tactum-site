import Stripe from "stripe";

let client = null;

// Inicialização preguiçosa: só exige a chave quando o Stripe é mesmo usado,
// para o build e as restantes páginas funcionarem sem .env.local
export function getStripe() {
  if (!client) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("STRIPE_SECRET_KEY não está definida (ver .env.local.example).");
    }
    client = new Stripe(process.env.STRIPE_SECRET_KEY);
  }
  return client;
}
