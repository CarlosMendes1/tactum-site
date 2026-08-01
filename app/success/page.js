import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import { getStripe } from "../../lib/stripe";

export const metadata = { title: "Encomenda confirmada — tactum studio" };

async function getSession(sessionId) {
  if (!sessionId) return null;
  try {
    return await getStripe().checkout.sessions.retrieve(sessionId);
  } catch {
    return null;
  }
}

export default async function SuccessPage({ searchParams }) {
  const sessionId = searchParams?.session_id;
  const session = await getSession(sessionId);
  const paid = session?.payment_status === "paid";
  const shipping = session?.shipping_details ?? session?.customer_details;

  return (
    <section className="section-narrow">
      <div className="success-card">
        <div className="success-icon">
          <Check size={28} color="var(--color-surface)" strokeWidth={3} />
        </div>
        <h1 className="success-title">
          {paid ? "Pagamento confirmado" : "Encomenda recebida"}
        </h1>
        <p className="success-text">
          {paid
            ? "Obrigado! Recebemos o teu pagamento e vamos começar a preparar a tua peça — feita à mão, uma a uma."
            : "Recebemos a tua sessão de pagamento. Se já pagaste, vais receber a confirmação por email em breve."}
        </p>
        {shipping && (
          <div className="success-ship">
            <span className="success-ship-label">Enviamos para</span>
            <address className="success-ship-address">
              {shipping.name && <span>{shipping.name}</span>}
              {shipping.address?.line1 && <span>{shipping.address.line1}</span>}
              {shipping.address?.line2 && <span>{shipping.address.line2}</span>}
              <span>
                {[shipping.address?.postal_code, shipping.address?.city].filter(Boolean).join(" ")}
              </span>
            </address>
          </div>
        )}
        <Link href="/brincos" className="btn btn-primary-sage" style={{ flex: "0 0 auto" }}>
          Continuar a ver brincos <ArrowRight size={15} className="btn-arrow" />
        </Link>
      </div>
    </section>
  );
}
