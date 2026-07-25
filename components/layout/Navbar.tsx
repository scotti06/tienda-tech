"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type TouchEvent } from "react";
import { mainNavLinks } from "@/lib/catalog";
import { categoryCatalog } from "@/lib/catalog";
import { Button, getButtonClassName } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import { IconCart, IconClose, IconMenu } from "@/components/ui/Icons";
import { useCart } from "@/components/cart/CartProvider";
import { MobileNavDrawer } from "@/components/layout/MobileNavDrawer";
import { useInstantTap } from "@/lib/instantTap";

function isLinkActive(pathname: string, href: string): boolean {
  const base = href.split("#")[0];
  if (base === "/") return pathname === "/";
  if (base === "/tienda") {
    return pathname === "/tienda" || categoryCatalog.some((c) => c.path === pathname);
  }
  if (base === "/admin") {
    return pathname === "/admin" || pathname.startsWith("/admin/");
  }
  return pathname === base || pathname.startsWith(`${base}/`);
}

type NavbarProps = {
  isAdmin?: boolean;
};

export function Navbar({ isAdmin = false }: NavbarProps) {
  const pathname = usePathname();
  const { totalItems, openCart } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const lastMenuTouchEndRef = useRef(0);
  const menuTouchStartRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    setMenuOpen(false);
    setCategoriesOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  const navItems = mainNavLinks.filter((l) => l.label !== "Carrito");
  const showNavBar = scrolled || pathname !== "/";
  const cartTap = useInstantTap(openCart);

  const toggleMenu = () => setMenuOpen((open) => !open);

  const handleMenuTouchStart = (event: TouchEvent<HTMLButtonElement>) => {
    const touch = event.changedTouches[0];
    if (!touch) return;
    menuTouchStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleMenuTouchEnd = (event: TouchEvent<HTMLButtonElement>) => {
    const start = menuTouchStartRef.current;
    menuTouchStartRef.current = null;
    const touch = event.changedTouches[0];
    if (start && touch) {
      const moved =
        Math.abs(touch.clientX - start.x) > 12 ||
        Math.abs(touch.clientY - start.y) > 12;
      if (moved) return;
    }
    lastMenuTouchEndRef.current = Date.now();
    toggleMenu();
  };

  const handleMenuClick = () => {
    // iOS emits a synthetic click after touchend — ignore it to avoid double toggle.
    if (Date.now() - lastMenuTouchEndRef.current < 700) return;
    toggleMenu();
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,backdrop-filter,border-color] duration-500 ${
        showNavBar
          ? "border-b border-white/10 bg-black/60 shadow-[0_4px_24px_rgba(0,0,0,0.3)] backdrop-blur-md"
          : "border-b border-transparent bg-transparent shadow-none backdrop-blur-none"
      }`}
    >
      <nav className="mx-auto flex min-h-[4.75rem] max-w-7xl items-center gap-3 px-4 py-2 sm:min-h-[5.25rem] sm:py-2.5 lg:px-8">
        <div className="relative z-[60] flex w-11 shrink-0 items-center lg:hidden">
          <button
            type="button"
            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav-drawer"
            className="relative z-[60] inline-flex h-11 min-h-[44px] w-11 min-w-[44px] shrink-0 items-center justify-center rounded-full border border-white/[0.12] bg-[var(--void)]/50 text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.14),0_10px_28px_-8px_rgba(0,0,0,0.4)] backdrop-blur-xl transition-all duration-300 hover:border-white/20 hover:bg-white/10 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-purple)]/50 lg:hidden"
            style={{
              touchAction: "manipulation",
              pointerEvents: "auto",
              WebkitTapHighlightColor: "transparent",
              WebkitUserSelect: "none",
              userSelect: "none",
            }}
            onTouchStart={handleMenuTouchStart}
            onTouchEnd={handleMenuTouchEnd}
            onClick={handleMenuClick}
          >
            {menuOpen ? <IconClose /> : <IconMenu />}
          </button>
        </div>

        <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 lg:static lg:left-auto lg:flex lg:min-w-[200px] lg:translate-x-0 lg:items-center">
          <div className="pointer-events-auto">
            <Logo href="/" />
          </div>
        </div>

        <ul className="ml-auto hidden items-center gap-1 lg:ml-0 lg:flex lg:flex-1 lg:justify-center lg:gap-2">
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
                    aria-current={active ? "page" : undefined}
                    className={`relative rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 ${
                      active
                        ? "text-white after:absolute after:-bottom-1 after:left-4 after:right-4 after:h-[2px] after:rounded-full after:bg-gradient-to-r after:from-[var(--brand-purple)] after:to-[var(--brand-cyan)]"
                        : "text-[var(--muted)] hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    Categorías
                  </Link>
                  {categoriesOpen && (
                    <div className="dropdown-surface absolute right-0 top-full z-50 mt-2 w-52 rounded-2xl border border-white/10 glass p-2 shadow-2xl animate-fade-in">
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
                  aria-current={active ? "page" : undefined}
                  className={`relative rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 ${
                    active
                      ? "text-white after:absolute after:-bottom-1 after:left-4 after:right-4 after:h-[2px] after:rounded-full after:bg-gradient-to-r after:from-[var(--brand-purple)] after:to-[var(--brand-cyan)]"
                      : "text-[var(--muted)] hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="relative z-[60] ml-auto flex w-11 shrink-0 items-center justify-end lg:ml-0 lg:min-w-[200px]">
          <Button
            type="button"
            variant="icon"
            aria-label="Carrito de compras"
            className="relative h-11 min-h-[44px] w-11 min-w-[44px] touch-manipulation text-[var(--muted)]"
            {...cartTap}
          >
            <IconCart />
            <span
              className={getButtonClassName({
                variant: "surface-primary",
                size: "surface",
                className:
                  "pointer-events-none absolute -top-0.5 -right-0.5 h-4 min-w-4 px-1 text-[10px] font-bold",
              })}
            >
              {totalItems}
            </span>
          </Button>
        </div>
      </nav>

      <MobileNavDrawer
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        isLinkActive={(href) => isLinkActive(pathname, href)}
        isAdmin={isAdmin}
      />
    </header>
  );
}
