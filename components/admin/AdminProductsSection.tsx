"use client";

import { useMemo, useState } from "react";
import {
  ADMIN_CATEGORY_FILTERS,
  ADMIN_STATUS_FILTERS,
  ADMIN_STOCK_FILTERS,
  filterAdminProducts,
  type AdminCategoryFilter,
  type AdminStatusFilter,
  type AdminStockFilter,
} from "@/lib/admin/product-filters";
import type { StoreProduct } from "@/lib/store/types";
import { AdminProductTable } from "@/components/admin/AdminProductTable";
import { IconSearch } from "@/components/ui/Icons";

type AdminProductsSectionProps = {
  products: StoreProduct[];
};

type FilterChipGroupProps<T extends string> = {
  label: string;
  value: T;
  options: { id: T; label: string }[];
  onChange: (value: T) => void;
};

function FilterChipGroup<T extends string>({
  label,
  value,
  options,
  onChange,
}: FilterChipGroupProps<T>) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold tracking-[0.12em] text-[var(--muted)] uppercase">
        {label}
      </p>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const active = value === option.id;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onChange(option.id)}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                active
                  ? "border-[var(--brand-cyan)]/40 bg-[var(--brand-cyan)]/10 text-white"
                  : "border-white/[0.1] bg-white/[0.03] text-[var(--muted)] hover:border-white/20 hover:text-white"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function AdminProductsSection({ products }: AdminProductsSectionProps) {
  const [query, setQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [categoryFilter, setCategoryFilter] =
    useState<AdminCategoryFilter>("all");
  const [stockFilter, setStockFilter] = useState<AdminStockFilter>("all");
  const [statusFilter, setStatusFilter] = useState<AdminStatusFilter>("all");

  const filteredProducts = useMemo(
    () =>
      filterAdminProducts(products, {
        query,
        category: categoryFilter,
        stock: stockFilter,
        status: statusFilter,
      }),
    [products, query, categoryFilter, stockFilter, statusFilter],
  );

  const hasActiveChipFilters =
    categoryFilter !== "all" ||
    stockFilter !== "all" ||
    statusFilter !== "all";

  const hasActiveFilters =
    query.trim().length > 0 || hasActiveChipFilters;

  function clearFilters() {
    setQuery("");
    setCategoryFilter("all");
    setStockFilter("all");
    setStatusFilter("all");
  }

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4 md:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <label className="block min-w-0 flex-1">
            <span className="sr-only">Buscar productos</span>
            <div className="admin-input flex items-center gap-3 py-0 focus-within:border-[var(--brand-cyan)]">
              <IconSearch className="h-5 w-5 shrink-0 text-[var(--muted)]" />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Buscar productos..."
                className="w-full bg-transparent py-3 text-sm text-white outline-none placeholder:text-[var(--muted)]"
              />
            </div>
          </label>

          <button
            type="button"
            onClick={() => setShowFilters((current) => !current)}
            aria-expanded={showFilters}
            className={`inline-flex shrink-0 items-center justify-center gap-2 rounded-full border px-5 py-3 text-sm font-medium transition-colors ${
              showFilters || hasActiveChipFilters
                ? "border-[var(--brand-cyan)]/40 bg-[var(--brand-cyan)]/10 text-white"
                : "border-white/[0.12] bg-white/[0.04] text-white hover:bg-white/[0.08]"
            }`}
          >
            Filtrar
            {hasActiveChipFilters && (
              <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--brand-cyan)] px-1.5 text-[10px] font-bold text-[#0b0b10]">
                !
              </span>
            )}
          </button>
        </div>

        {showFilters && (
          <div className="mt-5 space-y-4 border-t border-white/[0.06] pt-5">
            <FilterChipGroup
              label="Categoría"
              value={categoryFilter}
              options={ADMIN_CATEGORY_FILTERS}
              onChange={setCategoryFilter}
            />
            <div className="grid gap-4 md:grid-cols-2">
              <FilterChipGroup
                label="Stock"
                value={stockFilter}
                options={ADMIN_STOCK_FILTERS}
                onChange={setStockFilter}
              />
              <FilterChipGroup
                label="Estado"
                value={statusFilter}
                options={ADMIN_STATUS_FILTERS}
                onChange={setStatusFilter}
              />
            </div>
          </div>
        )}

        <div className="mt-5 flex flex-col gap-3 border-t border-white/[0.06] pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-[var(--muted)]">
            Mostrando{" "}
            <span className="font-semibold text-white">
              {filteredProducts.length}
            </span>{" "}
            de{" "}
            <span className="font-semibold text-white">{products.length}</span>{" "}
            productos
          </p>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="text-sm font-medium text-[var(--brand-cyan)] hover:text-white"
            >
              Limpiar filtros
            </button>
          )}
        </div>
      </div>

      <AdminProductTable
        products={filteredProducts}
        emptyMessage={
          hasActiveFilters
            ? "No hay productos que coincidan con la búsqueda o los filtros seleccionados."
            : "Todavía no hay productos cargados."
        }
      />
    </div>
  );
}
