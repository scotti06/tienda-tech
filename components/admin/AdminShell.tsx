"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

const navItems = [
  { href: "/admin", label: "Dashboard", exact: true },
  { href: "/admin/productos", label: "Productos" },
  { href: "/admin/pedidos", label: "Pedidos" },
  { href: "/admin/notificaciones", label: "Notificaciones" },
];

const headerButtonClass =
  "px-3 py-1 text-sm max-md:rounded-lg md:px-4 md:py-2 md:text-xs";

type AdminShellProps = {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
};

export function AdminShell({
  title,
  description,
  actions,
  children,
}: AdminShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  async function handleLogout() {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen max-w-[100vw] overflow-x-hidden bg-[#0b0b10] text-white">
      <header className="sticky top-0 z-40 border-b border-white/[0.08] bg-[#0b0b10]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:py-4 md:px-6">
          <div className="min-w-0">
            <p className="text-[10px] font-semibold tracking-[0.2em] text-[var(--brand-cyan)] uppercase sm:text-[11px] sm:tracking-[0.24em]">
              Modo Anfitrión
            </p>
            <h1 className="truncate text-base font-semibold tracking-tight sm:text-lg">
              {title}
            </h1>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Button
              href="/"
              variant="secondary"
              size="compact"
              className={headerButtonClass}
            >
              Ver tienda
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="compact"
              className={headerButtonClass}
              onClick={handleLogout}
            >
              Salir
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-4 px-4 py-4 sm:gap-6 sm:py-6 lg:grid-cols-[220px_1fr] md:px-6">
        <aside className="min-w-0 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-2 md:p-3">
          <nav
            aria-label="Secciones del panel"
            className="hide-scrollbar scroll-snap-x flex flex-nowrap gap-2 overflow-x-auto overscroll-x-contain lg:flex-col lg:overflow-visible"
          >
            {navItems.map((item) => {
              const active =
                mounted &&
                (item.exact
                  ? pathname === item.href
                  : pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`shrink-0 scroll-snap-start rounded-xl px-3 py-2.5 text-sm font-medium whitespace-nowrap transition-colors md:px-4 md:py-3 ${
                    active
                      ? "bg-[var(--brand-purple)]/20 text-white"
                      : "text-[var(--muted)] hover:bg-white/[0.04] hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <main className="min-w-0 max-w-full overflow-x-hidden">
          {(description || actions) && (
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="min-w-0">
                {description && (
                  <p className="max-w-2xl text-sm text-[var(--muted)]">
                    {description}
                  </p>
                )}
              </div>
              {actions && <div className="shrink-0">{actions}</div>}
            </div>
          )}
          {children}
        </main>
      </div>
    </div>
  );
}
