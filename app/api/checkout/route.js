import { NextResponse } from "next/server";
import { getStripe } from "../../../lib/stripe";
import { getEarrings } from "../../../lib/earrings";
import { CLAY_TONES, MAX_QTY_PER_ITEM } from "../../../lib/products";
import {
  SHIPPING_FLAT_CENTS,
  SHIPPING_COUNTRIES,
  qualifiesForFreeShipping,
} from "../../../lib/shipping";

// O cliente envia apenas `id` e `quantity`. Os preços e os nomes são lidos da
// coleção no servidor — nunca do pedido — para ninguém poder escolher o que paga.
//
// Quando a área Pets voltar, as chapinhas precisam de um caminho próprio que
// recalcule o preço no servidor a partir da forma/tamanho escolhidos, pela mesma razão.
function isValidRequest(item) {
  return (
    item &&
    typeof item.id === "string" &&
    item.id.trim().length > 0 &&
    Number.isInteger(item.quantity) &&
    item.quantity > 0 &&
    item.quantity <= MAX_QTY_PER_ITEM
  );
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Pedido inválido." }, { status: 400 });
  }

  const requested = body?.items;
  if (!Array.isArray(requested) || requested.length === 0 || !requested.every(isValidRequest)) {
    return NextResponse.json({ error: "Itens de encomenda inválidos." }, { status: 400 });
  }

  const collection = await getEarrings();
  const byId = new Map(collection.map((p) => [p.id, p]));

  const lineItems = [];
  for (const { id, quantity } of requested) {
    const product = byId.get(id);
    if (!product) {
      return NextResponse.json(
        { error: "Uma das peças já não está disponível. Atualiza a página e tenta de novo." },
        { status: 409 }
      );
    }
    if (product.stock !== null && quantity > product.stock) {
      return NextResponse.json(
        {
          error:
            product.stock === 0
              ? `"${product.name}" está esgotado.`
              : `Só temos ${product.stock} unidade(s) de "${product.name}".`,
        },
        { status: 409 }
      );
    }
    lineItems.push({ product, quantity });
  }

  const subtotal = lineItems.reduce(
    (sum, { product, quantity }) => sum + Math.round(product.price * 100) * quantity,
    0
  );
  const freeShipping = qualifiesForFreeShipping(subtotal);

  // O `Host` do pedido pode ser forjado, e ia parar aos URLs de retorno do Stripe
  // (alguém podia fazer o cliente aterrar noutro site depois de pagar). Em produção
  // manda o domínio configurado; o pedido só serve de recurso em desenvolvimento.
  const origin = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || request.nextUrl.origin;

  try {
    const session = await getStripe().checkout.sessions.create({
      mode: "payment",
      line_items: lineItems.map(({ product, quantity }) => ({
        quantity,
        price_data: {
          currency: "eur",
          unit_amount: Math.round(product.price * 100),
          product_data: {
            name: product.name,
            description: `Brincos em argila polimérica (par) — tom ${
              CLAY_TONES[product.tone]?.label ?? product.tone
            }`,
            ...(product.imageUrl ? { images: [product.imageUrl] } : {}),
          },
        },
      })),
      // Sem morada de envio não saberíamos para onde expedir a peça.
      shipping_address_collection: { allowed_countries: SHIPPING_COUNTRIES },
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            display_name: freeShipping
              ? "Portes grátis — correio registado"
              : "Correio registado (3–5 dias úteis)",
            fixed_amount: {
              amount: freeShipping ? 0 : SHIPPING_FLAT_CENTS,
              currency: "eur",
            },
            delivery_estimate: {
              minimum: { unit: "business_day", value: 3 },
              maximum: { unit: "business_day", value: 5 },
            },
          },
        },
      ],
      // Morada completa e NIF para a fatura-recibo.
      billing_address_collection: "required",
      tax_id_collection: { enabled: true },
      phone_number_collection: { enabled: true },
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cancel`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Erro ao criar sessão Stripe:", err);
    return NextResponse.json({ error: "Não foi possível iniciar o pagamento." }, { status: 500 });
  }
}
