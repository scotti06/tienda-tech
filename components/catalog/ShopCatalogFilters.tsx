"use client";

import type { ReactNode } from "react";
import {
  getSubcategoriesForGroup,
  shopGroups,
  type ShopFilterGroup,
  type ShopFilterSubcategory,
} from "@/lib/shop";

type ShopCatalogFiltersProps = {
  activeGroup: ShopFilterGroup;
  activeSubcategory: ShopFilterSubcategory;
  onGroupChange: (groupId: ShopFilterGroup) => void;
  onSubcategoryChange: (subcategoryId: ShopFilterSubcategory) => void;
  layout?: "inline" | "sticky-mobile";
};

const groupPills: { id: ShopFilterGroup; label: string }[] = [
  { id: "all", label: "Todos" },
  ...shopGroups.map((g) => ({ id: g.id as ShopFilterGroup, label: g.name })),
];

const filterRowClassName =
  "scroll-snap-x hide-scrollbar flex gap-2 overflow-x-auto md:flex-wrap md:overflow-visible";

function FilterPill({
  label,
  isActive,
  onClick,
}: {
  label: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isActive}
      className={`card-tap scroll-snap-start shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all duration-300 md:px-4 md:py-2 md:text-sm ${
        isActive
          ? "border-white/[0.15] bg-gradient-to-b from-white/[0.12] via-[rgba(157,78,221,0.16)] to-[rgba(0,180,216,0.1)] text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.14),0_8px_24px_-8px_rgba(0,0,0,0.35)]"
          : "border-white/[0.08] bg-white/[0.04] text-[var(--muted)] hover:border-white/[0.12] hover:text-white"
      }`}
    >
      {label}
    </button>
  );
}

function FilterPillRow({ children }: { children: ReactNode }) {
  return <div className={filterRowClassName}>{children}</div>;
}

function StickyFilterBars({
  activeGroup,
  activeSubcategory,
  onGroupChange,
  onSubcategoryChange,
}: Omit<ShopCatalogFiltersProps, "layout">) {
  const subcategories =
    activeGroup === "all" ? [] : getSubcategoriesForGroup(activeGroup);

  return (
    <nav
      aria-label="Filtrar catálogo"
      className="sticky top-[4.75rem] z-40 border-b border-white/[0.06] glass sm:top-[5.25rem]"
    >
      <div className="mx-auto max-w-7xl px-4 py-2.5 sm:px-6 lg:px-8">
        <div className="flex flex-col">
          <FilterPillRow>
            {groupPills.map((pill) => (
              <FilterPill
                key={pill.id}
                label={pill.label}
                isActive={activeGroup === pill.id}
                onClick={() => onGroupChange(pill.id)}
              />
            ))}
          </FilterPillRow>

          {activeGroup !== "all" && (
            <FilterPillRow>
              <FilterPill
                label="Todas"
                isActive={activeSubcategory === "all"}
                onClick={() => onSubcategoryChange("all")}
              />
              {subcategories.map((sub) => (
                <FilterPill
                  key={sub.id}
                  label={sub.name}
                  isActive={activeSubcategory === sub.id}
                  onClick={() => onSubcategoryChange(sub.id)}
                />
              ))}
            </FilterPillRow>
          )}
        </div>
      </div>
    </nav>
  );
}

function FilterContent({
  activeGroup,
  activeSubcategory,
  onGroupChange,
  onSubcategoryChange,
}: Omit<ShopCatalogFiltersProps, "layout">) {
  const subcategories =
    activeGroup === "all"
      ? getSubcategoriesForGroup("all")
      : getSubcategoriesForGroup(activeGroup);

  return (
    <div className="space-y-3">
      <div>
        <p className="mb-2 text-[10px] font-semibold tracking-[0.15em] text-[var(--muted)] uppercase">
          Categoría
        </p>
        <FilterPillRow>
          {groupPills.map((pill) => (
            <FilterPill
              key={pill.id}
              label={pill.label}
              isActive={activeGroup === pill.id}
              onClick={() => onGroupChange(pill.id)}
            />
          ))}
        </FilterPillRow>
      </div>

      <div>
        <p className="mb-2 text-[10px] font-semibold tracking-[0.15em] text-[var(--muted)] uppercase">
          Subcategoría
        </p>
        <FilterPillRow>
          <FilterPill
            label="Todas"
            isActive={activeSubcategory === "all"}
            onClick={() => onSubcategoryChange("all")}
          />
          {subcategories.map((sub) => (
            <FilterPill
              key={sub.id}
              label={sub.name}
              isActive={activeSubcategory === sub.id}
              onClick={() => onSubcategoryChange(sub.id)}
            />
          ))}
        </FilterPillRow>
      </div>
    </div>
  );
}

export function ShopCatalogFilters({
  activeGroup,
  activeSubcategory,
  onGroupChange,
  onSubcategoryChange,
  layout = "inline",
}: ShopCatalogFiltersProps) {
  if (layout === "sticky-mobile") {
    return (
      <StickyFilterBars
        activeGroup={activeGroup}
        activeSubcategory={activeSubcategory}
        onGroupChange={onGroupChange}
        onSubcategoryChange={onSubcategoryChange}
      />
    );
  }

  return (
    <div className="hidden md:block">
      <FilterContent
        activeGroup={activeGroup}
        activeSubcategory={activeSubcategory}
        onGroupChange={onGroupChange}
        onSubcategoryChange={onSubcategoryChange}
      />
    </div>
  );
}

export function ShopCatalogFiltersMobileSubcategories(
  _props: Pick<
    ShopCatalogFiltersProps,
    "activeGroup" | "activeSubcategory" | "onSubcategoryChange"
  >,
) {
  return null;
}

export function ShopCatalogFiltersDesktop(
  _props: Omit<ShopCatalogFiltersProps, "layout">,
) {
  return null;
}
