"use client";

import React, { useState, useMemo } from "react";
import {
  PawPrint, Sparkles, ShoppingBag, ArrowRight, Heart, Circle, Bone, Check,
  Menu, X, Plus, Truck, Leaf, Gem, Instagram, Mail, Loader2,
} from "lucide-react";

const BRAND = "tactum studio";

const CLAY_DOTS = ["#C1633B", "#8A9A7E", "#E3A9A0", "#E8B04B", "#B08D57", "#4A463D"];

const EARRINGS = [
  { name: "Argola Terra", price: 18, bg: "linear-gradient(160deg,#E9DFCB,#C9B48C)", isNew: true },
  { name: "Gota Sálvia", price: 16, bg: "linear-gradient(160deg,#DCE4D4,#8A9A7E)" },
  { name: "Lua Creme", price: 14, bg: "linear-gradient(160deg,#F2ECDD,#D6C9A8)" },
  { name: "Botão Terracota", price: 12, bg: "linear-gradient(160deg,#E8C3AE,#C1633B)" },
];

const FEATURES = [
  { icon: Gem, title: "Feito à mão", desc: "Cada peça moldada e cozida artesanalmente." },
  { icon: Leaf, title: "Argila natural", desc: "Materiais simples, sem plásticos desnecessários." },
  { icon: Sparkles, title: "Peça única", desc: "Nunca dois brincos exatamente iguais." },
  { icon: Truck, title: "Envio cuidado", desc: "Embalado com cuidado, direto de Portugal." },
];

async function goToCheckout(items, setError) {
  setError("");
  try {
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items }),
    });
    const data = await res.json();
    if (!res.ok || !data.url) {
      throw new Error(data.error || "Não foi possível iniciar o pagamento.");
    }
    window.location.href = data.url;
  } catch (err) {
    setError(err.message || "Não foi possível iniciar o pagamento.");
  }
}

const CLAY_COLORS = [
  { id: "terracota", label: "Terracota", hex: "#C1633B", dark: "#9B4B2B" },
  { id: "salvia", label: "Sálvia", hex: "#8A9A7E", dark: "#6B7A5F" },
  { id: "argila-rosa", label: "Rosa argila", hex: "#E3A9A0", dark: "#C98077" },
  { id: "manteiga", label: "Manteiga", hex: "#E8B04B", dark: "#C88F2E" },
  { id: "creme", label: "Creme", hex: "#EFE7D4", dark: "#D6C9A8" },
  { id: "grafite", label: "Grafite", hex: "#4A463D", dark: "#302D27" },
];

const SHAPES = {
  osso: {
    label: "Osso", icon: Bone,
    path: "M20,35 C10,35 4,43 4,50 C4,57 10,65 20,65 C27,65 32,59 34,54 L66,54 C68,59 73,65 80,65 C90,65 96,57 96,50 C96,43 90,35 80,35 C73,35 68,41 66,46 L34,46 C32,41 27,35 20,35 Z",
    ringX: 50, ringY: 37,
  },
  redonda: {
    label: "Redonda", icon: Circle,
    path: "M50,4 C75.4,4 96,24.6 96,50 C96,75.4 75.4,96 50,96 C24.6,96 4,75.4 4,50 C4,24.6 24.6,4 50,4 Z",
    ringX: 50, ringY: 6,
  },
  coracao: {
    label: "Coração", icon: Heart,
    path: "M50,90 C22,68 6,48 6,29 C6,13 19,3 34,9 C41,12 47,18 50,25 C53,18 59,12 66,9 C81,3 94,13 94,29 C94,48 78,68 50,90 Z",
    ringX: 50, ringY: 8,
  },
};

const SIZES = [
  { id: "p", label: "Pequena", mult: 1, dim: 0.82 },
  { id: "m", label: "Média", mult: 1.25, dim: 1 },
  { id: "g", label: "Grande", mult: 1.55, dim: 1.18 },
];

const FONTS = [
  { id: "serif", label: "Clássica", family: "var(--font-display)" },
  { id: "redonda", label: "Arredondada", family: "'Trebuchet MS', 'Segoe UI', sans-serif" },
];

