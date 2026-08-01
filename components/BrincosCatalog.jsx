"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ShoppingBag, X, Check, ArrowRight, ArrowUpRight, Plus } from "lucide-react";
import { EARRINGS, CLAY_TONES, formatPrice } from "../lib/products";
import { SHIPPING_FLAT_CENTS, FREE_SHIPPING_THRESHOLD_CENTS } from "../lib/shipping";
import { useCart } from "../lib/cart";
import PieceVisual from "./PieceVisual";
import Reveal from "./Reveal";

const SORTS = [
  { id: "novidades", label: "Novidades" },
  { id: "preco-asc", label: "Preço ↑" },
  { id: "preco-desc", label: "Preço ↓" },
];

export default function BrincosCatalog({ products = EARRINGS }) {
  const [tone, setTone] = useState("todos");
  const [sort, setSort] = useState("novidades");
  const [selected, setSelected] = useState(null);

  const usedTones = useMemo(() => [...new Set(products.map((e) => e.tone))], [products]);

  const items = useMemo(() => {
    let list = tone === "todos" ? [...products] : products.filter((e) => e.tone === tone);
    if (sort === "preco-asc") list.sort((a, b) => a.price - b.price);
    if (sort === "preco-desc") list.sort((a, b) => b.price - a.price);
    if (sort === "novidades") list.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    return list;
  }, [products, tone, sort]);

  const [spotlight, ...rest] = items;

  return (
    <>
      {/* ---------- abertura editorial ---------- */}
      <section className="ed-intro">
        <span className="ed-intro-eyebrow">Coleção 2026 · feito à mão em Portugal</span>
        <h1 className="ed-intro-title">
          Brincos que se <span className="head-accent">usam como se contam</span>
        </h1>
      </section>

      {/* ---------- coleções por tom ---------- */}
      <nav className="ed-collections" aria-label="Explorar por tom">
        <div className="ed-collections-scroll" role="group">
          <button
            className={`tone-pill ${tone === "todos" ? "active" : ""}`}
            aria-pressed={tone === "todos"}
            onClick={() => setTone("todos")}
          >
            Toda a coleção
          </button>
          {usedTones.map((t) => (
            <button
              key={t}
              className={`tone-pill ${tone === t ? "active" : ""}`}
              aria-pressed={tone === t}
              onClick={() => setTone(t)}
            >
              <span className="tone-pill-dot" style={{ background: CLAY_TONES[t].hex }} />
              {CLAY_TONES[t].label}
            </button>
          ))}
        </div>
        <div className="ed-sort" role="group" aria-label="Ordenar">
          {SORTS.map((s) => (
            <button
              key={s.id}
              className={`ed-sort-btn ${sort === s.id ? "active" : ""}`}
              aria-pressed={sort === s.id}
              onClick={() => setSort(s.id)}
            >
              {s.label}
            </button>
          ))}
        </div>
      </nav>

      {items.length === 0 ? (
        <section className="ed-shell">
          <div className="empty-state">
            <h2 className="empty-state-title">Nada neste tom, por agora</h2>
            <p className="empty-state-text">Estamos sempre a tirar peças novas do forno. Entretanto, vê a coleção completa.</p>
            <button className="btn btn-outline-sage" onClick={() => setTone("todos")}>Ver toda a coleção</button>
          </div>
        </section>
      ) : (
        <>
          {/* ---------- peça em destaque ---------- */}
          <Spotlight item={spotlight} index={1} onOpen={() => setSelected(spotlight)} />

          {/* ---------- linhas editoriais alternadas ---------- */}
          {rest.length > 0 && (
            <section className="ed-list" aria-label="Peças da coleção">
              {rest.map((item, i) => (
                <Reveal key={item.id}>
                  <EditorialRow
                    item={item}
                    index={i + 2}
                    reverse={i % 2 === 1}
                    onOpen={() => setSelected(item)}
                  />
                </Reveal>
              ))}
            </section>
          )}

          {/* ---------- fecho editorial ---------- */}
          <Reveal>
            <section className="ed-closing">
              <p className="ed-closing-note">
                {items.length} {items.length === 1 ? "peça" : "peças"} nesta seleção · novas a cada estação
              </p>
              <p className="ed-closing-line">Não encontraste a tua? Escreve-nos — fazemos peças por medida.</p>
              <a href="mailto:ola@tactumstudio.pt" className="btn btn-outline-sage">Pedir uma peça única</a>
            </section>
          </Reveal>
        </>
      )}

      {selected && <QuickView item={selected} onClose={() => setSelected(null)} />}
    </>
  );
}

function PriceTag({ price }) {
  return (
    <span className="price-tag">
      <span className="ed-price">{formatPrice(price)}</span>
    </span>
  );
}

/* Peça em destaque — split editorial assimétrico */
function Spotlight({ item, index, onOpen }) {
  const toneData = CLAY_TONES[item.tone];
  const soldOut = item.stock === 0;
  return (
    <section className="ed-spotlight">
      <button className="ed-spotlight-media" style={{ background: toneData.tile }} onClick={onOpen} aria-label={`Ver ${item.name}`}>
        {soldOut
          ? <span className="badge badge--soldout">Esgotado</span>
          : item.isNew && <span className="badge badge--light">Peça de assinatura</span>}
        <PieceVisual item={item} size={300} idSuffix="spot" />
      </button>
      <div className="ed-spotlight-body">
        <span className="ed-index">{String(index).padStart(2, "0")}</span>
        <span className="ed-tone-label"><span className="tone-pill-dot" style={{ background: toneData.hex }} /> {toneData.label}</span>
        <h2 className="ed-spotlight-name">{item.name}</h2>
        <p className="ed-spotlight-desc">{item.desc}</p>
        <div className="ed-spotlight-foot">
          <PriceTag price={item.price} />
          <button className="btn btn-charcoal" onClick={onOpen}>
            Descobrir a peça <ArrowRight size={15} className="btn-arrow" />
          </button>
        </div>
      </div>
    </section>
  );
}

