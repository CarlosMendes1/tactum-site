"use client";

import { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";

const CartContext = createContext(null);
const STORAGE_KEY = "tactum-cart-v1";
const MAX_QTY = 9;

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

  const count = useMemo(() => items.reduce((n, p) => n + p.qty, 0), [items]);
  const subtotal = useMemo(() => items.reduce((s, p) => s + p.price * p.qty, 0), [items]);

  const value = useMemo(
    () => ({
      items, addItem, updateQty, removeItem, clear, count, subtotal, hydrated,
      isOpen, openCart: () => setIsOpen(true), closeCart: () => setIsOpen(false),
    }),
    [items, addItem, updateQty, removeItem, clear, count, subtotal, hydrated, isOpen]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// Default seguro para passagens de render em que o contexto ainda não está
// disponível (boundaries do Next em dev). Evita crashes; o carrinho real vem
// sempre do <CartProvider> na árvore normal.
const EMPTY_CART = {
  items: [], count: 0, subtotal: 0, hydrated: false, isOpen: false,
  addItem() {}, updateQty() {}, removeItem() {}, clear() {}, openCart() {}, closeCart() {},
};

export function useCart() {
  return useContext(CartContext) ?? EMPTY_CART;
}
