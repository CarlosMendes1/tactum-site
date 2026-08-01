"use client";

import { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";

import { MAX_QTY_PER_ITEM as MAX_QTY } from "./products";

const CartContext = createContext(null);
const STORAGE_KEY = "tactum-cart-v1";

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // carrega o carrinho guardado (só no cliente, depois da hidratação)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      /* ignora armazenamento indisponível/corrompido */
    }
    setHydrated(true);
  }, []);

  // persiste a cada alteração
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* ignora */
    }
  }, [items, hydrated]);

  const addItem = useCallback((product, qty = 1) => {
    setItems((prev) => {
      const idx = prev.findIndex((p) => p.id === product.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], qty: Math.min(MAX_QTY, copy[idx].qty + qty) };
        return copy;
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          tone: product.tone,
          shape: product.shape,
          imageUrl: product.imageUrl ?? null,
          qty: Math.min(MAX_QTY, qty),
        },
      ];
    });
    setIsOpen(true);
  }, []);

  const updateQty = useCallback((id, qty) => {
    setItems((prev) =>
      prev.map((p) => (p.id === id ? { ...p, qty: Math.max(1, Math.min(MAX_QTY, qty)) } : p))
    );
  }, []);

  const removeItem = useCallback((id) => {
    setItems((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  // O carrinho vive no localStorage e pode ficar desatualizado entre visitas: um
  // preço muda no Supabase, uma peça é desativada ou esgota. Sem isto, o cliente
  // via um total e o Stripe cobrava outro — é o servidor que manda no preço.
  // Reconcilia com a coleção fresca e descarta o que já não existe.
  const syncWithCatalog = useCallback((products) => {
    if (!Array.isArray(products) || products.length === 0) return;
    const byId = new Map(products.map((p) => [p.id, p]));

    setItems((prev) => {
      let changed = false;
      const next = [];

      for (const item of prev) {
        const fresh = byId.get(item.id);
        if (!fresh || fresh.stock === 0) {
          changed = true; // desapareceu ou esgotou
          continue;
        }
        const maxQty = fresh.stock === null ? MAX_QTY : Math.min(MAX_QTY, fresh.stock);
        const qty = Math.min(item.qty, maxQty);
        const imageUrl = fresh.imageUrl ?? null;

        if (
          fresh.price !== item.price ||
          fresh.name !== item.name ||
          fresh.tone !== item.tone ||
          fresh.shape !== item.shape ||
          imageUrl !== item.imageUrl ||
          qty !== item.qty
        ) {
          changed = true;
          next.push({
            id: fresh.id,
            name: fresh.name,
            price: fresh.price,
            tone: fresh.tone,
            shape: fresh.shape,
            imageUrl,
            qty,
          });
        } else {
          next.push(item);
        }
      }

      return changed ? next : prev;
    });
  }, []);

  const count = useMemo(() => items.reduce((n, p) => n + p.qty, 0), [items]);
  const subtotal = useMemo(() => items.reduce((s, p) => s + p.price * p.qty, 0), [items]);

  const value = useMemo(
    () => ({
      items, addItem, updateQty, removeItem, clear, syncWithCatalog,
      count, subtotal, hydrated,
      isOpen, openCart: () => setIsOpen(true), closeCart: () => setIsOpen(false),
    }),
    [items, addItem, updateQty, removeItem, clear, syncWithCatalog, count, subtotal, hydrated, isOpen]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// Default seguro para passagens de render em que o contexto ainda não está
// disponível (boundaries do Next em dev). Evita crashes; o carrinho real vem
// sempre do <CartProvider> na árvore normal.
const EMPTY_CART = {
  items: [], count: 0, subtotal: 0, hydrated: false, isOpen: false,
  addItem() {}, updateQty() {}, removeItem() {}, clear() {}, syncWithCatalog() {},
  openCart() {}, closeCart() {},
};

export function useCart() {
  return useContext(CartContext) ?? EMPTY_CART;
}
