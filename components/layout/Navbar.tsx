"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { mainNavLinks } from "@/lib/catalog";
import { categoryCatalog } from "@/lib/catalog";
import { hamburgerCategoryMenus } from "@/lib/hamburgerMenu";
import { Button, getButtonClassName } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import { IconCart, IconClose, IconMenu } from "@/components/ui/Icons";
import { useCart } from "@/components/cart/CartProvider";

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
  const { totalItems } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);

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
    setActiveCategoryId(null);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) setActiveCategoryId(null);
  }, [menuOpen]);

  const navItems = mainNavLinks.filter((l) => l.label !== "Carrito");

  const mobileNavItems = mainNavLinks.filter(
    (link) => link.label !== "Categorías" && link.label !== "Carrito",
  );

  const activeCategoryGroup = hamburgerCategoryMenus.find(
    (group) => group.id === activeCategoryId,
  );

  const mobileMenuLinkClass = (active: boolean) =>
    `block w-full rounded-xl px-4 py-3.5 text-left text-base transition-colors ${
      active
        ? "bg-white/10 text-white"
        : "text-zinc-300 hover:bg-white/5 hover:text-white"
    }`;

  const isHamburgerSubcategoryActive = (href: string) => {
    if (href === "/tienda") return false;
    return pathname === href.split("#")[0];
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled || pathname !== "/"
          ? "glass border-b border-[var(--brand-purple)]/10 shadow-[0_8px_32px_rgba(0,0,0,0.5),0_0_40px_var(--glow-purple)]"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex min-h-[4.75rem] max-w-7xl items-center gap-3 px-4 py-2 sm:min-h-[5.25rem] sm:py-2.5 lg:px-8">
        <div className="flex items-center gap-2 lg:min-w-[200px]">
          <Button
            type="button"
            variant="icon"
            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={menuOpen}
            className="lg:hidden"
            onClick={() => setMenuOpen((o) => !o)}
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

        <div className="ml-auto flex items-center gap-1 sm:gap-2 lg:ml-0">
          <Button
            href="/carrito"
            variant="icon"
            aria-label="Carrito de compras"
            className={`relative ${
              pathname === "/carrito"
                ? "border-white/20 bg-white/10 text-white"
                : "text-[var(--muted)]"
            }`}
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
          <Button href="/tienda" variant="primary" size="sm" className="hidden sm:inline-flex">
            Tienda
          </Button>
        </div>
      </nav>

      {menuOpen && (
        <div className="glass fixed inset-0 top-[4.75rem] z-40 overflow-y-auto sm:top-[5.25rem] lg:hidden animate-fade-in">
          <ul className="flex flex-col gap-1 p-4">
            {mobileNavItems.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`block rounded-xl px-4 py-3.5 text-base transition-colors ${
                    isLinkActive(pathname, link.href)
                      ? "bg-white/10 text-white"
                      : "text-zinc-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="mt-2 border-t border-white/[0.08] pt-3">
              {!activeCategoryGroup ? (
                <>
                  <p className="px-4 pb-2 text-xs font-semibold tracking-wider text-[var(--muted)] uppercase">
                    Categorías
                  </p>
                  <ul className="flex flex-col gap-1">
                    {hamburgerCategoryMenus.map((group) => (
                      <li key={group.id}>
                        <button
                          type="button"
                          className={mobileMenuLinkClass(false)}
                          onClick={() => setActiveCategoryId(group.id)}
                        >
                          {group.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <>
                  <p className="px-4 pb-2 text-xs font-semibold tracking-wider text-[var(--muted)] uppercase">
                    {activeCategoryGroup.label}
                  </p>
                  <ul className="flex flex-col gap-1">
                    {activeCategoryGroup.children?.map((item) => {
                      const href = item.href ?? "/tienda";
                      return (
                        <li key={item.id}>
                          <Link
                            href={href}
                            className={mobileMenuLinkClass(
                              isHamburgerSubcategoryActive(href),
                            )}
                          >
                            {item.label}
                          </Link>
                        </li>
                      );
                    })}
                    <li>
                      <button
                        type="button"
                        className={mobileMenuLinkClass(false)}
                        onClick={() => setActiveCategoryId(null)}
                      >
                        ← Volver
                      </button>
                    </li>
                  </ul>
                </>
              )}
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
