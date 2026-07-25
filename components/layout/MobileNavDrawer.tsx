"use client";

import Link from "next/link";
import { useRef, useState, type TouchEvent as ReactTouchEvent } from "react";
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
const SWIPE_CLOSE_PX = 50;
const AXIS_LOCK_PX = 10;

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
      className={`flex min-h-[44px] items-center rounded-xl px-4 py-3 text-base transition-colors ${
        active
          ? "bg-white/10 text-white"
          : "text-zinc-300 hover:bg-white/5 hover:text-white"
      }`}
      style={{
        touchAction: "manipulation",
        WebkitTapHighlightColor: "transparent",
      }}
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
  const closedByTouchRef = useRef(false);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const axisRef = useRef<"x" | "y" | null>(null);
  const dragXRef = useRef(0);
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const handleBackdropTouchEnd = () => {
    closedByTouchRef.current = true;
    onClose();
  };

  const handleBackdropClick = () => {
    if (closedByTouchRef.current) {
      closedByTouchRef.current = false;
      return;
    }
    onClose();
  };

  const resetSwipe = () => {
    touchStartRef.current = null;
    axisRef.current = null;
    dragXRef.current = 0;
    setDragX(0);
    setIsDragging(false);
  };

  const handleDrawerTouchStart = (event: ReactTouchEvent) => {
    const touch = event.touches[0];
    if (!touch) return;
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
    axisRef.current = null;
    dragXRef.current = 0;
    setIsDragging(false);
  };

  const handleDrawerTouchMove = (event: ReactTouchEvent) => {
    const start = touchStartRef.current;
    const touch = event.touches[0];
    if (!start || !touch) return;

    const dx = touch.clientX - start.x;
    const dy = touch.clientY - start.y;

    if (!axisRef.current) {
      if (Math.abs(dx) < AXIS_LOCK_PX && Math.abs(dy) < AXIS_LOCK_PX) return;
      axisRef.current = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
    }

    // Vertical scroll stays native inside the panel.
    if (axisRef.current === "y") return;

    // Horizontal swipe left — panel follows via translateX (GPU).
    const nextX = Math.min(0, dx);
    dragXRef.current = nextX;
    setIsDragging(true);
    setDragX(nextX);
  };

  const handleDrawerTouchEnd = () => {
    const offset = dragXRef.current;
    const shouldClose = axisRef.current === "x" && offset <= -SWIPE_CLOSE_PX;

    if (shouldClose) {
      resetSwipe();
      onClose();
      return;
    }

    resetSwipe();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            role="button"
            tabIndex={-1}
            aria-label="Cerrar menú"
            className="fixed inset-0 z-[40] h-[100dvh] w-screen cursor-pointer bg-black/45 lg:hidden"
            style={{
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
              touchAction: "none",
              pointerEvents: "auto",
              WebkitTapHighlightColor: "transparent",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration, ease: PREMIUM_EASE }}
            onClick={handleBackdropClick}
            onTouchEnd={handleBackdropTouchEnd}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") onClose();
            }}
          />

          <motion.aside
            id="mobile-nav-drawer"
            aria-label="Menú principal"
            className="drawer-surface fixed inset-y-0 left-0 z-[45] h-[100dvh] w-[90vw] max-w-[420px] overflow-hidden border-r border-white/[0.06] shadow-[4px_0_80px_rgba(0,0,0,0.55)] lg:hidden"
            style={{ willChange: "transform" }}
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration, ease: PREMIUM_EASE }}
          >
            {/* Inner panel owns the swipe gesture so open/close animation stays clean. */}
            <div
              className="relative flex h-full min-h-0 w-full flex-col"
              style={{
                transform: `translate3d(${dragX}px, 0, 0)`,
                transition: isDragging
                  ? "none"
                  : `transform ${duration}s cubic-bezier(0.22, 1, 0.36, 1)`,
                touchAction: "pan-y",
                WebkitOverflowScrolling: "touch",
                willChange: "transform",
                pointerEvents: "auto",
              }}
              onTouchStart={handleDrawerTouchStart}
              onTouchMove={handleDrawerTouchMove}
              onTouchEnd={handleDrawerTouchEnd}
              onTouchCancel={handleDrawerTouchEnd}
            >
              <DrawerBackground />

              <header className="relative shrink-0 border-b border-white/[0.06] px-6 pb-7 pt-[5.5rem] sm:px-8 sm:pb-8 sm:pt-[6rem]">
                <div className="flex justify-center">
                  <Logo size="drawer" onClick={onClose} />
                </div>
              </header>

              <nav
                aria-label="Navegación"
                className="relative flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain px-4 pb-8 pt-4"
                style={{
                  touchAction: "pan-y",
                  WebkitOverflowScrolling: "touch",
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
              </nav>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
