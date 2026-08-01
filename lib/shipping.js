// Portes de envio — a única fonte de verdade, usada pelo carrinho e pelo checkout.
//
// Custo real dos CTT (tarifário 2026): correio registado até 20 g fica em 3,20 €
// na entrega em caixa de correio e 3,75 € ao balcão. A taxa fixa abaixo cobre isso.

export const SHIPPING_FLAT_CENTS = 350; // 3,50 €
export const FREE_SHIPPING_THRESHOLD_CENTS = 3500; // 35,00 €

// Países onde entregamos. Códigos ISO aceites pelo Stripe.
// Para já só Portugal; acrescentar "ES" e restantes quando os portes estiverem definidos.
export const SHIPPING_COUNTRIES = ["PT"];

export const qualifiesForFreeShipping = (subtotalCents) =>
  subtotalCents >= FREE_SHIPPING_THRESHOLD_CENTS;

// Quanto falta para atingir portes grátis (0 quando já qualifica).
export const amountToFreeShipping = (subtotalCents) =>
  Math.max(0, FREE_SHIPPING_THRESHOLD_CENTS - subtotalCents);
