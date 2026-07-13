import Link from "next/link";
import { PawPrint, Sparkles, ArrowRight, Truck, Leaf, Gem } from "lucide-react";
import { EARRINGS, CLAY_TONES, formatPrice } from "../lib/products";
import EarringVisual from "../components/EarringVisual";

const FEATURES = [
  { icon: Gem, title: "Feito à mão", desc: "Cada peça moldada e cozida artesanalmente." },
  { icon: Leaf, title: "Argila natural", desc: "Materiais simples, sem plásticos desnecessários." },
  { icon: Sparkles, title: "Peça única", desc: "Nunca dois brincos exatamente iguais." },
  { icon: Truck, title: "Envio cuidado", desc: "Embalado com cuidado, direto de Portugal." },
];

export default function Home() {
  const highlights = EARRINGS.slice(0, 4);

  return (
    <>
      <section className="hero hero-dark">
        <div className="hero-badge">
          <Sparkles size={14} /> COLEÇÃO ATUAL
        </div>
        <h1 className="hero-title">Peças de argila moldadas à mão, uma a uma</h1>
        <p className="hero-sub">
          Cada par de brincos nasce do barro e do forno — nunca dois exatamente iguais.
        </p>
        <div className="hero-actions">
          <Link href="/brincos" className="btn btn-primary">
            Ver catálogo <ArrowRight size={15} />
          </Link>
          <Link href="/pets" className="btn btn-ghost-dark">
            Ver área Pets
          </Link>
        </div>
      </section>

      <section className="features-grid">
        {FEATURES.map((f) => (
          <div key={f.title} className="feature-item">
            <div className="feature-icon"><f.icon size={18} /></div>
            <div>
              <div className="feature-title">{f.title}</div>
              <div className="feature-desc">{f.desc}</div>
            </div>
          </div>
        ))}
      </section>

      <section className="section-narrow">
        <div className="section-head">
          <h2 className="section-title">Mais recentes</h2>
          <Link href="/brincos" className="section-link">
            Ver catálogo completo <ArrowRight size={14} />
          </Link>
        </div>
        <div className="highlight-grid">
          {highlights.map((item) => (
            <Link key={item.id} href="/brincos" className="cat-card" style={{ textDecoration: "none", color: "inherit" }}>
              <span className="cat-visual" style={{ background: CLAY_TONES[item.tone].tile }}>
                {item.isNew && <span className="badge">Novo</span>}
                <EarringVisual product={item} size={140} idSuffix="home" />
              </span>
              <span className="cat-info">
                <span>
                  <span className="product-name">{item.name}</span>
                  <span className="product-tone" style={{ display: "block" }}>{CLAY_TONES[item.tone].label}</span>
                </span>
                <span className="product-price">{formatPrice(item.price)}</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="cross-sell">
        <div className="cross-sell-inner">
          <div className="cross-sell-info">
            <div className="cross-sell-icon"><PawPrint size={22} /></div>
            <div>
              <div className="cross-sell-title">Também fazemos chapinhas para colares</div>
              <div className="cross-sell-desc">Mesmo barro, agora para o teu animal.</div>
            </div>
          </div>
          <Link href="/pets" className="btn btn-outline-sage">
            Ver área Pets <ArrowRight size={15} />
          </Link>
        </div>
      </section>
    </>
  );
}
