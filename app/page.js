import Link from "next/link";
import { PawPrint, Sparkles, ArrowRight, Truck, Feather, Gem } from "lucide-react";
import { CLAY_TONES, formatPrice } from "../lib/products";
import { getEarrings } from "../lib/earrings";
import PieceVisual from "../components/PieceVisual";
import Reveal from "../components/Reveal";

// Os destaques vêm do Supabase; a página revalida a cada 60s
export const revalidate = 60;

const FEATURES = [
  { icon: Gem, title: "Feito à mão", desc: "Cada peça modelada e cozida artesanalmente." },
  { icon: Feather, title: "Muito leves", desc: "Argila polimérica — usa-os o dia todo sem dar por eles." },
  { icon: Sparkles, title: "Peça única", desc: "Nunca dois brincos exatamente iguais." },
  { icon: Truck, title: "Envio cuidado", desc: "Embalado com cuidado, direto de Portugal." },
];

export default async function Home() {
  const products = await getEarrings();
  const highlights = products.slice(0, 4);

  return (
    <>
      <section className="hero hero-dark">
        {/* Vídeo de fundo em loop; se /videos/hero.mp4 não existir, fica o gradiente */}
        <video className="hero-video" autoPlay muted loop playsInline preload="metadata" aria-hidden="true">
          {/* o ?v= força o browser a ignorar a cache quando o vídeo muda */}
          <source src="/videos/hero.mp4?v=2" type="video/mp4" />
        </video>
        <div className="hero-scrim" aria-hidden="true" />

        <div className="hero-inner">
          <div className="hero-badge">COLEÇÃO ATUAL</div>
          <h1 className="hero-title">
            Brincos em argila polimérica, moldados à mão <span className="hero-accent">um a um</span>
          </h1>
          <p className="hero-sub">
            Cada par é modelado cor a cor e cozido no forno — nunca dois exatamente iguais.
          </p>
          <div className="hero-actions">
            <Link href="/brincos" className="btn btn-primary btn-lg">
              Ver catálogo <ArrowRight size={15} className="btn-arrow" />
            </Link>
            <Link href="/pets" className="btn btn-ghost-dark btn-lg">
              Chapinhas para pets
            </Link>
          </div>
        </div>
      </section>

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
                  {item.stock === 0
                    ? <span className="badge badge--soldout">Esgotado</span>
                    : item.isNew && <span className="badge">Novo</span>}
                  <PieceVisual item={item} size={140} idSuffix="home" />
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
                <div className="cross-sell-title">Em breve: chapinhas para colares</div>
                <div className="cross-sell-desc">A mesma argila polimérica, agora para o teu animal.</div>
              </div>
            </div>
            <Link href="/pets" className="btn btn-outline-sage">
              Saber mais <ArrowRight size={15} className="btn-arrow" />
            </Link>
          </div>
        </section>
      </Reveal>
    </>
  );
}
