"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import { useEffect } from "react";
import { useCart } from "@/components/cart/CartProvider";
import { IconClose, IconWhatsApp } from "@/components/ui/Icons";
import {
  buildCartWhatsAppUrl,
  formatCartSubtotal,
  getCartSubtotal,
  scrollToCatalog,
  type CartItem,
} from "@/lib/cart";
import { formatPrice } from "@/lib/data";

const PREMIUM_EASE = [0.22, 1, 0.36, 1] as const;
const DRAWER_DURATION = 0.32;
const CONTENT_FADE_DELAY = 0.14;
const CONTENT_FADE_DURATION = 0.18;
const ITEM_STAGGER = 0.05;
const CARD_ANIM_DURATION = 0.36;
const IMAGE_ANIM_DURATION = 0.22;
const PRODUCT_IMAGE_SIZE = 90;

function hasFixedPrice(amount: number): boolean {
  return amount > 0;
}

type QuantityCapsuleProps = {
  quantity: number;
  productName: string;
  onDecrease: () => void;
  onIncrease: () => void;
  delay?: number;
};

function QuantityCapsule({
  quantity,
  productName,
  onDecrease,
  onIncrease,
  delay = 0.12,
}: QuantityCapsuleProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: reduceMotion ? 0.01 : 0.28,
        delay: reduceMotion ? 0 : delay,
        ease: PREMIUM_EASE,
      }}
      className="inline-flex items-center rounded-full border border-white/[0.06] px-0.5 py-0.5"
    >
      <button
        type="button"
        aria-label={`Reducir cantidad de ${productName}`}
        onClick={onDecrease}
        className="flex h-6 w-6 items-center justify-center rounded-full text-[13px] text-zinc-500 transition-all duration-200 hover:text-white hover:shadow-[0_0_10px_rgba(157,78,221,0.1)] active:scale-95 active:text-white active:shadow-[0_0_14px_rgba(157,78,221,0.14)]"
        style={{ transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)" }}
      >
        −
      </button>
      <span className="min-w-[1.125rem] px-1 text-center text-[13px] font-medium tabular-nums text-white">
        {quantity}
      </span>
      <button
        type="button"
        aria-label={`Aumentar cantidad de ${productName}`}
        onClick={onIncrease}
        className="flex h-6 w-6 items-center justify-center rounded-full text-[13px] text-zinc-500 transition-all duration-200 hover:text-white hover:shadow-[0_0_10px_rgba(157,78,221,0.1)] active:scale-95 active:text-white active:shadow-[0_0_14px_rgba(157,78,221,0.14)]"
        style={{ transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)" }}
      >
        +
      </button>
    </motion.div>
  );
}

function CartPriceAction({ item }: { item: CartItem }) {
  const lineTotal = item.price * item.quantity;

  if (hasFixedPrice(lineTotal || item.price)) {
    return (
      <span className="shrink-0 text-[14px] font-medium tracking-tight text-white/90">
        {formatPrice(lineTotal || item.price)}
      </span>
    );
  }

  return (
    <span className="inline-flex h-9 shrink-0 items-center rounded-full border border-white/[0.06] bg-white/[0.02] px-3.5 text-[13px] font-medium text-zinc-400 backdrop-blur-sm">
      Consultar →
    </span>
  );
}

function CartDrawerBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="absolute inset-0 bg-[#09090B]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_70%_at_50%_-20%,rgba(23,37,84,0.22),transparent_68%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_55%_45%_at_100%_100%,rgba(157,78,221,0.05),transparent_62%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_35%_at_0%_60%,rgba(30,58,138,0.06),transparent_70%)]" />
      <div className="absolute inset-0 opacity-30 backdrop-blur-[3px]" />
    </div>
  );
}

function CartDrawerHeader({ onClose }: { onClose: () => void }) {
  return (
    <header className="relative shrink-0 border-b border-white/[0.04] px-5 sm:px-6">
      <div className="flex h-[3.25rem] items-center justify-between">
        <h2 className="text-[16px] font-semibold leading-none tracking-tight text-white">
          Carrito
        </h2>
        <button
          type="button"
          aria-label="Cerrar carrito"
          onClick={onClose}
          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[12px] text-zinc-400 transition-all duration-200 hover:bg-white/[0.05] hover:text-white"
          style={{ transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)" }}
        >
          <IconClose className="h-[18px] w-[18px]" />
        </button>
      </div>
    </header>
  );
}

type CartLineItemProps = {
  item: CartItem;
  index: number;
  onDecrease: () => void;
  onIncrease: () => void;
};

function CartLineItem({ item, index, onDecrease, onIncrease }: CartLineItemProps) {
  const reduceMotion = useReducedMotion();
  const cardDelay = reduceMotion ? 0 : index * ITEM_STAGGER;
  const imageDelay = cardDelay + (reduceMotion ? 0 : 0.05);

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{
        duration: reduceMotion ? 0.01 : CARD_ANIM_DURATION,
        delay: cardDelay,
        ease: PREMIUM_EASE,
      }}
      className="flex items-center gap-6 overflow-visible rounded-[22px] border border-white/[0.05] bg-white/[0.018] py-3 pl-6 pr-4 backdrop-blur-sm"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: reduceMotion ? 0.01 : IMAGE_ANIM_DURATION,
          delay: imageDelay,
          ease: PREMIUM_EASE,
        }}
        className="relative shrink-0"
        style={{
          width: PRODUCT_IMAGE_SIZE,
          height: PRODUCT_IMAGE_SIZE,
          filter: "drop-shadow(0 6px 14px rgba(0,0,0,0.16))",
        }}
      >
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-contain object-center"
          sizes="90px"
        />
      </motion.div>

      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="space-y-0.5">
          <h3 className="truncate text-[15px] font-semibold leading-tight tracking-tight text-white">
            {item.name}
          </h3>
          <p className="truncate text-[13px] leading-tight text-zinc-500">
            {item.model ?? ""}
          </p>
        </div>

        <div className="flex items-center justify-between gap-3">
          <QuantityCapsule
            quantity={item.quantity}
            productName={item.name}
            onDecrease={onDecrease}
            onIncrease={onIncrease}
            delay={cardDelay + 0.12}
          />
          <CartPriceAction item={item} />
        </div>
      </div>
    </motion.article>
  );
}

