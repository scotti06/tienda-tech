"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { mainNavLinks } from "@/lib/catalog";
import { categoryCatalog } from "@/lib/catalog";
import { Button } from "@/components/ui/Button";
import {
  HeaderCartBadge,
  HeaderIconButton,
  HeaderIconCart,
} from "@/components/ui/HeaderIconButton";
import { Logo } from "@/components/ui/Logo";
import { MobileNavDrawer } from "@/components/layout/MobileNavDrawer";
import { AnimatedMenuIcon } from "@/components/ui/AnimatedMenuIcon";
import { useCart } from "@/components/layout/CartContext";

function isLinkActive(pathname: string, href: string): boolean {
  const base = href.split("#")[0];
  if (base === "/") return pathname === "/";
  if (base === "/tienda") {
    return pathname === "/tienda" || categoryCatalog.some((c) => c.path === pathname);
  }
  return pathname === base || pathname.startsWith(`${base}/`);
}

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const { itemCount, isOpen: cartOpen, openCart, closeCart } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen || cartOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen, cartOpen]);

  useEffect(() => {
    setMenuOpen(false);
    setCategoriesOpen(false);
    closeCart();
  }, [pathname, closeCart]);

  const navItems = mainNavLinks.filter((l) => l.label !== "Carrito");

  const isActive = (href: string) => isLinkActive(pathname, href);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled || pathname !== "/"
          ? "glass border-b border-[var(--brand-purple)]/10 shadow-[0_8px_32px_rgba(0,0,0,0.5),0_0_40px_var(--glow-purple)]"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex min-h-[4.75rem] max-w-7xl items-center gap-3 px-4 py-2 sm:min-h-[5.25rem] sm:py-2.5 lg:px-8">
        <div className="flex w-11 shrink-0 items-center lg:min-w-[200px]">
          <Button
            type="button"
            variant="icon"
            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={menuOpen}
            className="lg:hidden hover:scale-[1.03] active:scale-[0.96]"
            onClick={() => setMenuOpen((o) => !o)}
          >
            <AnimatedMenuIcon open={menuOpen} />
          </Button>
        </div>

        <div className="absolute left-1/2 -translate-x-1/2">
          <Logo href="/" />
        </div>

        <ul className="ml-auto hidden items-center gap-1 lg:flex">
          {navItems.map((link) => {
            const active = isLinkActive(pathname, link.href);
            if (link.label === "Categorías") {
              return (
                <li
                  key={link.href}
                  className="relative"
                  onMouseEnter={() => setCategoriesOpen(true)}
                  onMouseLeave={() => setCategoriesOpen(false)}
                >
                  <Link
                    href={link.href}
                    className={`rounded-full px-4 py-2 text-sm transition-all duration-300 ${
                      active
                        ? "bg-white/10 text-white"
                        : "text-[var(--muted)] hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    Categorías
                  </Link>
                  {categoriesOpen && (
                    <div className="absolute right-0 top-full z-50 mt-2 w-52 rounded-2xl border border-white/10 glass p-2 shadow-2xl animate-fade-in">
                      {categoryCatalog.map((cat) => (
                        <Link
                          key={cat.id}
                          href={cat.path}
                          className={`block rounded-xl px-4 py-2.5 text-sm transition-colors ${
                            pathname === cat.path
                              ? "bg-white/10 text-white"
                              : "text-zinc-300 hover:bg-white/5 hover:text-white"
                          }`}
                        >
                          {cat.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </li>
              );
            }
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`rounded-full px-4 py-2 text-sm transition-all duration-300 ${
                    active
                      ? "bg-white/10 text-white"
                      : "text-[var(--muted)] hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="ml-auto flex w-11 shrink-0 items-center justify-end lg:min-w-[200px] lg:ml-0">
          <HeaderIconButton
            aria-label="Carrito de compras"
            onClick={openCart}
            badge={<HeaderCartBadge count={itemCount} />}
          >
            <HeaderIconCart />
          </HeaderIconButton>
        </div>
      </nav>

      <MobileNavDrawer
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        isLinkActive={isActive}
      />
    </header>
  );
}