/* Linha editorial alternada */
function EditorialRow({ item, index, reverse, onOpen }) {
  const toneData = CLAY_TONES[item.tone];
  const soldOut = item.stock === 0;
  return (
    <article className={`ed-row ${reverse ? "ed-row--reverse" : ""}`}>
      <button className="ed-row-media" style={{ background: toneData.tile }} onClick={onOpen} aria-label={`Ver ${item.name}`}>
        {soldOut
          ? <span className="badge badge--soldout">Esgotado</span>
          : item.isNew && <span className="badge">Novo</span>}
        <PieceVisual item={item} size={180} />
        <span className="ed-row-hint" aria-hidden="true">Ver peça <ArrowUpRight size={13} /></span>
      </button>
      <div className="ed-row-body">
        <span className="ed-index">{String(index).padStart(2, "0")}</span>
        <span className="ed-tone-label"><span className="tone-pill-dot" style={{ background: toneData.hex }} /> {toneData.label}</span>
        <h3 className="ed-row-name">{item.name}</h3>
        <p className="ed-row-desc">{item.desc}</p>
        <div className="ed-row-foot">
          <PriceTag price={item.price} />
          <button className="ed-row-cta" onClick={onOpen}>
            Ver peça <ArrowRight size={15} className="btn-arrow" />
          </button>
        </div>
      </div>
    </article>
  );
}

function QuickView({ item, onClose }) {
  const toneData = CLAY_TONES[item.tone];
  const soldOut = item.stock === 0;
  const maxQty = item.stock != null ? Math.min(9, item.stock) : 9;
  const [qty, setQty] = useState(1);
  const { addItem } = useCart();
  const dialogRef = useRef(null);

  useEffect(() => {
    // devolve o foco a quem abriu o modal quando este fecha (WCAG 2.4.3)
    const opener = document.activeElement;
    const dialog = dialogRef.current;

    const onKey = (e) => {
      if (e.key === "Escape") { onClose(); return; }
      if (e.key !== "Tab" || !dialog) return;
      // focus trap: mantém o Tab dentro do diálogo
      const focusables = dialog.querySelectorAll(
        'a[href], button:not([disabled]), input, select, [tabindex]:not([tabindex="-1"])'
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault(); last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      if (opener instanceof HTMLElement) opener.focus();
    };
  }, [onClose]);

  const handleAdd = () => {
    addItem(item, qty); // abre o carrinho automaticamente
    onClose();
  };

  return (
    <div className="qv-overlay" onClick={onClose}>
      <div ref={dialogRef} className="qv" role="dialog" aria-modal="true" aria-labelledby="qv-title" onClick={(e) => e.stopPropagation()}>
        <button className="qv-close" aria-label="Fechar" onClick={onClose} autoFocus>
          <X size={18} />
        </button>
        <div className="qv-media" style={{ background: toneData.tile }}>
          <PieceVisual item={item} size={220} idSuffix="qv" />
        </div>
        <div className="qv-body">
          <div className="qv-eyebrow">{toneData.label}{soldOut ? " · Esgotado" : item.isNew ? " · Novo" : ""}</div>
          <h2 className="qv-title" id="qv-title">{item.name}</h2>
          <div className="qv-price">
            {formatPrice(item.price)}
            <span style={{ fontWeight: 400, fontSize: 13, color: "var(--color-muted)", marginLeft: 8 }}>/ par</span>
          </div>
          <p className="qv-desc">{item.desc}</p>
          <ul className="qv-meta">
            <li><Check size={14} /> Argila polimérica cozida e selada — muito leve</li>
            <li><Check size={14} /> Ganchos em aço inoxidável hipoalergénico</li>
            <li><Check size={14} /> Feito à mão em Portugal — peça única</li>
          </ul>
          <div className="qv-actions">
            <div className="qty-control">
              <button className="qty-btn" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Diminuir quantidade" disabled={soldOut}>−</button>
              <span className="qty-value">{qty}</span>
              <button className="qty-btn" onClick={() => setQty((q) => Math.min(maxQty, q + 1))} aria-label="Aumentar quantidade" disabled={soldOut}>+</button>
            </div>
            <button className="btn btn-primary-sage order-btn" onClick={handleAdd} disabled={soldOut}>
              {soldOut ? <ShoppingBag size={16} /> : <Plus size={16} />}
              {soldOut ? "Esgotado" : `Adicionar — ${formatPrice(item.price * qty)}`}
            </button>
          </div>
          <p className="qv-note">
            Portes {formatPrice(SHIPPING_FLAT_CENTS / 100)} para Portugal, grátis acima de{" "}
            {formatPrice(FREE_SHIPPING_THRESHOLD_CENTS / 100)}. Envio em 3–5 dias úteis.
          </p>
        </div>
      </div>
    </div>
  );
}