const BASE_PRICE = 8.5;
const STEPS = [
  { n: "01", t: "Escolhe", d: "Forma, cor de argila e tipo de letra no customizador." },
  { n: "02", t: "Personaliza", d: "Escreve o nome do animal e, se quiseres, um contacto." },
  { n: "03", t: "Recebe em casa", d: "Moldamos e cozemos a peça e enviamos em poucos dias." },
];

const formatPrice = (n) => `${n.toFixed(2)}€`;

export default function TactumStudioSite() {
  const [area, setArea] = useState("brincos");
  const isBrincos = area === "brincos";

  return (
    <div className="site">
      <GlobalStyle />
      <a href="#conteudo" className="skip-link">Saltar para o conteúdo</a>

      <Header area={area} onChangeArea={setArea} />
      <MaterialStrip />

      <main id="conteudo">
        {isBrincos ? <BrincosArea onSeePets={() => setArea("pets")} /> : <PetsArea />}
      </main>

      <Footer />
    </div>
  );
}

function Header({ area, onChangeArea }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const isBrincos = area === "brincos";

  const go = (id) => {
    onChangeArea(id);
    setMenuOpen(false);
  };

  return (
    <header className="site-header">
      <div className="header-inner">
        <div className="brand">
          <span className="brand-dot" aria-hidden="true" />
          <span className="brand-name">{BRAND}</span>
        </div>

        <nav className="nav-desktop" aria-label="Áreas da loja">
          <button
            className="tab-btn"
            aria-current={isBrincos ? "page" : undefined}
            onClick={() => go("brincos")}
          >
            <span style={{ color: isBrincos ? "var(--color-ink)" : "var(--color-faint)" }}>Brincos</span>
            {isBrincos && <span className="tab-underline" style={{ background: "var(--color-gold)" }} />}
          </button>
          <button
            className="tab-btn"
            aria-current={!isBrincos ? "page" : undefined}
            onClick={() => go("pets")}
          >
            <span style={{ color: !isBrincos ? "var(--color-ink)" : "var(--color-faint)" }}>Pets</span>
            {!isBrincos && <span className="tab-underline" style={{ background: "var(--color-terracotta)" }} />}
          </button>
        </nav>

        <div className="header-actions">
          <div className="icon-btn" aria-label="Carrinho de compras, 0 artigos" role="img">
            <ShoppingBag size={18} />
            <span className="cart-count">0</span>
          </div>
          <button
            className="icon-btn nav-toggle"
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((o) => !o)}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="nav-mobile" aria-label="Áreas da loja (menu)">
          <button className={`nav-mobile-link ${isBrincos ? "active" : ""}`} onClick={() => go("brincos")}>
            Brincos
          </button>
          <button className={`nav-mobile-link ${!isBrincos ? "active" : ""}`} onClick={() => go("pets")}>
            Pets
          </button>
        </nav>
      )}
    </header>
  );
}

function MaterialStrip() {
  return (
    <div className="material-strip" aria-hidden="true">
      {CLAY_DOTS.map((c) => <span key={c} className="material-dot" style={{ background: c }} />)}
    </div>
  );
}

function BrincosArea({ onSeePets }) {
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
          <a href="#colecao" className="btn btn-primary">
            Ver coleção <ArrowRight size={15} />
          </a>
          <button onClick={onSeePets} className="btn btn-ghost-dark">
            Ver área Pets
          </button>
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

      <section id="colecao" className="section-narrow">
        <div className="section-head">
          <h2 className="section-title">Mais recentes</h2>
          <span className="section-count">{EARRINGS.length} peças</span>
        </div>
        <div className="grid4">
          {EARRINGS.map((e) => <ProductCard key={e.name} item={e} />)}
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
          <button onClick={onSeePets} className="btn btn-outline-sage">
            Ver área Pets <ArrowRight size={15} />
          </button>
        </div>
      </section>
    </>
  );
}

