import Link from "next/link";

export const metadata = { title: "Pagamento cancelado — tactum studio" };

export default function CancelPage() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F3EEE2", fontFamily: "'Trebuchet MS','Segoe UI',sans-serif", color: "#2E2B26", padding: 24 }}>
      <div style={{ maxWidth: 440, textAlign: "center", background: "#F7F2E7", borderRadius: 20, padding: "40px 32px", boxShadow: "inset 0 0 0 1px #DFD6C1" }}>
        <h1 style={{ fontFamily: "Georgia,serif", fontSize: 24, margin: "0 0 12px" }}>Pagamento cancelado</h1>
        <p style={{ fontSize: 14, color: "#6B675C", lineHeight: 1.6, margin: "0 0 24px" }}>
          Não te preocupes, não foi cobrado nada. Podes voltar ao site e tentar novamente quando quiseres.
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
