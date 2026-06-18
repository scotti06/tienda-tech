"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { siteConfig } from "@/lib/data";
import { getProductBySlug } from "@/lib/catalog";
import { Button, getButtonClassName } from "@/components/ui/Button";
import { IconClose } from "@/components/ui/Icons";

type QuickReply = {
  id: string;
  emoji: string;
  label: string;
  message: string;
};

const QUICK_REPLIES: QuickReply[] = [
  {
    id: "search",
    emoji: "📱",
    label: "Buscar accesorio",
    message: "Hola! Quiero buscar un accesorio para mi iPhone.",
  },
  {
    id: "price",
    emoji: "💰",
    label: "Consultar precio",
    message: "Hola! Quiero consultar el precio de un producto.",
  },
  {
    id: "stock",
    emoji: "📦",
    label: "Stock y disponibilidad",
    message: "Hola! Quiero consultar stock y disponibilidad.",
  },
  {
    id: "compat",
    emoji: "🔧",
    label: "Compatibilidad con mi iPhone",
    message: "Hola! Necesito ayuda con la compatibilidad para mi iPhone.",
  },
  {
    id: "advisor",
    emoji: "👨‍💼",
    label: "Hablar con un asesor",
    message: "Hola! Quiero hablar con un asesor.",
  },
];

const HANDOFF_DELAY_MS = 1050;

const backdropTransition = { duration: 0.22, ease: [0.4, 0, 0.2, 1] as const };

const panelTransition = {
  type: "spring" as const,
  damping: 28,
  stiffness: 340,
  mass: 0.85,
};

const iconSpring = {
  type: "spring" as const,
  damping: 22,
  stiffness: 280,
  mass: 0.9,
};

