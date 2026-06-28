"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { shopSortOptions, type ShopSortOption } from "@/lib/shop";

type ShopSortSelectProps = {
  value: ShopSortOption;
  onChange: (value: ShopSortOption) => void;
  className?: string;
};

const PREMIUM_EASE = [0.22, 1, 0.36, 1] as const;

const triggerBaseClass =
  "card-tap relative flex h-11 min-h-[44px] w-full items-center rounded-full border border-white/[0.08] bg-white/[0.04] py-2 pl-4 pr-11 text-left text-sm font-semibold text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04),0_8px_24px_-12px_rgba(0,0,0,0.45)] backdrop-blur-xl transition-all duration-300 hover:border-white/[0.14] hover:bg-white/[0.06] hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06),0_10px_28px_-10px_rgba(157,78,221,0.18)] focus-visible:border-[rgba(157,78,221,0.28)] focus-visible:bg-white/[0.06] focus-visible:outline-none focus-visible:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08),0_0_0_3px_var(--glow-purple),0_12px_32px_-12px_rgba(157,78,221,0.22)] active:scale-[0.99]";

const triggerOpenClass =
  "border-white/[0.15] bg-gradient-to-b from-white/[0.1] via-[rgba(157,78,221,0.12)] to-[rgba(0,180,216,0.06)] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1),0_12px_32px_-12px_rgba(157,78,221,0.2)]";

const panelClass =
  "absolute left-0 right-0 z-50 mt-2 overflow-hidden rounded-2xl border border-white/[0.1] bg-[rgba(8,8,12,0.82)] p-1.5 shadow-[0_18px_48px_-12px_rgba(0,0,0,0.65),0_0_32px_-8px_rgba(157,78,221,0.14)] backdrop-blur-2xl sm:left-auto sm:right-0 sm:min-w-full";

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      className={`h-4 w-4 text-[var(--muted)] transition-transform duration-300 ${
        open ? "rotate-180 text-white/80" : ""
      }`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8.25 15L12 18.75 15.75 15M8.25 9L12 5.25 15.75 9"
      />
    </svg>
  );
}

export function ShopSortSelect({
  value,
  onChange,
  className = "",
}: ShopSortSelectProps) {
  const reduceMotion = useReducedMotion();
  const baseId = useId();
  const listboxId = `${baseId}-listbox`;
  const labelId = `${baseId}-label`;
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(() =>
    shopSortOptions.findIndex((option) => option.value === value),
  );

  const selectedLabel =
    shopSortOptions.find((option) => option.value === value)?.label ??
    "Destacados";

  const close = useCallback(() => setOpen(false), []);

  const selectOption = useCallback(
    (optionValue: ShopSortOption) => {
      onChange(optionValue);
      close();
    },
    [close, onChange],
  );

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        close();
      }
    };

    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") close();
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [close, open]);

  useEffect(() => {
    const index = shopSortOptions.findIndex((option) => option.value === value);
    if (index >= 0) setHighlightIndex(index);
  }, [value]);

  const handleTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setOpen((current) => !current);
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setOpen(true);
      setHighlightIndex((current) =>
        Math.min(current + 1, shopSortOptions.length - 1),
      );
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setOpen(true);
      setHighlightIndex((current) => Math.max(current - 1, 0));
    }
  };

  const handleListKeyDown = (event: KeyboardEvent<HTMLUListElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setHighlightIndex((current) =>
        Math.min(current + 1, shopSortOptions.length - 1),
      );
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setHighlightIndex((current) => Math.max(current - 1, 0));
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      const option = shopSortOptions[highlightIndex];
      if (option) selectOption(option.value);
      return;
    }

    if (event.key === "Home") {
      event.preventDefault();
      setHighlightIndex(0);
      return;
    }

    if (event.key === "End") {
      event.preventDefault();
      setHighlightIndex(shopSortOptions.length - 1);
    }
  };

  return (
    <div
      ref={rootRef}
      className={`flex min-w-0 flex-col gap-1.5 sm:items-end ${className}`.trim()}
    >
      <span
        id={labelId}
        className="text-[10px] font-semibold tracking-[0.15em] text-[var(--muted)] uppercase"
      >
        Ordenar por
      </span>

      <div className="relative w-full sm:w-auto sm:min-w-[220px]">
        <button
          type="button"
          id={`${baseId}-trigger`}
          aria-labelledby={labelId}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={open ? listboxId : undefined}
          onClick={() => setOpen((current) => !current)}
          onKeyDown={handleTriggerKeyDown}
          className={`${triggerBaseClass} ${open ? triggerOpenClass : ""}`}
          style={{ transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)" }}
        >
          <span className="truncate">{selectedLabel}</span>
          <span className="pointer-events-none absolute inset-y-0 right-3.5 flex items-center">
            <ChevronIcon open={open} />
          </span>
        </button>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={
                reduceMotion ? { opacity: 1 } : { opacity: 0, y: -6, scale: 0.98 }
              }
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={
                reduceMotion ? { opacity: 0 } : { opacity: 0, y: -4, scale: 0.99 }
              }
              transition={{
                duration: reduceMotion ? 0.01 : 0.22,
                ease: PREMIUM_EASE,
              }}
              className={panelClass}
            >
              <ul
                id={listboxId}
                role="listbox"
                aria-labelledby={labelId}
                tabIndex={-1}
                onKeyDown={handleListKeyDown}
                className="max-h-[min(18rem,60dvh)] space-y-1 overflow-y-auto"
              >
                {shopSortOptions.map((option, index) => {
                  const isSelected = option.value === value;
                  const isHighlighted = index === highlightIndex;

                  return (
                    <li key={option.value} role="presentation">
                      <button
                        type="button"
                        role="option"
                        aria-selected={isSelected}
                        onMouseEnter={() => setHighlightIndex(index)}
                        onClick={() => selectOption(option.value)}
                        className={`card-tap flex min-h-[44px] w-full items-center rounded-xl px-4 py-3 text-left text-sm font-medium transition-all duration-300 ${
                          isSelected
                            ? "border border-white/[0.12] bg-gradient-to-b from-white/[0.12] via-[rgba(157,78,221,0.16)] to-[rgba(0,180,216,0.1)] text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.12)]"
                            : isHighlighted
                              ? "bg-white/[0.07] text-white"
                              : "text-zinc-300 hover:bg-white/[0.06] hover:text-white"
                        }`}
                        style={{
                          transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
                        }}
                      >
                        <span className="truncate">{option.label}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
