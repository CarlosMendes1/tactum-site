import Link from "next/link";
import { PawPrint, Sparkles, ArrowRight, Truck, Leaf, Gem } from "lucide-react";
import { EARRINGS, CLAY_TONES, formatPrice } from "../lib/products";
import EarringVisual from "../components/EarringVisual";
import Reveal from "../components/Reveal";

const FEATURES = [
  { icon: Gem, title: "Feito à mão", desc: "Cada peça moldada e cozida artesanalmente." },
  { icon: Leaf, title: "Argila natural", desc: "Materiais simples, sem plásticos desnecessários." },
  { icon: Sparkles, title: "Peça única", desc: "Nunca dois brincos exatamente iguais." },
  { icon: Truck, title: "Envio cuidado", desc: "Embalado com cuidado, direto de Portugal." },
];

const MARQUEE_ITEMS = [
  "Feito à mão em Portugal",
  "Argila natural",
  "Nunca dois iguais",
  "Pequenas séries",
  "Do barro ao forno",
];

function MarqueeContent() {
  return (
    <span className="marquee-item">
      {MARQUEE_ITEMS.map((item) => (
        <span key={item} style={{ display: "inline-flex", alignItems: "center", gap: 44 }}>
          {item} <span className="dot" />
        </span>
      ))}
    </span>
  );
}

export default function Home() {
  const highlights = EARRINGS.slice(0, 4);
  const floatLeft = EARRINGS.find((e) => e.id === "argola-terra");
  const floatRight = EARRINGS.find((e) => e.id === "gota-salvia");

  return (
    <>
      <section className="hero hero-dark">
        <div className="hero-float hero-float-1" aria-hidden="true">
          <EarringVisual product={floatLeft} size={130} idSuffix="hero1" />
        </div>
        <div className="hero-float hero-float-2" aria-hidden="true">
          <EarringVisual product={floatRight} size={116} idSuffix="hero2" />
        </div>

        <div className="hero-inner">
          <div className="hero-badge">COLEÇÃO ATUAL</div>
          <h1 className="hero-title">
            Peças de argila moldadas à mão, <span className="hero-accent">uma a uma</span>
          </h1>
          <p className="hero-sub">
            Cada par de brincos nasce do barro e do forno — nunca dois exatamente iguais.
          </p>
          <div className="hero-actions">
            <Link href="/brincos" className="btn btn-primary btn-lg">
              Ver catálogo <ArrowRight size={15} className="btn-arrow" />
            </Link>
            <Link href="/pets" className="btn btn-ghost-dark btn-lg">
              Ver área Pets
            </Link>
          </div>
        </div>
        <div className="scroll-cue" aria-hidden="true" />
      </section>

      <div className="marquee" aria-hidden="true">
        <div className="marquee-track">
          <MarqueeContent />
          <MarqueeContent />
        </div>
      </div>

      <Reveal>
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
      </Reveal>

      <section className="section-narrow">
        <Reveal>
          <div className="section-head">
            <h2 className="section-title">Mais recentes</h2>
            <Link href="/brincos" className="section-link">
              Ver catálogo completo <ArrowRight size={14} />
            </Link>
          </div>
        </Reveal>
        <div className="highlight-grid">
          {highlights.map((item, i) => (
            <Reveal key={item.id} delay={i * 90}>
              <Link href="/brincos" className="cat-card" style={{ textDecoration: "none", color: "inherit" }}>
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
            </Reveal>
          ))}
        </div>
      </section>

      <Reveal>
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
              Ver área Pets <ArrowRight size={15} className="btn-arrow" />
            </Link>
          </div>
        </section>
      </Reveal>
    </>
  );
}
