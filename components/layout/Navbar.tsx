"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { mainNavLinks } from "@/lib/catalog";
import { categoryCatalog } from "@/lib/catalog";
import { Button, getButtonClassName } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import { IconCart, IconClose, IconMenu } from "@/components/ui/Icons";
import { useCart } from "@/components/cart/CartProvider";
import { MobileNavDrawer } from "@/components/layout/MobileNavDrawer";

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
  isAdminAuthenticated?: boolean;
};

export function Navbar({ isAdminAuthenticated = false }: NavbarProps) {
  const pathname = usePathname();
  const { totalItems, openCart } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);

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

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,backdrop-filter,border-color] duration-500 ${
        showNavBar
          ? "border-b border-white/10 bg-black/60 shadow-[0_4px_24px_rgba(0,0,0,0.3)] backdrop-blur-md"
          : "border-b border-transparent bg-transparent shadow-none backdrop-blur-none"
      }`}
    >
      <nav className="mx-auto flex min-h-[4.75rem] max-w-7xl items-center gap-3 px-4 py-2 sm:min-h-[5.25rem] sm:py-2.5 lg:px-8">
        <div className="flex w-10 shrink-0 items-center lg:min-w-[200px]">
          <Button
            type="button"
            variant="icon"
            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={menuOpen}
            className="lg:hidden"
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <IconClose /> : <IconMenu />}
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

        <div className="ml-auto flex w-10 shrink-0 items-center justify-end lg:ml-0 lg:min-w-[200px]">
          <Button
            type="button"
            variant="icon"
            aria-label="Carrito de compras"
            className="relative text-[var(--muted)]"
            onClick={openCart}
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
        isAdminAuthenticated={isAdminAuthenticated}
      />
    </header>
  );
}
