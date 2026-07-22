"use client";

import { useEffect, useRef, useState } from "react";
import { X, ShoppingBag, Loader2, Trash2, Lock } from "lucide-react";
import { CLAY_TONES, formatPrice } from "../lib/products";
import { goToCheckout } from "../lib/checkout";
import { useCart } from "../lib/cart";
import PieceVisual from "./PieceVisual";

export default function CartDrawer() {
  const { items, isOpen, closeCart, updateQty, removeItem, subtotal, count } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const panelRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    const opener = document.activeElement;
    const panel = panelRef.current;

    const onKey = (e) => {
      if (e.key === "Escape") { closeCart(); return; }
      if (e.key !== "Tab" || !panel) return;
      const f = panel.querySelectorAll(
        'a[href], button:not([disabled]), input, select, [tabindex]:not([tabindex="-1"])'
      );
      if (f.length === 0) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };

    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    // foca o painel ao abrir
    panel?.querySelector(".cart-close")?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      if (opener instanceof HTMLElement) opener.focus();
    };
  }, [isOpen, closeCart]);

  if (!isOpen) return null;

  const handleCheckout = async () => {
    if (items.length === 0) return;
    setLoading(true);
    await goToCheckout(
      items.map((it) => ({
        name: it.name,
        description: `Brincos em argila polimérica (par) — tom ${CLAY_TONES[it.tone]?.label ?? it.tone}`,
        unitAmount: Math.round(it.price * 100),
        quantity: it.qty,
      })),
      setError
    );
    setLoading(false);
  };

  return (
    <div className="cart-overlay" onClick={closeCart}>
      <aside
        ref={panelRef}
        className="cart-panel"
        role="dialog"
        aria-modal="true"
        aria-label="Carrinho de compras"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="cart-head">
          <h2 className="cart-title">
            Carrinho {count > 0 && <span className="cart-title-count">({count})</span>}
          </h2>
          <button className="cart-close icon-btn" aria-label="Fechar carrinho" onClick={closeCart}>
            <X size={20} />
          </button>
        </header>

        {items.length === 0 ? (
          <div className="cart-empty">
            <div className="cart-empty-icon"><ShoppingBag size={26} /></div>
            <p className="cart-empty-title">O teu carrinho está vazio</p>
            <p className="cart-empty-text">Descobre a coleção e adiciona as tuas peças favoritas.</p>
            <button className="btn btn-outline-sage" onClick={closeCart}>Continuar a ver</button>
          </div>
        ) : (
          <>
            <ul className="cart-items">
              {items.map((it) => {
                const tone = CLAY_TONES[it.tone];
                return (
                  <li key={it.id} className="cart-item">
                    <div className="cart-thumb" style={{ background: tone?.tile }}>
                      <PieceVisual item={it} size={70} idSuffix={`cart-${it.id}`} />
                    </div>
                    <div className="cart-item-main">
                      <div className="cart-item-top">
                        <div>
                          <div className="cart-item-name">{it.name}</div>
                          <div className="cart-item-tone">{tone?.label ?? it.tone}</div>
                        </div>
                        <button
                          className="cart-remove"
                          aria-label={`Remover ${it.name} do carrinho`}
                          onClick={() => removeItem(it.id)}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                      <div className="cart-item-bot">
                        <div className="qty-control qty-control--sm">
                          <button className="qty-btn" aria-label="Diminuir quantidade" onClick={() => updateQty(it.id, it.qty - 1)}>−</button>
                          <span className="qty-value">{it.qty}</span>
                          <button className="qty-btn" aria-label="Aumentar quantidade" onClick={() => updateQty(it.id, it.qty + 1)}>+</button>
                        </div>
                        <span className="cart-item-price">{formatPrice(it.price * it.qty)}</span>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>

            <footer className="cart-foot">
              <div className="cart-subtotal">
                <span>Subtotal</span>
                <span className="cart-subtotal-value">{formatPrice(subtotal)}</span>
              </div>
              <p className="cart-foot-note">Portes calculados no pagamento · envio em 3–5 dias úteis.</p>
              {error && <div className="field-help error" role="status">{error}</div>}
              <button className="btn btn-primary-sage cart-checkout" onClick={handleCheckout} disabled={loading}>
                {loading ? <Loader2 size={16} className="spin" /> : <Lock size={15} />}
                {loading ? "A abrir pagamento..." : `Finalizar compra — ${formatPrice(subtotal)}`}
              </button>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}
