"use client";

import Link from "next/link";
import { categoryCatalog } from "@/lib/catalog";

type ShopFiltersProps = {
  activeCategoryId?: string | "all";
};

export function ShopFilters({ activeCategoryId = "all" }: ShopFiltersProps) {
  const pills = [
    { id: "all", label: "Todos", href: "/tienda" },
    ...categoryCatalog.map((c) => ({
      id: c.id,
      label: c.name,
      href: c.path,
    })),
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {pills.map((pill) => {
        const isActive =
          pill.id === activeCategoryId ||
          (activeCategoryId === "all" && pill.id === "all");
        return (
          <Link
            key={pill.id}
            href={pill.href}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition-all duration-300 ${
              isActive
                ? "border-transparent bg-gradient-brand text-white shadow-lg shadow-[var(--glow-purple)]"
                : "border-white/10 bg-white/[0.04] text-[var(--muted)] hover:border-[var(--brand-purple)]/30 hover:text-white"
            }`}
          >
            {pill.label}
          </Link>
        );
      })}
    </div>
  );
}
