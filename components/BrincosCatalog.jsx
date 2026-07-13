"use client";

import { useEffect, useMemo, useState } from "react";
import { Sparkles, ShoppingBag, X, Check, Loader2 } from "lucide-react";
import { EARRINGS, CLAY_TONES, formatPrice } from "../lib/products";
import { goToCheckout } from "../lib/checkout";
import EarringVisual from "./EarringVisual";

const SORTS = [
  { id: "novidades", label: "Novidades" },
  { id: "preco-asc", label: "Preço: mais baixo" },
  { id: "preco-desc", label: "Preço: mais alto" },
];

const USED_TONES = [...new Set(EARRINGS.map((e) => e.tone))];

export default function BrincosCatalog() {
  const [tone, setTone] = useState("todos");
  const [sort, setSort] = useState("novidades");
  const [selected, setSelected] = useState(null);

  const items = useMemo(() => {
    let list = tone === "todos" ? [...EARRINGS] : EARRINGS.filter((e) => e.tone === tone);
    if (sort === "preco-asc") list.sort((a, b) => a.price - b.price);
    if (sort === "preco-desc") list.sort((a, b) => b.price - a.price);
    if (sort === "novidades") list.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    return list;
  }, [tone, sort]);

  return (
    <>
      <section className="page-head">
        <div className="page-head-eyebrow">
          <Sparkles size={13} /> CATÁLOGO
        </div>
        <h1 className="page-head-title">Brincos de <span className="head-accent">argila</span></h1>
        <p className="page-head-sub">
          Cada peça é moldada, cozida e montada à mão no nosso estúdio. Pequenas variações fazem parte — é isso que a torna tua.
        </p>
      </section>

      <div className="catalog-toolbar">
        <div className="chip-row" role="group" aria-label="Filtrar por tom de argila">
          <button className={`chip ${tone === "todos" ? "active" : ""}`} aria-pressed={tone === "todos"} onClick={() => setTone("todos")}>
            Todos
          </button>
          {USED_TONES.map((t) => (
            <button
              key={t}
              className={`chip ${tone === t ? "active" : ""}`}
              aria-pressed={tone === t}
              onClick={() => setTone(t)}
            >
              <span className="chip-dot" style={{ background: CLAY_TONES[t].hex }} />
              {CLAY_TONES[t].label}
            </button>
          ))}
        </div>
        <select className="sort-select" value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Ordenar peças">
          {SORTS.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
        </select>
      </div>

      <div className="catalog-grid">
        {items.length === 0 ? (
          <div className="empty-state">
            <h2 className="empty-state-title">Nada neste tom, por agora</h2>
            <p className="empty-state-text">Estamos sempre a tirar peças novas do forno. Entretanto, vê o catálogo completo.</p>
            <button className="btn btn-outline-sage" onClick={() => setTone("todos")}>Ver todas as peças</button>
          </div>
        ) : (
          items.map((item, i) => (
            <CatalogCard
              key={item.id}
              item={item}
              featured={i === 0 && tone === "todos"}
              onOpen={() => setSelected(item)}
            />
          ))
        )}
      </div>

      {selected && <QuickView item={selected} onClose={() => setSelected(null)} />}
    </>
  );
}

function CatalogCard({ item, featured, onOpen }) {
  const toneData = CLAY_TONES[item.tone];
  return (
    <article className={`cat-card ${featured ? "cat-card--featured" : ""}`}>
      <button className="cat-visual" style={{ background: toneData.tile }} onClick={onOpen}>
        {item.isNew && <span className="badge">Novo</span>}
        <EarringVisual product={item} size={featured ? 240 : 150} />
        <span className="cat-hint" aria-hidden="true">Ver peça</span>
      </button>
      <div className="cat-info">
        <div>
          <div className="product-name">{item.name}</div>
          <div className="product-tone">{toneData.label}</div>
        </div>
        <div className="product-price">{formatPrice(item.price)}</div>
      </div>
      {featured && <p className="cat-desc">{item.desc}</p>}
    </article>
  );
}

function QuickView({ item, onClose }) {
  const toneData = CLAY_TONES[item.tone];
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const handleBuy = async () => {
    setLoading(true);
    await goToCheckout(
      [{
        name: item.name,
        description: `Brincos de argila (par) — tom ${toneData.label}, feitos à mão`,
        unitAmount: Math.round(item.price * 100),
        quantity: qty,
      }],
      setError
    );
    setLoading(false);
  };

  return (
    <div className="qv-overlay" onClick={onClose}>
      <div className="qv" role="dialog" aria-modal="true" aria-labelledby="qv-title" onClick={(e) => e.stopPropagation()}>
        <button className="qv-close" aria-label="Fechar" onClick={onClose} autoFocus>
          <X size={18} />
        </button>
        <div className="qv-media" style={{ background: toneData.tile }}>
          <EarringVisual product={item} size={220} idSuffix="qv" />
        </div>
        <div className="qv-body">
          <div className="qv-eyebrow">{toneData.label}{item.isNew ? " · Novo" : ""}</div>
          <h2 className="qv-title" id="qv-title">{item.name}</h2>
          <div className="qv-price">{formatPrice(item.price)} <span style={{ fontWeight: 400, fontSize: 13, color: "var(--color-faint)" }}>/ par</span></div>
          <p className="qv-desc">{item.desc}</p>
          <ul className="qv-meta">
            <li><Check size={14} /> Argila cozida e selada, muito leve</li>
            <li><Check size={14} /> Ganchos em aço inoxidável hipoalergénico</li>
            <li><Check size={14} /> Feito à mão em Portugal — peça única</li>
          </ul>
          <div className="qv-actions">
            <div className="qty-control">
              <button className="qty-btn" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Diminuir quantidade">−</button>
              <span className="qty-value">{qty}</span>
              <button className="qty-btn" onClick={() => setQty((q) => Math.min(9, q + 1))} aria-label="Aumentar quantidade">+</button>
            </div>
            <button className="btn btn-primary-sage order-btn" onClick={handleBuy} disabled={loading}>
              {loading ? <Loader2 size={16} className="spin" /> : <ShoppingBag size={16} />}
              {loading ? "A abrir pagamento..." : `Comprar — ${formatPrice(item.price * qty)}`}
            </button>
          </div>
          {error && <div className="field-help error" role="status">{error}</div>}
          <p className="qv-note">Envio em 3–5 dias úteis. Pagamento seguro via Stripe.</p>
        </div>
      </div>
    </div>
  );
}
