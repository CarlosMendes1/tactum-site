"use client";

import React, { useState, useMemo } from "react";
import {
  PawPrint, Sparkles, ShoppingBag, ArrowRight, Heart, Circle, Bone, Check,
} from "lucide-react";

const BRAND = "tactum studio";

const CLAY_DOTS = ["#C1633B", "#8A9A7E", "#E3A9A0", "#E8B04B", "#B08D57", "#4A463D"];

const EARRINGS = [
  { name: "Argola Terra", price: "18€", bg: "linear-gradient(160deg,#E9DFCB,#C9B48C)" },
  { name: "Gota Sálvia", price: "16€", bg: "linear-gradient(160deg,#DCE4D4,#8A9A7E)" },
  { name: "Lua Creme", price: "14€", bg: "linear-gradient(160deg,#F2ECDD,#D6C9A8)" },
  { name: "Botão Terracota", price: "12€", bg: "linear-gradient(160deg,#E8C3AE,#C1633B)" },
];

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
  { id: "serif", label: "Clássica", family: "Georgia, 'Iowan Old Style', serif" },
  { id: "redonda", label: "Arredondada", family: "'Trebuchet MS', 'Segoe UI', sans-serif" },
];

const BASE_PRICE = 8.5;

export default function TactumStudioSite() {
  const [area, setArea] = useState("brincos");
  const isBrincos = area === "brincos";

  return (
    <div style={{ fontFamily: "'Trebuchet MS','Segoe UI',sans-serif", background: "#F3EEE2", minHeight: "100vh", color: "#2E2B26" }}>
      <style>{`
        .grid4 { display:grid; grid-template-columns: repeat(4,1fr); gap:18px; }
        .grid3 { display:grid; grid-template-columns: repeat(3,1fr); gap:18px; }
        .grid2 { display:grid; grid-template-columns: minmax(220px,340px) 1fr; gap:36px; }
        @media (max-width: 760px) {
          .grid4 { grid-template-columns: repeat(2,1fr); }
          .grid3 { grid-template-columns: 1fr; }
          .grid2 { grid-template-columns: 1fr; }
          .hero-title { font-size: 32px !important; }
        }
        .tab-btn { position:relative; background:none; border:none; cursor:pointer; font-size:14px; font-weight:700; letter-spacing:0.04em; padding:8px 4px; }
        .card:hover { transform: translateY(-3px); }
        .shape-btn:hover, .size-btn:hover, .font-btn:hover { border-color:#5C6B4A; }
        .swatch:hover { transform: translateY(-2px); }
        .preview-hang:hover .preview-tag { transform: rotate(3deg); }
      `}</style>

      {/* NAV */}
      <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 32px", borderBottom: "1px solid #DCD3BF" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: "50%", background: "conic-gradient(#C1633B,#8A9A7E,#E3A9A0,#E8B04B,#B08D57,#C1633B)" }} />
          <span style={{ fontFamily: "Georgia,serif", fontSize: 18, fontWeight: 700 }}>{BRAND}</span>
        </div>

        <nav style={{ display: "flex", gap: 28 }}>
          <button className="tab-btn" onClick={() => setArea("brincos")}>
            <span style={{ color: isBrincos ? "#2E2B26" : "#A79E8A" }}>BRINCOS</span>
            {isBrincos && <div style={{ position: "absolute", left: 0, right: 0, bottom: -9, height: 2, background: "#B08D57" }} />}
          </button>
          <button className="tab-btn" onClick={() => setArea("pets")}>
            <span style={{ color: !isBrincos ? "#2E2B26" : "#A79E8A" }}>PETS</span>
            {!isBrincos && <div style={{ position: "absolute", left: 0, right: 0, bottom: -9, height: 2, background: "#C1633B" }} />}
          </button>
        </nav>

        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 700 }}>
          <ShoppingBag size={16} /> 0
        </div>
      </header>

      {/* material strip */}
      <div style={{ display: "flex", justifyContent: "center", gap: 8, padding: "10px 0", background: "#EDE7D6" }}>
        {CLAY_DOTS.map((c) => <div key={c} style={{ width: 8, height: 8, borderRadius: "50%", background: c }} />)}
      </div>

      {isBrincos ? <BrincosArea onSeePets={() => setArea("pets")} /> : <PetsArea />}

      <footer style={{ padding: "26px 32px", textAlign: "center", fontSize: 12, color: "#A79E8A", borderTop: "1px solid #DCD3BF" }}>
        {BRAND} — brincos & chapinhas de argila, feitos à mão em Portugal
      </footer>
    </div>
  );
}

