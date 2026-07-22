"use client";

import { CartProvider } from "../lib/cart";
import CartDrawer from "./CartDrawer";

// Fronteira de cliente única para os contextos globais.
// Mantém o layout de servidor limpo e evita avisos no seam servidor/cliente.
export default function Providers({ children }) {
  return (
    <CartProvider>
      {children}
      <CartDrawer />
    </CartProvider>
  );
}
