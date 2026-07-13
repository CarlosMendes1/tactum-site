import Link from "next/link";
import { stripe } from "../../lib/stripe";

export const metadata = { title: "Encomenda confirmada — tactum studio" };

async function getSession(sessionId) {
  if (!sessionId) return null;
  try {
    return await stripe.checkout.sessions.retrieve(sessionId);
  } catch {
    return null;
  }
}

export default async function SuccessPage({ searchParams }) {
  const sessionId = searchParams?.session_id;
  const session = await getSession(sessionId);
  const paid = session?.payment_status === "paid";

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F3EEE2", fontFamily: "'Trebuchet MS','Segoe UI',sans-serif", color: "#2E2B26", padding: 24 }}>
      <div style={{ maxWidth: 440, textAlign: "center", background: "#F7F2E7", borderRadius: 20, padding: "40px 32px", boxShadow: "inset 0 0 0 1px #DFD6C1" }}>
        <h1 style={{ fontFamily: "Georgia,serif", fontSize: 24, margin: "0 0 12px" }}>
          {paid ? "Pagamento confirmado" : "Encomenda recebida"}
        </h1>
        <p style={{ fontSize: 14, color: "#6B675C", lineHeight: 1.6, margin: "0 0 24px" }}>
          {paid
            ? "Obrigado! Recebemos o teu pagamento e vamos começar a preparar a tua peça."
            : "Recebemos a tua sessão de pagamento. Se já pagaste, vais receber a confirmação em breve."}
        </p>
        <Link
          href="/"
          style={{ display: "inline-block", border: "1.5px solid #5C6B4A", color: "#5C6B4A", borderRadius: 10, padding: "10px 20px", fontSize: 13, fontWeight: 700, textDecoration: "none" }}
        >
          Voltar ao site
        </Link>
      </div>
    </div>
  );
}
