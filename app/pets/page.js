import Link from "next/link";
import { PawPrint, ArrowRight } from "lucide-react";
// O customizador está pronto mas ainda não vai para produção.
// Para reativar a área Pets, volta a: import PetsCustomizer + `return <PetsCustomizer />`.
// import PetsCustomizer from "../../components/PetsCustomizer";

export const metadata = {
  title: "Chapinhas para pets — em breve — tactum studio",
  description:
    "Chapinhas personalizadas em argila polimérica para o teu animal. Disponível brevemente na tactum studio.",
};

export default function PetsPage() {
  return (
    <section className="hero hero-light coming-soon">
      <div className="hero-badge hero-badge-sage">
        <PawPrint size={14} /> EM BREVE
      </div>
      <h1 className="hero-title hero-title-sm">Chapinhas para o teu companheiro</h1>
      <p className="hero-sub hero-sub-light">
        Estamos a preparar uma linha de chapinhas personalizadas em argila polimérica —
        a mesma dos nossos brincos, agora para o teu animal. Disponível brevemente.
      </p>
      <div className="hero-actions" style={{ marginTop: 28 }}>
        <Link href="/brincos" className="btn btn-primary-sage btn-lg" style={{ flex: "0 0 auto" }}>
          Ver os brincos entretanto <ArrowRight size={15} className="btn-arrow" />
        </Link>
      </div>
    </section>
  );
}