function CartEmptyState({ onExplore }: { onExplore: () => void }) {
  const reduceMotion = useReducedMotion();

  return (
    <div className="flex flex-1 items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: reduceMotion ? 0.01 : 0.32,
          ease: PREMIUM_EASE,
        }}
        className="flex h-[40%] max-h-[40dvh] min-h-[220px] flex-col items-center justify-center text-center"
      >
        <ShoppingCart
          className="h-12 w-12 text-white/35"
          strokeWidth={1.4}
          aria-hidden
        />

        <h3 className="mt-3 text-[28px] font-bold leading-none tracking-[-0.02em] text-white">
          Carrito vacío
        </h3>

        <p className="mt-2 text-[14px] leading-none text-zinc-500">
          Agregá productos para comenzar.
        </p>

        <button
          type="button"
          onClick={onExplore}
          className="mt-4 inline-flex h-12 w-full max-w-[220px] items-center justify-center rounded-full border border-white/[0.06] bg-white/[0.03] px-5 text-[14px] font-medium tracking-tight text-white/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition-[border-color,background-color,transform] duration-200 hover:scale-[1.01] hover:border-white/[0.09] hover:bg-white/[0.05] active:scale-[0.98]"
          style={{ transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)" }}
        >
          Explorar
        </button>
      </motion.div>
    </div>
  );
}

export function CartDrawer() {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const { items, isOpen, closeCart, updateQuantity } = useCart();
  const duration = reduceMotion ? 0.01 : DRAWER_DURATION;
  const hasItems = items.length > 0;

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeCart();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, closeCart]);

  const handleExplore = () => {
    closeCart();
    window.setTimeout(() => scrollToCatalog(pathname), 180);
  };

  const handleWhatsApp = () => {
    if (!hasItems) return;
    window.open(buildCartWhatsAppUrl(items), "_blank", "noopener,noreferrer");
  };

  const showSubtotal = hasFixedPrice(getCartSubtotal(items));

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            role="button"
            tabIndex={-1}
            aria-label="Cerrar carrito"
            className="fixed inset-0 z-[55] bg-black/45"
            style={{
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration, ease: PREMIUM_EASE }}
            onClick={closeCart}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") closeCart();
            }}
          />

          <motion.aside
            aria-label="Carrito de compras"
            className="fixed inset-y-0 right-0 z-[58] flex h-[100dvh] w-full flex-col overflow-hidden border-l border-white/[0.06] shadow-[-24px_0_80px_rgba(0,0,0,0.55)] md:max-w-[380px] lg:max-w-[420px] lg:rounded-bl-[24px] lg:rounded-tl-[24px]"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration, ease: PREMIUM_EASE }}
          >
            <CartDrawerBackground />

            <motion.div
              className="relative flex h-full min-h-0 flex-col"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: reduceMotion ? 0.01 : CONTENT_FADE_DURATION,
                delay: reduceMotion ? 0 : CONTENT_FADE_DELAY,
                ease: PREMIUM_EASE,
              }}
            >
              <CartDrawerHeader onClose={closeCart} />

              {hasItems ? (
                <>
                  <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-4 pt-4 sm:px-6">
                    <div className="flex flex-col gap-4">
                      <AnimatePresence initial={false}>
                        {items.map((item, index) => (
                          <CartLineItem
                            key={item.id}
                            item={item}
                            index={index}
                            onDecrease={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            onIncrease={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                          />
                        ))}
                      </AnimatePresence>
                    </div>
                  </div>

                  <footer className="shrink-0 border-t border-white/[0.04] px-5 py-4 sm:px-6">
                    {showSubtotal && (
                      <div className="mb-4 flex items-center justify-between gap-4">
                        <span className="text-[12px] font-medium text-zinc-500">
                          Subtotal
                        </span>
                        <span className="text-[16px] font-semibold tracking-tight text-white">
                          {formatCartSubtotal(items)}
                        </span>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={handleWhatsApp}
                      className="inline-flex h-[50px] w-full items-center justify-center gap-2 rounded-full border border-[rgba(37,211,102,0.24)] bg-[rgba(37,211,102,0.14)] text-[14px] font-semibold tracking-tight text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] transition-[transform,box-shadow,border-color,background-color] duration-200 hover:scale-[1.01] hover:border-[rgba(37,211,102,0.32)] hover:bg-[rgba(37,211,102,0.18)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_0_24px_rgba(37,211,102,0.08)] active:scale-[0.98]"
                      style={{ transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)" }}
                    >
                      <IconWhatsApp className="h-4 w-4 opacity-90" />
                      Continuar por WhatsApp
                    </button>

                    <button
                      type="button"
                      onClick={closeCart}
                      className="mt-3 w-full text-center text-[13px] font-medium text-zinc-500 transition-colors duration-200 hover:text-white"
                    >
                      ← Seguir comprando
                    </button>
                  </footer>
                </>
              ) : (
                <CartEmptyState onExplore={handleExplore} />
              )}
            </motion.div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