function ProductCard({ item }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleBuy = async () => {
    setLoading(true);
    await goToCheckout(
      [{ name: item.name, unitAmount: Math.round(item.price * 100), quantity: 1 }],
      setError
    );
    setLoading(false);
  };

  return (
    <article className="product-card">
      <div className="product-image" style={{ background: item.bg }}>
        {item.isNew && <span className="badge">Novo</span>}
        <button className="quick-add" aria-label={`Comprar ${item.name}`} onClick={handleBuy} disabled={loading}>
          {loading ? <Loader2 size={16} className="spin" /> : <Plus size={16} />}
        </button>
      </div>
      <div className="product-name">{item.name}</div>
      <div className="product-price">{formatPrice(item.price)}</div>
      {error && <div className="field-help error">{error}</div>}
    </article>
  );
}

function PetsArea() {
  const [shapeId, setShapeId] = useState("osso");
  const [colorId, setColorId] = useState("terracota");
  const [sizeId, setSizeId] = useState("m");
  const [fontId, setFontId] = useState("serif");
  const [line1, setLine1] = useState("LUNA");
  const [line2, setLine2] = useState("");
  const [qty, setQty] = useState(1);
  const [showNameError, setShowNameError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const shape = SHAPES[shapeId];
  const color = CLAY_COLORS.find((c) => c.id === colorId);
  const size = SIZES.find((s) => s.id === sizeId);
  const font = FONTS.find((f) => f.id === fontId);
  const textColor = ["creme", "manteiga", "argila-rosa"].includes(colorId) ? "#3D3A34" : "#F7F2E7";
  const nameValid = line1.trim().length > 0;

  const unitPrice = useMemo(() => {
    let p = BASE_PRICE * size.mult;
    if (line2.trim().length > 0) p += 1;
    return p;
  }, [size, line2]);

  const price = unitPrice * qty;

  const handleBuy = async () => {
    if (!nameValid) {
      setShowNameError(true);
      return;
    }
    setLoading(true);
    await goToCheckout(
      [
        {
          name: `Chapinha ${shape.label} — ${line1}`,
          description: `Cor: ${color.label} · Tamanho: ${size.label} · Letra: ${font.label}${line2 ? ` · Contacto: ${line2}` : ""}`,
          unitAmount: Math.round(unitPrice * 100),
          quantity: qty,
        },
      ],
      setError
    );
    setLoading(false);
  };

  return (
    <>
      <section className="hero hero-light">
        <div className="hero-badge hero-badge-sage">
          <PawPrint size={14} /> NOVA LINHA
        </div>
        <h1 className="hero-title hero-title-sm">Uma chapinha de argila para o teu companheiro</h1>
        <p className="hero-sub hero-sub-light">
          Personaliza abaixo. Moldamos, gravamos e cozemos cada peça à mão, do mesmo barro dos nossos brincos.
        </p>
      </section>

      <section className="section-medium customizer-section">
          <div className="grid2">
            <div className="preview-panel">
              <div className="preview-card">
                <svg width="0" height="0">
                  <filter id="clayGrain">
                    <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" result="noise" />
                    <feColorMatrix in="noise" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.05 0" result="grain" />
                    <feComposite in="grain" in2="SourceAlpha" operator="in" result="grainClipped" />
                    <feMerge>
                      <feMergeNode in="SourceGraphic" />
                      <feMergeNode in="grainClipped" />
                    </feMerge>
                  </filter>
                </svg>
                <svg viewBox="0 0 100 130" width={200 * size.dim} height={260 * size.dim} className="preview-tag">
                  <line x1="50" y1="0" x2={shape.ringX} y2={shape.ringY + 30} stroke="#B8AF9C" strokeWidth="1.5" />
                  <ellipse cx={shape.ringX} cy={shape.ringY + 30} rx="6" ry="8" fill="none" stroke="#8A8574" strokeWidth="3" />
                  <g transform="translate(0,30)">
                    <path d={shape.path} fill={color.dark} transform="translate(1.5,2.5)" opacity="0.35" />
                    <path d={shape.path} fill={color.hex} filter="url(#clayGrain)" stroke={color.dark} strokeWidth="0.6" />
                    <text x="50" y={line2 ? "48" : "54"} textAnchor="middle" fontFamily={font.family} fontSize="15" fontWeight="700" fill={textColor} letterSpacing="0.5">
                      {line1 || "NOME"}
                    </text>
                    {line2 && (
                      <text x="50" y="63" textAnchor="middle" fontFamily={font.family} fontSize="9" fill={textColor} opacity="0.85">
                        {line2}
                      </text>
                    )}
                  </g>
                </svg>
              </div>
              <p className="preview-hint">
                Pré-visualização — a peça final é feita à mão, pode variar ligeiramente.
              </p>
            </div>

            <div className="controls">
              <CustomSection step="01" title="Forma">
                <div className="option-row">
                  {Object.entries(SHAPES).map(([id, s]) => {
                    const Icon = s.icon;
                    const active = id === shapeId;
                    return (
                      <button key={id} onClick={() => setShapeId(id)} className={`option-btn ${active ? "active" : ""}`}>
                        <Icon size={18} /> <span>{s.label}</span>
                        {active && <Check size={13} className="option-check" />}
                      </button>
                    );
                  })}
                </div>
              </CustomSection>

              <CustomSection step="02" title="Cor da argila">
                <div className="swatch-row">
                  {CLAY_COLORS.map((c) => {
                    const active = c.id === colorId;
                    return (
                      <button
                        key={c.id}
                        onClick={() => setColorId(c.id)}
                        title={c.label}
                        aria-label={c.label}
                        aria-pressed={active}
                        className="swatch"
                        style={{ background: c.hex, outlineColor: active ? "#3D3A34" : "transparent" }}
                      >
                        {active && <Check size={14} color={["creme", "manteiga", "argila-rosa"].includes(c.id) ? "#3D3A34" : "#fff"} />}
                      </button>
                    );
                  })}
                </div>
              </CustomSection>

              <CustomSection step="03" title="Texto">
                <div className="field">
                  <input
                    className={`text-input ${showNameError ? "invalid" : ""}`}
                    maxLength={12}
                    placeholder="Nome do animal (obrigatório)"
                    value={line1}
                    onChange={(e) => { setLine1(e.target.value.toUpperCase()); if (e.target.value.trim()) setShowNameError(false); }}
                    aria-invalid={showNameError}
                    aria-describedby="line1-help"
                  />
                  <div id="line1-help" className={`field-help ${showNameError ? "error" : ""}`}>
                    {showNameError ? "Escreve o nome do animal para continuar." : `${line1.length}/12`}
                  </div>
                </div>
                <div className="field" style={{ marginTop: 10 }}>
                  <input
                    className="text-input"
                    maxLength={20}
                    placeholder="Contacto (opcional, +1€)"
                    value={line2}
                    onChange={(e) => setLine2(e.target.value)}
                  />
                  <div className="field-help">{line2.length}/20</div>
                </div>
              </CustomSection>

              <CustomSection step="04" title="Tipo de letra">
                <div className="option-row">
                  {FONTS.map((f) => (
                    <button key={f.id} onClick={() => setFontId(f.id)} style={{ fontFamily: f.family }} className={`option-btn ${f.id === fontId ? "active" : ""}`}>
                      {f.label}
                      {f.id === fontId && <Check size={13} className="option-check" />}
                    </button>
                  ))}
                </div>
              </CustomSection>

              <CustomSection step="05" title="Tamanho">
                <div className="option-row">
                  {SIZES.map((s) => (
                    <button key={s.id} onClick={() => setSizeId(s.id)} className={`option-btn ${s.id === sizeId ? "active" : ""}`}>
                      {s.label}
                      {s.id === sizeId && <Check size={13} className="option-check" />}
                    </button>
                  ))}
                </div>
              </CustomSection>

              <div className="order-bar">
                <div className="qty-control">
                  <button className="qty-btn" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Diminuir quantidade">−</button>
                  <span className="qty-value">{qty}</span>
                  <button className="qty-btn" onClick={() => setQty((q) => Math.min(9, q + 1))} aria-label="Aumentar quantidade">+</button>
                </div>
                <button onClick={handleBuy} disabled={loading} className="btn btn-primary-sage order-btn">
                  <ShoppingBag size={16} /> {loading ? "A abrir pagamento..." : `Encomendar — ${formatPrice(price)}`}
                </button>
              </div>
              {error && <div className="field-help error">{error}</div>}
            </div>
          </div>
      </section>

      <section className="section-medium steps-section">
        <h2 className="section-title section-title-center">Como funciona</h2>
        <div className="grid3">
          {STEPS.map((step) => (
            <div key={step.n} className="step-card">
              <div className="step-num">{step.n}</div>
              <div className="step-title">{step.t}</div>
              <div className="step-desc">{step.d}</div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

function CustomSection({ step, title, children }) {
  return (
    <div className="control-section">
      <h3 className="control-title"><span className="control-step">{step}</span>{title}</h3>
      {children}
    </div>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <div className="brand" style={{ marginBottom: 10 }}>
            <span className="brand-dot" aria-hidden="true" />
            <span className="brand-name">{BRAND}</span>
          </div>
          <p className="footer-tagline">Brincos & chapinhas de argila, feitos à mão em Portugal.</p>
        </div>
        <div className="footer-contact">
          <a href="https://instagram.com" className="footer-link" target="_blank" rel="noreferrer">
            <Instagram size={16} /> Instagram
          </a>
          <a href="mailto:ola@tactumstudio.pt" className="footer-link">
            <Mail size={16} /> ola@tactumstudio.pt
          </a>
        </div>
      </div>
      <div className="footer-bottom">© {new Date().getFullYear()} {BRAND}. Todos os direitos reservados.</div>
    </footer>
  );
}

function GlobalStyle() {
  return (
    <style>{`
      .site { min-height: 100vh; }

      .skip-link {
        position: absolute; left: 12px; top: -48px; background: var(--color-ink);
        color: var(--color-bg); padding: 10px 16px; border-radius: var(--radius-sm);
        font-size: 13px; font-weight: 700; z-index: 100; transition: top 0.15s ease;
      }
      .skip-link:focus { top: 12px; }

      /* header */
      .site-header {
        position: sticky; top: 0; z-index: 40;
        background: rgba(243,238,226,0.9); backdrop-filter: blur(10px);
        border-bottom: 1px solid var(--color-border);
      }
      .header-inner {
        max-width: var(--max-width); margin: 0 auto;
        display: flex; align-items: center; justify-content: space-between;
        padding: 16px 24px;
      }
      .brand { display: flex; align-items: center; gap: 10px; }
      .brand-dot {
        width: 30px; height: 30px; border-radius: 50%; flex-shrink: 0;
        background: conic-gradient(#C1633B,#8A9A7E,#E3A9A0,#E8B04B,#B08D57,#C1633B);
        box-shadow: var(--shadow-sm);
      }
      .brand-name { font-family: var(--font-display); font-size: 19px; font-weight: 600; }
      .nav-desktop { display: flex; gap: 32px; }
      .tab-btn {
        position: relative; background: none; border: none; cursor: pointer;
        font-size: 13px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase;
        padding: 8px 2px;
      }
      .tab-underline { position: absolute; left: 0; right: 0; bottom: -9px; height: 2px; border-radius: 2px; }
      .header-actions { display: flex; align-items: center; gap: 6px; }
      .icon-btn {
        position: relative; display: inline-flex; align-items: center; justify-content: center;
        width: 38px; height: 38px; border-radius: 50%; border: none; background: none;
        color: var(--color-ink); cursor: pointer;
      }
      .icon-btn:hover { background: var(--color-surface-alt); }
      .cart-count {
        position: absolute; top: 1px; right: 1px; min-width: 15px; height: 15px; padding: 0 3px;
        border-radius: 8px; background: var(--color-terracotta); color: #fff; font-size: 9px;
        font-weight: 700; display: flex; align-items: center; justify-content: center;
      }
      .nav-toggle { display: none; }
      .nav-mobile { display: flex; flex-direction: column; padding: 4px 24px 16px; gap: 2px; }
      .nav-mobile-link {
        text-align: left; background: none; border: none; padding: 12px 10px; border-radius: var(--radius-sm);
        font-size: 15px; font-weight: 600; color: var(--color-muted); cursor: pointer;
      }
      .nav-mobile-link.active { color: var(--color-ink); background: var(--color-surface-alt); }

      /* material strip */
      .material-strip { display: flex; justify-content: center; gap: 8px; padding: 10px 0; background: var(--color-surface-alt); }
      .material-dot { width: 8px; height: 8px; border-radius: 50%; }

      /* buttons */
      .btn {
        display: inline-flex; align-items: center; justify-content: center; gap: 8px;
        border: none; border-radius: var(--radius-md); padding: 13px 24px; font-size: 14px;
        font-weight: 700; cursor: pointer; text-decoration: none; transition: transform 0.15s ease, box-shadow 0.15s ease, opacity 0.15s ease;
      }
      .btn:hover { transform: translateY(-2px); box-shadow: var(--shadow-md); }
      .btn:active { transform: translateY(0); box-shadow: none; }
      .btn-primary { background: var(--color-gold); color: var(--color-charcoal); }
      .btn-primary-sage { background: var(--color-sage); color: var(--color-surface); flex: 1 1 auto; }
      .btn-primary-sage:disabled { opacity: 0.55; cursor: not-allowed; transform: none; box-shadow: none; }
      .btn-ghost-dark { background: rgba(247,242,231,0.08); color: var(--color-surface); border: 1.5px solid rgba(247,242,231,0.35); }
      .btn-ghost-dark:hover { background: rgba(247,242,231,0.14); }
      .btn-outline-sage { background: none; border: 1.5px solid var(--color-sage); color: var(--color-sage); }
      .btn-outline-sage:hover { background: var(--color-sage-tint); }

      /* hero */
      .hero { padding: 84px 24px 76px; text-align: center; }
      .hero-dark {
        background:
          radial-gradient(60% 90% at 50% -10%, rgba(176,141,87,0.18), transparent),
          var(--color-charcoal);
        color: var(--color-surface);
      }
      .hero-light { background: var(--color-surface); padding: 60px 24px 32px; }
      .hero-badge {
        display: inline-flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 700;
        letter-spacing: 0.14em; color: var(--color-gold); margin-bottom: 18px;
      }
      .hero-badge-sage { color: var(--color-sage); }
      .hero-title {
        font-family: var(--font-display); font-size: 48px; font-weight: 600; max-width: 640px;
        margin: 0 auto 18px; line-height: 1.12;
      }
      .hero-title-sm { font-size: 34px; max-width: 560px; margin-bottom: 12px; }
      .hero-sub { max-width: 420px; margin: 0 auto 32px; color: #C9C0AE; font-size: 16px; line-height: 1.65; }
      .hero-sub-light { color: var(--color-muted); font-size: 15px; max-width: 460px; margin-bottom: 0; }
      .hero-actions { display: flex; align-items: center; justify-content: center; gap: 12px; flex-wrap: wrap; }

      /* features */
      .features-grid {
        max-width: var(--max-width); margin: 0 auto; padding: 40px 24px;
        display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px;
      }
      .feature-item { display: flex; align-items: flex-start; gap: 12px; }
      .feature-icon {
        width: 36px; height: 36px; border-radius: 10px; background: var(--color-surface-alt);
        color: var(--color-sage); display: flex; align-items: center; justify-content: center; flex-shrink: 0;
      }
      .feature-title { font-size: 13px; font-weight: 700; margin-bottom: 2px; }
      .feature-desc { font-size: 12.5px; color: var(--color-muted); line-height: 1.5; }

      /* sections */
      .section-narrow { padding: 24px 24px 64px; max-width: var(--max-width); margin: 0 auto; }
      .section-medium { padding: 24px 24px 64px; max-width: 960px; margin: 0 auto; }
      .section-head { display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 24px; }
      .section-title { font-family: var(--font-display); font-size: 24px; font-weight: 600; margin: 0; }
      .section-title-center { text-align: center; margin-bottom: 28px; }
      .section-count { font-size: 13px; color: var(--color-faint); }

      .grid4 { display: grid; grid-template-columns: repeat(4,1fr); gap: 20px; }
      .grid3 { display: grid; grid-template-columns: repeat(3,1fr); gap: 18px; }
      .grid2 { display: grid; grid-template-columns: minmax(240px,360px) 1fr; gap: 44px; align-items: start; }

      /* product card */
      .product-card { cursor: pointer; }
      .product-image {
        position: relative; border-radius: var(--radius-lg); aspect-ratio: 1; margin-bottom: 12px;
        overflow: hidden; transition: transform 0.25s ease, box-shadow 0.25s ease;
      }
      .product-card:hover .product-image { transform: translateY(-4px); box-shadow: var(--shadow-lg); }
      .badge {
        position: absolute; top: 10px; left: 10px; background: var(--color-charcoal); color: var(--color-surface);
        font-size: 10px; font-weight: 700; letter-spacing: 0.04em; padding: 4px 9px; border-radius: 999px;
      }
      .quick-add {
        position: absolute; bottom: 10px; right: 10px; width: 34px; height: 34px; border-radius: 50%;
        background: var(--color-surface); border: none; color: var(--color-ink); cursor: pointer;
        display: flex; align-items: center; justify-content: center; box-shadow: var(--shadow-sm);
        opacity: 0; transform: translateY(6px); transition: opacity 0.2s ease, transform 0.2s ease;
      }
      .product-card:hover .quick-add, .quick-add:focus-visible, .quick-add:disabled { opacity: 1; transform: translateY(0); }
      .quick-add:disabled { cursor: default; }
      .product-name { font-size: 13.5px; font-weight: 700; }
      .product-price { font-size: 13px; color: var(--color-muted); margin-top: 2px; }
      .spin { animation: spin 0.8s linear infinite; }
      @keyframes spin { to { transform: rotate(360deg); } }

      /* cross-sell */
      .cross-sell { background: var(--color-sage-tint); padding: 44px 24px; }
      .cross-sell-inner {
        max-width: var(--max-width); margin: 0 auto; display: flex; align-items: center;
        justify-content: space-between; gap: 24px; flex-wrap: wrap;
      }
      .cross-sell-info { display: flex; align-items: center; gap: 16px; }
      .cross-sell-icon {
        width: 44px; height: 44px; border-radius: 50%; background: var(--color-surface);
        color: var(--color-sage); display: flex; align-items: center; justify-content: center; flex-shrink: 0;
      }
      .cross-sell-title { font-weight: 700; font-size: 15px; }
      .cross-sell-desc { font-size: 13px; color: var(--color-muted); margin-top: 2px; }

      /* customizer */
      .preview-panel { display: flex; flex-direction: column; align-items: center; position: sticky; top: 88px; align-self: start; }
      .preview-card {
        background: var(--color-surface); border-radius: var(--radius-xl); padding: 36px 18px;
        display: flex; justify-content: center; box-shadow: var(--shadow-md); width: 100%;
      }
      .preview-tag { transition: transform 0.4s ease; transform-origin: 50px 8px; }
      .preview-hang:hover .preview-tag { transform: rotate(3deg); }
      .preview-hint { font-size: 12px; color: var(--color-faint); margin-top: 14px; text-align: center; max-width: 260px; }

      .controls { display: flex; flex-direction: column; gap: 22px; }
      .control-section {}
      .control-title {
        display: flex; align-items: center; gap: 8px; font-size: 12px; letter-spacing: 0.06em;
        text-transform: uppercase; color: var(--color-muted); font-weight: 700; margin: 0 0 12px;
      }
      .control-step {
        width: 18px; height: 18px; border-radius: 5px; background: var(--color-surface-alt);
        color: var(--color-faint); display: inline-flex; align-items: center; justify-content: center;
        font-size: 9px; letter-spacing: 0;
      }
      .option-row { display: flex; gap: 8px; flex-wrap: wrap; }
      .option-btn {
        position: relative; display: flex; align-items: center; gap: 6px; padding: 9px 16px 9px 14px;
        border-radius: var(--radius-md); border: 1.5px solid var(--color-border); background: var(--color-surface);
        font-size: 13px; color: var(--color-ink-soft); cursor: pointer; transition: border-color 0.15s ease, background 0.15s ease;
      }
      .option-btn:hover { border-color: var(--color-sage); }
      .option-btn.active { border-color: var(--color-sage); background: var(--color-sage-tint); color: #3D3A34; font-weight: 700; }
      .option-check { color: var(--color-sage); }

      .swatch-row { display: flex; gap: 10px; flex-wrap: wrap; }
      .swatch {
        width: 34px; height: 34px; border-radius: 50%; border: none; cursor: pointer;
        display: flex; align-items: center; justify-content: center; transition: transform 0.15s ease;
        outline: 2px solid transparent; outline-offset: 2px;
      }
      .swatch:hover { transform: translateY(-2px); }

      .field { display: flex; flex-direction: column; }
      .text-input {
        width: 100%; box-sizing: border-box; padding: 11px 14px; border-radius: var(--radius-md);
        border: 1.5px solid var(--color-border); background: var(--color-surface); font-size: 14px;
        color: var(--color-ink-soft); outline: none; transition: border-color 0.15s ease;
      }
      .text-input:focus { border-color: var(--color-sage); }
      .text-input.invalid { border-color: var(--color-terracotta); }
      .field-help { font-size: 11.5px; color: var(--color-faint); margin-top: 5px; text-align: right; }
      .field-help.error { color: var(--color-terracotta); text-align: left; font-weight: 600; }

      .order-bar {
        display: flex; align-items: center; justify-content: space-between; gap: 16px;
        margin-top: 4px; padding-top: 20px; border-top: 1px solid var(--color-border); flex-wrap: wrap;
      }
      .qty-control {
        display: flex; align-items: center; gap: 12px; border: 1.5px solid var(--color-border);
        border-radius: var(--radius-md); padding: 4px 6px;
      }
      .qty-btn { border: none; background: none; font-size: 18px; width: 28px; height: 28px; cursor: pointer; color: var(--color-sage); border-radius: 6px; }
      .qty-btn:hover { background: var(--color-sage-tint); }
      .qty-value { min-width: 16px; text-align: center; font-weight: 700; }
      .order-btn { display: flex; align-items: center; gap: 8px; border-radius: var(--radius-md); padding: 14px 22px; font-size: 14px; justify-content: center; }

      /* success */
      .success-card {
        max-width: 440px; margin: 40px auto; background: var(--color-surface); border-radius: var(--radius-xl);
        padding: 44px 32px; text-align: center; box-shadow: var(--shadow-md);
      }
      .success-icon {
        width: 56px; height: 56px; border-radius: 50%; background: var(--color-sage);
        display: flex; align-items: center; justify-content: center; margin: 0 auto 18px;
      }
      .success-title { font-family: var(--font-display); font-size: 22px; margin: 0 0 10px; }
      .success-text { font-size: 14px; color: var(--color-muted); line-height: 1.6; margin: 0 0 24px; }

      /* steps */
      .step-card { background: var(--color-surface); border-radius: var(--radius-lg); padding: 24px; box-shadow: var(--shadow-sm); }
      .step-num { font-family: var(--font-display); font-size: 22px; color: var(--color-terracotta); margin-bottom: 8px; }
      .step-title { font-weight: 700; font-size: 14px; margin-bottom: 6px; }
      .step-desc { font-size: 13px; color: var(--color-muted); line-height: 1.55; }

      /* footer */
      .site-footer { border-top: 1px solid var(--color-border); margin-top: 20px; }
      .footer-inner {
        max-width: var(--max-width); margin: 0 auto; padding: 40px 24px 20px;
        display: flex; justify-content: space-between; gap: 32px; flex-wrap: wrap;
      }
      .footer-tagline { font-size: 13px; color: var(--color-muted); margin: 0; max-width: 280px; }
      .footer-contact { display: flex; flex-direction: column; gap: 10px; }
      .footer-link { display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--color-ink-soft); text-decoration: none; }
      .footer-link:hover { color: var(--color-sage); }
      .footer-bottom { text-align: center; font-size: 11.5px; color: var(--color-faint); padding: 16px 24px 28px; }

      @media (max-width: 900px) {
        .grid2 { grid-template-columns: 1fr; }
        .preview-panel { position: static; }
      }
      @media (max-width: 760px) {
        .grid4 { grid-template-columns: repeat(2,1fr); }
        .grid3 { grid-template-columns: 1fr; }
        .features-grid { grid-template-columns: repeat(2,1fr); }
        .hero-title { font-size: 32px !important; }
        .hero { padding: 64px 20px 56px; }
      }
      @media (max-width: 720px) {
        .nav-desktop { display: none; }
        .nav-toggle { display: inline-flex; }
      }
      @media (max-width: 480px) {
        .features-grid { grid-template-columns: 1fr; }
        .header-inner { padding: 14px 18px; }
      }
    `}</style>
  );
}
