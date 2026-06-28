"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState, type ReactNode } from "react";
import { hamburgerCategoryMenus } from "@/lib/hamburgerMenu";
import { siteConfig } from "@/lib/data";

type MobileNavDrawerProps = {
  open: boolean;
  onClose: () => void;
  isLinkActive: (href: string) => boolean;
};

const MOBILE_NAV_ITEMS = [
  { label: "Inicio", href: "/", delay: 60 },
  { label: "Tienda", href: "/tienda", delay: 110 },
  { label: "Contacto", href: "/contacto", delay: 160 },
] as const;

const PREMIUM_EASE = [0.22, 1, 0.36, 1] as const;
const PANEL_DURATION = 0.35;
const NAV_TRANSITION = "cubic-bezier(0.22, 1, 0.36, 1)";

type StaggerItemProps = {
  delay: number;
  children: ReactNode;
};

function StaggerItem({ delay, children }: StaggerItemProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -12 }}
      transition={{
        duration: reduceMotion ? 0.01 : PANEL_DURATION,
        ease: PREMIUM_EASE,
        delay: reduceMotion ? 0 : delay / 1000,
      }}
    >
      {children}
    </motion.div>
  );
}

type MobileNavLinkProps = {
  href: string;
  label: string;
  active: boolean;
  onClose: () => void;
};

function MobileNavLink({ href, label, active, onClose }: MobileNavLinkProps) {
  return (
    <Link
      href={href}
      onClick={onClose}
      aria-current={active ? "page" : undefined}
      className={`relative flex items-center justify-between py-3 pl-6 pr-5 transition-[background-color,color,opacity] duration-[180ms] ${
        active ? "bg-white/[0.03] text-white" : "bg-transparent text-white/65"
      }`}
      style={{ transitionTimingFunction: NAV_TRANSITION }}
    >
      <span
        aria-hidden
        className={`absolute left-0 top-1/2 h-4 w-[2px] -translate-y-1/2 rounded-full bg-[#9D4EDD] transition-opacity duration-[180ms] ${
          active ? "opacity-100" : "opacity-0"
        }`}
        style={{ transitionTimingFunction: NAV_TRANSITION }}
      />
      <span className="text-[20px] font-medium tracking-[-0.015em]">{label}</span>
      <span
        className={`text-[13px] font-light leading-none transition-colors duration-[180ms] ${
          active ? "text-zinc-500" : "text-zinc-600"
        }`}
        style={{ transitionTimingFunction: NAV_TRANSITION }}
        aria-hidden
      >
        →
      </span>
    </Link>
  );
}

export function MobileNavDrawer({
  open,
  onClose,
  isLinkActive,
}: MobileNavDrawerProps) {
  const reduceMotion = useReducedMotion();
  const duration = reduceMotion ? 0.01 : PANEL_DURATION;
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);

  useEffect(() => {
    if (!open) setActiveCategoryId(null);
  }, [open]);

  const activeCategoryGroup = hamburgerCategoryMenus.find(
    (group) => group.id === activeCategoryId,
  );

  const categoryPillClass = (active: boolean) =>
    `inline-flex rounded-full border px-3.5 py-1.5 text-[13px] tracking-[0.02em] transition-all duration-[180ms] ${
      active
        ? "border-[rgba(168,85,247,0.24)] bg-white/[0.03] text-white"
        : "border-white/[0.07] text-zinc-400 hover:border-[rgba(168,85,247,0.16)] hover:text-zinc-300"
    }`;

  const isHamburgerSubcategoryActive = (href: string) => {
    if (href === "/tienda") return false;
    return isLinkActive(href);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            role="button"
            tabIndex={-1}
            aria-label="Cerrar menú"
            className="fixed inset-0 z-[45] bg-black/30 lg:hidden"
            style={{
              backdropFilter: "blur(6px)",
              WebkitBackdropFilter: "blur(6px)",
            }}
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(6px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            transition={{ duration, ease: PREMIUM_EASE }}
            onClick={onClose}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") onClose();
            }}
          />

          <motion.aside
            aria-label="Menú principal"
            className="fixed inset-y-0 left-0 top-0 z-[48] flex h-[100dvh] w-[82%] flex-col border-r border-[rgba(168,85,247,0.18)] bg-black/45 shadow-[4px_0_36px_rgba(168,85,247,0.08)] backdrop-blur-[18px] lg:hidden"
            initial={{ opacity: 0, x: -30, scale: 0.98 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -30, scale: 0.98 }}
            transition={{ duration, ease: PREMIUM_EASE }}
          >
            <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-6 pt-6 pb-8 sm:px-7">
              <StaggerItem delay={0}>
                <div className="flex items-start gap-3">
                  <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-lg">
                    <Image
                      src={siteConfig.logo}
                      alt=""
                      width={32}
                      height={32}
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <div className="min-w-0 pt-0.5">
                    <p className="text-[24px] font-semibold leading-none tracking-[-0.02em] text-white">
                      {siteConfig.name}
                    </p>
                    <p className="mt-1.5 text-[14px] leading-snug text-white/45">
                      Accesorios para iPhone
                    </p>
                  </div>
                </div>
              </StaggerItem>

              <nav className="mt-3.5" aria-label="Secciones principales">
                <ul className="flex flex-col">
                  {MOBILE_NAV_ITEMS.map(({ label, href, delay }, index) => (
                    <li
                      key={href}
                      className={index > 0 ? "border-t border-white/[0.04]" : ""}
                    >
                      <StaggerItem delay={delay}>
                        <MobileNavLink
                          href={href}
                          label={label}
                          active={isLinkActive(href)}
                          onClose={onClose}
                        />
                      </StaggerItem>
                    </li>
                  ))}
                </ul>
              </nav>

              <StaggerItem delay={220}>
                <section className="mt-11" aria-label="Categorías">
                  {!activeCategoryGroup ? (
                    <>
                      <h2 className="mb-4 text-[13px] font-medium tracking-[0.18em] text-zinc-500 uppercase">
                        Categorías
                      </h2>
                      <ul className="flex flex-wrap gap-2.5">
                        {hamburgerCategoryMenus.map((group) => (
                          <li key={group.id}>
                            <button
                              type="button"
                              className={categoryPillClass(false)}
                              style={{ transitionTimingFunction: NAV_TRANSITION }}
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
                      <h2 className="mb-4 text-[13px] font-medium tracking-[0.18em] text-zinc-500 uppercase">
                        {activeCategoryGroup.label}
                      </h2>
                      <ul className="flex flex-wrap gap-2.5">
                        {activeCategoryGroup.children?.map((item) => {
                          const href = item.href ?? "/tienda";
                          const active = isHamburgerSubcategoryActive(href);

                          return (
                            <li key={item.id}>
                              <Link
                                href={href}
                                onClick={onClose}
                                aria-current={active ? "page" : undefined}
                                className={categoryPillClass(active)}
                                style={{ transitionTimingFunction: NAV_TRANSITION }}
                              >
                                {item.label}
                              </Link>
                            </li>
                          );
                        })}
                        <li>
                          <button
                            type="button"
                            className={categoryPillClass(false)}
                            style={{ transitionTimingFunction: NAV_TRANSITION }}
                            onClick={() => setActiveCategoryId(null)}
                          >
                            ← Volver
                          </button>
                        </li>
                      </ul>
                    </>
                  )}
                </section>
              </StaggerItem>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
