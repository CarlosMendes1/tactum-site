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
        <Link href="/brincos" className="btn btn-primary-sage" style={{ flex: "0 0 auto" }}>
          Continuar a ver brincos <ArrowRight size={15} className="btn-arrow" />
        </Link>
      </div>
    </section>
  );
}
