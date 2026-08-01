import Link from "next/link";
import { ArrowRight, ShoppingBag } from "lucide-react";

export const metadata = { title: "Pagamento cancelado — tactum studio" };

export default function CancelPage() {
  return (
    <section className="section-narrow">
      <div className="success-card">
        <div className="success-icon success-icon--muted">
          <ShoppingBag size={26} color="var(--color-surface)" />
        </div>
        <h1 className="success-title">Pagamento cancelado</h1>
        <p className="success-text">
          Não foi cobrado nada e o teu carrinho ficou como estava. Podes retomar a compra
          quando quiseres.
        </p>
        <Link href="/brincos" className="btn btn-primary-sage" style={{ flex: "0 0 auto" }}>
          Voltar ao catálogo <ArrowRight size={15} className="btn-arrow" />
        </Link>
      </div>
    </section>
  );
}
