"use client";

import { categoryCatalog } from "@/lib/catalog";
import { Button } from "@/components/ui/Button";

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
          <Button
            key={pill.id}
            href={pill.href}
            variant={isActive ? "primary" : "secondary"}
            size="filter"
          >
            {pill.label}
          </Button>
        );
      })}
    </div>
  );
}
