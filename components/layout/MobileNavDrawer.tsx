"use client";

import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { categoryCatalog } from "@/lib/catalog";
import { Logo } from "@/components/ui/Logo";

type MobileNavDrawerProps = {
  open: boolean;
  onClose: () => void;
  isLinkActive: (href: string) => boolean;
  isAdmin?: boolean;
};

const PREMIUM_EASE = [0.22, 1, 0.36, 1] as const;
const DRAWER_DURATION = 0.32;

const PRIMARY_LINKS = [
  { label: "Inicio", href: "/" },
  { label: "Tienda", href: "/tienda" },
] as const;

function NavLink({
  href,
  label,
  active,
  onClose,
}: {
  href: string;
  label: string;
  active: boolean;
  onClose: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClose}
      aria-current={active ? "page" : undefined}
      className={`block rounded-xl px-4 py-3.5 text-base transition-colors ${
        active
          ? "bg-white/10 text-white"
          : "text-zinc-300 hover:bg-white/5 hover:text-white"
      }`}
    >
      {label}
    </Link>
  );
}

function DrawerBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="absolute inset-0 bg-[#09090B]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_70%_at_50%_-20%,rgba(23,37,84,0.22),transparent_68%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_55%_45%_at_100%_100%,rgba(157,78,221,0.05),transparent_62%)]" />
    </div>
  );
}

export function MobileNavDrawer({
  open,
  onClose,
  isLinkActive,
  isAdmin = false,
}: MobileNavDrawerProps) {
  const reduceMotion = useReducedMotion();
  const duration = reduceMotion ? 0.01 : DRAWER_DURATION;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            role="button"
            tabIndex={-1}
            aria-label="Cerrar menú"
            className="fixed inset-0 z-[45] bg-black/45 lg:hidden"
            style={{
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration, ease: PREMIUM_EASE }}
            onClick={onClose}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") onClose();
            }}
          />

          <motion.aside
            aria-label="Menú principal"
            className="fixed inset-y-0 left-0 z-[48] flex h-[100dvh] w-[90vw] max-w-[420px] flex-col overflow-hidden border-r border-white/[0.06] shadow-[4px_0_80px_rgba(0,0,0,0.55)] lg:hidden"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration, ease: PREMIUM_EASE }}
          >
            <DrawerBackground />

            <header className="relative shrink-0 border-b border-white/[0.06] px-6 pb-7 pt-[5.5rem] sm:px-8 sm:pb-8 sm:pt-[6rem]">
              <div className="flex justify-center">
                <Logo size="drawer" onClick={onClose} />
              </div>
            </header>

            <motion.nav
              aria-label="Navegación"
              className="relative flex min-h-0 flex-1 flex-col overflow-y-auto px-4 pb-8 pt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: reduceMotion ? 0.01 : 0.18,
                delay: reduceMotion ? 0 : 0.1,
                ease: PREMIUM_EASE,
              }}
            >
              <ul className="flex flex-col gap-1">
                {PRIMARY_LINKS.map((link) => (
                  <li key={link.href}>
                    <NavLink
                      href={link.href}
                      label={link.label}
                      active={isLinkActive(link.href)}
                      onClose={onClose}
                    />
                  </li>
                ))}
              </ul>

              <div className="mt-4 border-t border-white/[0.08] pt-4">
                <p className="px-4 pb-2 text-xs font-semibold tracking-wider text-[var(--muted)] uppercase">
                  Categorías
                </p>
                <ul className="flex flex-col gap-1">
                  {categoryCatalog.map((category) => (
                    <li key={category.id}>
                      <NavLink
                        href={category.path}
                        label={category.name}
                        active={isLinkActive(category.path)}
                        onClose={onClose}
                      />
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-4 border-t border-white/[0.08] pt-4">
                <NavLink
                  href="/contacto"
                  label="Contacto"
                  active={isLinkActive("/contacto")}
                  onClose={onClose}
                />
              </div>

              {isAdmin && (
                <div className="mt-auto border-t border-white/[0.08] pt-4">
                  <NavLink
                    href="/admin"
                    label="Panel Anfitrión"
                    active={isLinkActive("/admin")}
                    onClose={onClose}
                  />
                </div>
              )}
            </motion.nav>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