function BrincosArea({ onSeePets }) {
  return (
    <>
      <section style={{ background: "#262220", color: "#F3EEE2", padding: "80px 32px 90px", textAlign: "center" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, letterSpacing: "0.14em", color: "#B08D57", marginBottom: 18 }}>
          <Sparkles size={14} /> COLEÇÃO ATUAL
        </div>
        <h1 className="hero-title" style={{ fontFamily: "Georgia,serif", fontSize: 46, maxWidth: 620, margin: "0 auto 16px", lineHeight: 1.15 }}>
          Peças de argila moldadas à mão, uma a uma
        </h1>
        <p style={{ maxWidth: 420, margin: "0 auto 30px", color: "#C9C0AE", fontSize: 15, lineHeight: 1.6 }}>
          Cada par de brincos nasce do barro e do forno — nunca dois exatamente iguais.
        </p>
        <button style={{ background: "#B08D57", color: "#262220", border: "none", padding: "13px 26px", borderRadius: 10, fontWeight: 700, fontSize: 14, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8 }}>
          Ver coleção <ArrowRight size={15} />
        </button>
      </section>

      <section style={{ padding: "56px 32px", maxWidth: 1000, margin: "0 auto" }}>
        <h2 style={{ fontFamily: "Georgia,serif", fontSize: 22, marginBottom: 24 }}>Mais recentes</h2>
        <div className="grid4">
          {EARRINGS.map((e) => (
            <div key={e.name} className="card" style={{ transition: "transform 0.2s" }}>
              <div style={{ background: e.bg, borderRadius: 14, aspectRatio: "1", marginBottom: 10 }} />
              <div style={{ fontSize: 13, fontWeight: 700 }}>{e.name}</div>
              <div style={{ fontSize: 13, color: "#8A8574" }}>{e.price}</div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ background: "#EDEEE0", padding: "48px 32px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <PawPrint size={22} color="#5C6B4A" />
            <div>
              <div style={{ fontWeight: 700, fontSize: 15 }}>Também fazemos chapinhas para colares</div>
              <div style={{ fontSize: 13, color: "#6B675C" }}>Mesmo barro, agora para o teu animal.</div>
            </div>
          </div>
          <button onClick={onSeePets} style={{ background: "none", border: "1.5px solid #5C6B4A", color: "#5C6B4A", padding: "9px 18px", borderRadius: 10, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
            Ver área Pets
          </button>
        </div>
      </section>
    </>
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
  const [submitted, setSubmitted] = useState(false);

  const shape = SHAPES[shapeId];
  const color = CLAY_COLORS.find((c) => c.id === colorId);
  const size = SIZES.find((s) => s.id === sizeId);
  const font = FONTS.find((f) => f.id === fontId);
  const textColor = ["creme", "manteiga", "argila-rosa"].includes(colorId) ? "#3D3A34" : "#F7F2E7";

  const price = useMemo(() => {
    let p = BASE_PRICE * size.mult;
    if (line2.trim().length > 0) p += 1;
    return (p * qty).toFixed(2);
  }, [size, line2, qty]);

  return (
    <>
      <section style={{ background: "#F7F2E7", padding: "56px 32px 30px", textAlign: "center" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, letterSpacing: "0.14em", color: "#5C6B4A", marginBottom: 14, fontWeight: 700 }}>
          <PawPrint size={14} /> NOVA LINHA
        </div>
        <h1 className="hero-title" style={{ fontFamily: "Georgia,serif", fontSize: 34, lineHeight: 1.15, margin: "0 auto 10px", maxWidth: 560 }}>
          Uma chapinha de argila para o teu companheiro
        </h1>
        <p style={{ fontSize: 14, color: "#6B675C", lineHeight: 1.6, maxWidth: 440, margin: "0 auto" }}>
          Personaliza abaixo. Moldamos, gravamos e cozemos cada peça à mão, do mesmo barro dos nossos brincos.
        </p>
      </section>

      {/* CUSTOMIZER */}
      <section style={{ padding: "20px 32px 60px", maxWidth: 900, margin: "0 auto" }}>
        {submitted ? (
          <div style={{ maxWidth: 420, margin: "40px auto", background: "#F7F2E7", borderRadius: 20, padding: "40px 32px", textAlign: "center", boxShadow: "inset 0 0 0 1px #DFD6C1" }}>
            <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#5C6B4A", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px" }}>
              <Check size={28} color="#EFE7D4" strokeWidth={3} />
            </div>
            <h2 style={{ fontFamily: "Georgia,serif", fontSize: 22, margin: "0 0 10px" }}>Pedido enviado</h2>
            <p style={{ fontSize: 14, color: "#6B675C", lineHeight: 1.5, margin: "0 0 22px" }}>
              Recebemos o teu pedido de {qty}× chapinha "{line1 || "—"}". Vamos confirmar contigo por Instagram antes do envio.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              style={{ border: "1.5px solid #5C6B4A", background: "none", color: "#5C6B4A", borderRadius: 10, padding: "10px 18px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}
            >
              Fazer outro pedido
            </button>
          </div>
        ) : (
          <div className="grid2">
            {/* preview */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", position: "sticky", top: 24, alignSelf: "start" }}>
              <div className="preview-hang" style={{ background: "#F7F2E7", borderRadius: 20, padding: "32px 18px", display: "flex", justifyContent: "center", boxShadow: "inset 0 0 0 1px #DFD6C1", width: "100%" }}>
                <svg width="0" height="0">
                  <filter id="clayGrain">
                    <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" result="noise" />
                    <feColorMatrix in="noise" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.05 0" />
                    <feComposite operator="over" in2="SourceGraphic" />
                  </filter>
                </svg>
                <svg viewBox="0 0 100 130" width={200 * size.dim} height={260 * size.dim} className="preview-tag" style={{ transition: "transform 0.4s ease", transformOrigin: "50px 8px" }}>
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
              <p style={{ fontSize: 12, color: "#8A8574", marginTop: 12, textAlign: "center", maxWidth: 260 }}>
                Pré-visualização — a peça final é feita à mão, pode variar ligeiramente.
              </p>
            </div>

            {/* controls */}
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <CustomSection title="Forma">
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {Object.entries(SHAPES).map(([id, s]) => {
                    const Icon = s.icon;
                    const active = id === shapeId;
                    return (
                      <button key={id} className="shape-btn" onClick={() => setShapeId(id)} style={{ ...optionBtn, ...(active ? optionBtnActive : {}) }}>
                        <Icon size={18} color={active ? "#5C6B4A" : "#6B675C"} /> <span>{s.label}</span>
                      </button>
                    );
                  })}
                </div>
              </CustomSection>

              <CustomSection title="Cor da argila">
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  {CLAY_COLORS.map((c) => (
                    <button key={c.id} className="swatch" onClick={() => setColorId(c.id)} title={c.label}
                      style={{ width: 32, height: 32, borderRadius: "50%", border: "none", cursor: "pointer", transition: "transform 0.15s", background: c.hex, outline: c.id === colorId ? "2px solid #3D3A34" : "2px solid transparent", outlineOffset: "2px" }} />
                  ))}
                </div>
              </CustomSection>

              <CustomSection title="Texto">
                <input style={inputStyle} maxLength={12} placeholder="Nome do animal (máx. 12)" value={line1} onChange={(e) => setLine1(e.target.value.toUpperCase())} />
                <input style={{ ...inputStyle, marginTop: 8 }} maxLength={20} placeholder="Contacto (opcional, +1€)" value={line2} onChange={(e) => setLine2(e.target.value)} />
              </CustomSection>

              <CustomSection title="Tipo de letra">
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {FONTS.map((f) => (
                    <button key={f.id} className="font-btn" onClick={() => setFontId(f.id)} style={{ ...optionBtn, fontFamily: f.family, ...(f.id === fontId ? optionBtnActive : {}) }}>
                      {f.label}
                    </button>
                  ))}
                </div>
              </CustomSection>

              <CustomSection title="Tamanho">
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {SIZES.map((s) => (
                    <button key={s.id} className="size-btn" onClick={() => setSizeId(s.id)} style={{ ...optionBtn, ...(s.id === sizeId ? optionBtnActive : {}) }}>
                      {s.label}
                    </button>
                  ))}
                </div>
              </CustomSection>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, marginTop: 6, paddingTop: 16, borderTop: "1px solid #DFD6C1", flexWrap: "wrap" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, border: "1.5px solid #DFD6C1", borderRadius: 10, padding: "4px 6px" }}>
                  <button style={qtyBtn} onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
                  <span style={{ minWidth: 16, textAlign: "center", fontWeight: 700 }}>{qty}</span>
                  <button style={qtyBtn} onClick={() => setQty((q) => Math.min(9, q + 1))}>+</button>
                </div>
                <button
                  onClick={() => setSubmitted(true)}
                  style={{ display: "flex", alignItems: "center", gap: 8, background: "#5C6B4A", color: "#F7F2E7", border: "none", borderRadius: 12, padding: "13px 22px", fontSize: 14, fontWeight: 700, cursor: "pointer", flex: "1 1 auto", justifyContent: "center" }}
                >
                  <ShoppingBag size={16} /> Encomendar — {price}€
                </button>
              </div>
            </div>
          </div>
        )}
      </section>

      <section style={{ padding: "10px 32px 60px", maxWidth: 900, margin: "0 auto" }}>
        <h2 style={{ fontFamily: "Georgia,serif", fontSize: 20, marginBottom: 22, textAlign: "center" }}>Como funciona</h2>
        <div className="grid3">
          {[
            { n: "01", t: "Escolhe", d: "Forma, cor de argila e tipo de letra no customizador." },
            { n: "02", t: "Personaliza", d: "Escreve o nome do animal e, se quiseres, um contacto." },
            { n: "03", t: "Recebe em casa", d: "Moldamos e cozemos a peça e enviamos em poucos dias." },
          ].map((step) => (
            <div key={step.n} style={{ background: "#F7F2E7", borderRadius: 14, padding: 22 }}>
              <div style={{ fontFamily: "Georgia,serif", fontSize: 22, color: "#C1633B", marginBottom: 8 }}>{step.n}</div>
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 6 }}>{step.t}</div>
              <div style={{ fontSize: 13, color: "#6B675C", lineHeight: 1.5 }}>{step.d}</div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

function CustomSection({ title, children }) {
  return (
    <div>
      <h3 style={{ fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase", color: "#8A8574", fontWeight: 700, margin: "0 0 10px" }}>{title}</h3>
      {children}
    </div>
  );
}

const optionBtn = {
  display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 10,
  border: "1.5px solid #DFD6C1", background: "#F7F2E7", fontSize: 13, color: "#4A463D",
  cursor: "pointer", transition: "border-color 0.2s",
};
const optionBtnActive = { borderColor: "#5C6B4A", background: "#EAEEE3", color: "#3D3A34", fontWeight: 700 };
const inputStyle = {
  width: "100%", boxSizing: "border-box", padding: "10px 12px", borderRadius: 10,
  border: "1.5px solid #DFD6C1", background: "#F7F2E7", fontSize: 14, color: "#3D3A34", outline: "none",
};
const qtyBtn = { border: "none", background: "none", fontSize: 18, width: 28, height: 28, cursor: "pointer", color: "#5C6B4A" };
