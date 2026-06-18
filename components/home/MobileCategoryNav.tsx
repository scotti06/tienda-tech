"use client";

import type { HomeCategoryFilter } from "@/lib/home";
import { homeCategoryNav } from "@/lib/home";

type MobileCategoryNavProps = {
  activeCategory: HomeCategoryFilter;
  onCategoryChange: (category: HomeCategoryFilter) => void;
};

export function MobileCategoryNav({
  activeCategory,
  onCategoryChange,
}: MobileCategoryNavProps) {
  const handleSelect = (id: HomeCategoryFilter) => {
    onCategoryChange(id);
    document
      .getElementById("productos-destacados")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <nav
      aria-label="Filtrar por categoría"
      className="sticky top-[4.75rem] z-40 border-b border-white/[0.06] glass md:hidden"
    >
      <div className="scroll-snap-x hide-scrollbar flex gap-2 overflow-x-auto px-4 py-2.5 sm:top-[5.25rem]">
        {homeCategoryNav.map((item) => {
          const isActive = activeCategory === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleSelect(item.id)}
              aria-pressed={isActive}
              className={`card-tap scroll-snap-start shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all duration-300 ${
                isActive
                  ? "border-white/[0.15] bg-gradient-to-b from-white/[0.12] via-[rgba(157,78,221,0.16)] to-[rgba(0,180,216,0.1)] text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.14),0_8px_24px_-8px_rgba(0,0,0,0.35)]"
                  : "border-white/[0.08] bg-white/[0.04] text-[var(--muted)] hover:border-white/[0.12] hover:text-white"
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
