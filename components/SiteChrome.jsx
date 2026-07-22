"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Instagram, Mail, ShoppingBag } from "lucide-react";
import { useCart } from "../lib/cart";

const BRAND = "tactum studio";
const CLAY_DOTS = ["#C1633B", "#8A9A7E", "#E3A9A0", "#E8B04B", "#B08D57", "#4A463D"];

const NAV_LINKS = [
  { href: "/brincos", label: "Brincos", accent: "var(--color-gold)" },
  { href: "/pets", label: "Pets", accent: "var(--color-terracotta)" },
];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const { count, openCart, hydrated } = useCart();

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link href="/" className="brand" aria-label={`${BRAND} — página inicial`} onClick={() => setMenuOpen(false)}>
          <span className="brand-dot" aria-hidden="true" />
          <span className="brand-name">{BRAND}</span>
        </Link>

        <nav className="nav-desktop" aria-label="Áreas da loja">
          {NAV_LINKS.map((link) => {
            const active = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className="tab-btn"
                aria-current={active ? "page" : undefined}
              >
                <span>{link.label}</span>
                {active && <span className="tab-underline" style={{ background: link.accent }} />}
              </Link>
            );
          })}
        </nav>

        <div className="header-actions">
          <button
            className="icon-btn cart-btn"
            aria-label={`Abrir carrinho${hydrated && count > 0 ? `, ${count} ${count === 1 ? "artigo" : "artigos"}` : ""}`}
            onClick={openCart}
          >
            <ShoppingBag size={19} />
            {hydrated && count > 0 && <span className="cart-count">{count}</span>}
          </button>
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
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`nav-mobile-link ${pathname.startsWith(link.href) ? "active" : ""}`}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}

export function MaterialStrip() {
  return (
    <div className="material-strip" aria-hidden="true">
      {CLAY_DOTS.map((c) => <span key={c} className="material-dot" style={{ background: c }} />)}
    </div>
  );
}

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-word" aria-hidden="true">tactum studio</div>
      <div className="footer-inner">
        <div className="footer-brand">
          <div className="footer-brand-row">
            <span className="brand-dot" aria-hidden="true" />
            <span className="brand-name">{BRAND}</span>
          </div>
          <p className="footer-tagline">
            Brincos & chapinhas em argila polimérica, moldados um a um no nosso estúdio em Portugal.
          </p>
        </div>
        <nav className="footer-col" aria-label="Explorar">
          <h3 className="footer-heading">Explorar</h3>
          <Link href="/brincos" className="footer-link">Catálogo de brincos</Link>
          <Link href="/pets" className="footer-link">Chapinhas para pets</Link>
        </nav>
        <div className="footer-col">
          <h3 className="footer-heading">Contacto</h3>
          <a href="https://instagram.com" className="footer-link" target="_blank" rel="noreferrer">
            <Instagram size={15} /> Instagram
          </a>
          <a href="mailto:ola@tactumstudio.pt" className="footer-link">
            <Mail size={15} /> ola@tactumstudio.pt
          </a>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} {BRAND}. Todos os direitos reservados.</span>
        <span>Feito à mão, cor a cor.</span>
      </div>
    </footer>
  );
}
