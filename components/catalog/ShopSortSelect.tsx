"use client";

import { shopSortOptions, type ShopSortOption } from "@/lib/shop";

type ShopSortSelectProps = {
  value: ShopSortOption;
  onChange: (value: ShopSortOption) => void;
  className?: string;
};

export function ShopSortSelect({
  value,
  onChange,
  className = "",
}: ShopSortSelectProps) {
  return (
    <div className={`flex min-w-0 flex-col gap-1.5 sm:items-end ${className}`.trim()}>
      <label htmlFor="shop-sort" className="text-[10px] font-semibold tracking-[0.15em] text-[var(--muted)] uppercase">
        Ordenar por
      </label>
      <div className="relative w-full sm:w-auto sm:min-w-[220px]">
        <select
          id="shop-sort"
          value={value}
          onChange={(e) => onChange(e.target.value as ShopSortOption)}
          className="card-tap h-10 w-full cursor-pointer appearance-none rounded-full border border-white/10 bg-white/[0.04] py-2 pl-4 pr-10 text-sm text-white transition-all duration-300 focus:border-[var(--brand-purple)]/40 focus:bg-white/[0.06] focus:outline-none focus:shadow-[0_0_0_3px_var(--glow-purple)]"
        >
          {shopSortOptions.map((option) => (
            <option
              key={option.value}
              value={option.value}
              className="bg-[var(--surface)] text-white"
            >
              {option.label}
            </option>
          ))}
        </select>
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-[var(--muted)]"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15M8.25 9L12 5.25 15.75 9" />
          </svg>
        </span>
      </div>
    </div>
  );
}