function WhatsAppGlyph({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function ConnectingDots() {
  return (
    <span
      className="mt-4 inline-flex items-center gap-2"
      aria-hidden
    >
      {[0, 1, 2].map((index) => (
        <motion.span
          key={index}
          className="text-[10px] text-[var(--brand-cyan)]"
          animate={{ opacity: [0.2, 1, 0.2] }}
          transition={{
            duration: 1.1,
            repeat: Infinity,
            delay: index * 0.22,
            ease: "easeInOut",
          }}
        >
          ●
        </motion.span>
      ))}
    </span>
  );
}

function getProductSlugFromPath(pathname: string): string | null {
  const match = pathname.match(/^\/producto\/([^/]+)/);
  return match?.[1] ?? null;
}

function withProductContext(message: string, productName: string | null): string {
  if (!productName) return message;
  return `${message}\n\nProducto: ${productName}`;
}

function buildWhatsAppUrl(message: string): string {
  return `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(message)}`;
}

function tryOpenWhatsApp(url: string): boolean {
  const popup = window.open(url, "_blank", "noopener,noreferrer");
  return popup !== null && typeof popup !== "undefined";
}

export function WhatsAppAssistant() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [connectingUrl, setConnectingUrl] = useState<string | null>(null);
  const [showFallback, setShowFallback] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const handoffTimerRef = useRef<number | null>(null);

  const productName = useMemo(() => {
    const slug = getProductSlugFromPath(pathname);
    if (!slug) return null;
    return getProductBySlug(slug)?.name ?? null;
  }, [pathname]);

  const close = useCallback(() => setOpen(false), []);

  const clearHandoff = useCallback(() => {
    if (handoffTimerRef.current !== null) {
      window.clearTimeout(handoffTimerRef.current);
      handoffTimerRef.current = null;
    }
    setConnectingUrl(null);
    setShowFallback(false);
  }, []);

  const startHandoff = useCallback(
    (baseMessage: string) => {
      const message = withProductContext(baseMessage, productName);
      const url = buildWhatsAppUrl(message);
      close();
      setShowFallback(false);
      setConnectingUrl(url);
    },
    [close, productName],
  );

  useEffect(() => {
    setReduceMotion(
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    );
  }, []);

  useEffect(() => {
    if (!connectingUrl) return;

    const delay = reduceMotion ? 400 : HANDOFF_DELAY_MS;

    handoffTimerRef.current = window.setTimeout(() => {
      const opened = tryOpenWhatsApp(connectingUrl);
      if (opened) {
        clearHandoff();
      } else {
        setShowFallback(true);
      }
    }, delay);

    return () => {
      if (handoffTimerRef.current !== null) {
        window.clearTimeout(handoffTimerRef.current);
        handoffTimerRef.current = null;
      }
    };
  }, [clearHandoff, connectingUrl, reduceMotion]);

  useEffect(() => {
    if (!open && !connectingUrl) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (connectingUrl) clearHandoff();
        else close();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [clearHandoff, close, connectingUrl, open]);

  const motionTransition = reduceMotion
    ? { duration: 0.15 }
    : panelTransition;

  return (
    <>
      <AnimatePresence>
        {connectingUrl && (
          <motion.div
            role="status"
            aria-live="polite"
            aria-label="Conectando con WhatsApp"
            className="fixed inset-0 z-[90] flex items-center justify-center bg-[var(--void)]/72 px-6 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={backdropTransition}
          >
            <motion.div
              className="w-full max-w-sm overflow-hidden rounded-3xl border border-white/[0.12] bg-gradient-to-b from-white/[0.12] via-[rgba(157,78,221,0.14)] to-[rgba(0,180,216,0.08)] px-8 py-10 text-center shadow-[inset_0_1px_0_0_rgba(255,255,255,0.16),0_28px_64px_-16px_rgba(0,0,0,0.55),0_0_40px_rgba(157,78,221,0.12)] backdrop-blur-xl"
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              transition={reduceMotion ? { duration: 0.15 } : iconSpring}
            >
              <motion.div
                className="mx-auto flex h-20 w-20 items-center justify-center rounded-[1.35rem] bg-[#25D366] text-white shadow-[0_12px_32px_-8px_rgba(37,211,102,0.55)]"
                initial={{ opacity: 0, scale: 0.82 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={
                  reduceMotion
                    ? { duration: 0.15 }
                    : { ...iconSpring, delay: 0.04 }
                }
              >
                <WhatsAppGlyph className="h-10 w-10" />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={
                  reduceMotion
                    ? { duration: 0.15 }
                    : { duration: 0.45, delay: 0.14, ease: [0.22, 1, 0.36, 1] }
                }
              >
                <p className="mt-6 text-base font-semibold tracking-tight text-white">
                  Conectándote con {siteConfig.name}...
                </p>
                <p className="mt-2 text-sm text-[var(--muted)]">
                  Estamos preparando tu consulta.
                </p>

                {!showFallback && <ConnectingDots />}
              </motion.div>

              <AnimatePresence>
                {showFallback && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="mt-6 flex flex-col gap-3"
                  >
                    <p className="text-xs text-[var(--muted)]">
                      No pudimos abrir WhatsApp automáticamente.
                    </p>
                    <Button
                      type="button"
                      variant="secondary"
                      size="md"
                      className="w-full"
                      onClick={() => {
                        window.open(
                          connectingUrl,
                          "_blank",
                          "noopener,noreferrer",
                        );
                        clearHandoff();
                      }}
                    >
                      Abrir WhatsApp
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && !connectingUrl && (
          <>
            <motion.button
              type="button"
              aria-label="Cerrar asistente"
              className="fixed inset-0 z-[60] bg-[var(--void)]/55 backdrop-blur-[2px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={backdropTransition}
              onClick={close}
            />

            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="whatsapp-assistant-title"
              className="fixed bottom-[5.5rem] right-4 z-[70] w-[min(calc(100vw-2rem),22rem)] sm:bottom-24 sm:right-6 sm:w-[24rem]"
              initial={{ opacity: 0, y: 28, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.96 }}
              transition={motionTransition}
            >
              <div
                className="overflow-hidden rounded-3xl border border-white/[0.12] bg-gradient-to-b from-white/[0.12] via-[rgba(157,78,221,0.14)] to-[rgba(0,180,216,0.08)] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.16),0_24px_56px_-12px_rgba(0,0,0,0.55),0_0_32px_rgba(157,78,221,0.1)] backdrop-blur-xl"
                onClick={(event) => event.stopPropagation()}
              >
                <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/[0.08] to-transparent" />

                <div className="relative px-4 pb-4 pt-4 sm:px-5 sm:pb-5 sm:pt-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl border border-white/[0.12] bg-white/[0.06] p-1.5">
                        <Image
                          src={siteConfig.logo}
                          alt=""
                          width={40}
                          height={40}
                          className="h-full w-full object-contain"
                        />
                      </div>
                      <div className="min-w-0 text-left">
                        <p
                          id="whatsapp-assistant-title"
                          className="text-sm font-semibold tracking-tight text-white"
                        >
                          {siteConfig.name}
                        </p>
                        <p className="text-[11px] text-[var(--muted)]">
                          Asistente de ventas
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={close}
                      aria-label="Cerrar"
                      className={getButtonClassName({
                        variant: "icon",
                        size: "icon",
                        className:
                          "h-9 w-9 shrink-0 border-white/[0.1] bg-white/[0.06] text-white hover:bg-white/10",
                      })}
                    >
                      <IconClose className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="mt-4 text-left">
                    <p className="text-base font-semibold text-white">Hola 👋</p>
                    <p className="mt-1 text-sm text-[var(--muted)]">
                      ¿Cómo podemos ayudarte?
                    </p>
                  </div>

                  <ul className="mt-4 flex flex-col gap-2">
                    {QUICK_REPLIES.map((option) => (
                      <li key={option.id}>
                        <button
                          type="button"
                          onClick={() => startHandoff(option.message)}
                          className={getButtonClassName({
                            variant: "secondary",
                            size: "surface",
                            rounded: "rounded-2xl",
                            className:
                              "card-tap w-full justify-start gap-3 px-4 py-3 text-left text-sm font-medium text-white",
                          })}
                        >
                          <span aria-hidden className="text-base leading-none">
                            {option.emoji}
                          </span>
                          <span>{option.label}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <button
        type="button"
        aria-label={
          open ? "Cerrar asistente de WhatsApp" : "Abrir asistente de WhatsApp"
        }
        aria-expanded={open}
        disabled={Boolean(connectingUrl)}
        onClick={() => setOpen((value) => !value)}
        className={`fixed bottom-6 right-6 z-[80] flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/30 transition-all duration-300 hover:scale-105 hover:shadow-xl disabled:pointer-events-none disabled:opacity-60 ${open ? "scale-95 ring-2 ring-white/25" : ""}`}
      >
        <WhatsAppGlyph />
      </button>
    </>
  );
}
