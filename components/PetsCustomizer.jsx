"use client";

import { useMemo, useState } from "react";
import { PawPrint, ShoppingBag, Heart, Circle, Bone, Check } from "lucide-react";
import { goToCheckout } from "../lib/checkout";

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
    path: "M20,33 C9,33 3,41 3,50 C3,59 9,67 20,67 C26,67 31,63 34,59 L66,59 C69,63 74,67 80,67 C91,67 97,59 97,50 C97,41 91,33 80,33 C74,33 69,37 66,41 L34,41 C31,37 26,33 20,33 Z",
    ringX: 50, ringY: 33,
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

// Posição/tamanho do texto gravado, por forma (viewBox 100×100 da peça).
// O osso é baixo — a barra central só tem espaço entre y≈41 e y≈59; o coração
// estreita em baixo. `maxW` limita a largura para o auto-ajuste do corpo de letra.
const TEXT_LAYOUT = {
  osso: {
    name: { y: 54, yWith2: 50.5, size: 13, sizeWith2: 10.5, maxW: 80 },
    contact: { y: 58.5, size: 6.5, maxW: 66 },
  },
  redonda: {
    name: { y: 54, yWith2: 49, size: 15, sizeWith2: 14, maxW: 72 },
    contact: { y: 63, size: 8.5, maxW: 60 },
  },
  coracao: {
    name: { y: 50, yWith2: 46, size: 14, sizeWith2: 13, maxW: 58 },
    contact: { y: 59, size: 7.5, maxW: 36 },
  },
};

// Encolhe o corpo de letra para o texto caber na largura útil da forma
const fitSize = (base, maxW, len, widthFactor) =>
  len > 0 ? Math.min(base, maxW / (widthFactor * len)) : base;

const STEPS = [
  { n: "01", t: "Escolhe", d: "Forma, cor de argila e tipo de letra no customizador." },
  { n: "02", t: "Personaliza", d: "Escreve o nome do animal e, se quiseres, um contacto." },
  { n: "03", t: "Recebe em casa", d: "Moldamos e cozemos a peça e enviamos em poucos dias." },
];

const formatPrice = (n) =>
  new Intl.NumberFormat("pt-PT", { style: "currency", currency: "EUR" }).format(n);

export default function PetsCustomizer() {
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

  const layout = TEXT_LAYOUT[shapeId];
  const hasContact = line2.trim().length > 0;
  const displayName = line1 || "NOME";
  const nameFontSize = fitSize(
    hasContact ? layout.name.sizeWith2 : layout.name.size,
    layout.name.maxW,
    displayName.length,
    0.68
  );
  const contactFontSize = fitSize(layout.contact.size, layout.contact.maxW, line2.length, 0.6);

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
                    <text x="50" y={hasContact ? layout.name.yWith2 : layout.name.y} textAnchor="middle" fontFamily={font.family} fontSize={nameFontSize} fontWeight="700" fill={textColor} letterSpacing="0.5">
                      {displayName}
                    </text>
                    {hasContact && (
                      <text x="50" y={layout.contact.y} textAnchor="middle" fontFamily={font.family} fontSize={contactFontSize} fill={textColor} opacity="0.85">
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
              {error && <div className="field-help error" role="status">{error}</div>}
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
