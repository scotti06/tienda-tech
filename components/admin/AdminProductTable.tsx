import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/data";
import {
  getCategoryDisplayName,
  isProductActive,
} from "@/lib/admin/product-filters";
import { getStockLevel } from "@/lib/store/types";
import type { StoreProduct } from "@/lib/store/types";
import { AdminProductActions } from "@/components/admin/AdminProductActions";

type AdminProductTableProps = {
  products: StoreProduct[];
  emptyMessage?: string;
};

function stockBadge(stock: number) {
  const level = getStockLevel(stock);
  if (level === "out") {
    return {
      label: "Sin stock",
      className: "bg-red-500/15 text-red-200",
    };
  }
  if (level === "low") {
    return {
      label: "Stock bajo",
      className: "bg-amber-500/15 text-amber-100",
    };
  }
  return {
    label: "Disponible",
    className: "bg-emerald-500/15 text-emerald-100",
  };
}

export function AdminProductTable({
  products,
  emptyMessage = "No hay productos para mostrar.",
}: AdminProductTableProps) {
  if (products.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-white/[0.12] px-6 py-16 text-center">
        <p className="text-sm text-[var(--muted)]">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03]">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-white/[0.08] bg-white/[0.02] text-[var(--muted)]">
            <tr>
              <th className="px-4 py-3 font-medium">Producto</th>
              <th className="px-4 py-3 font-medium">Categoría</th>
              <th className="px-4 py-3 font-medium">Precio</th>
              <th className="px-4 py-3 font-medium">Stock</th>
              <th className="px-4 py-3 font-medium">Estado</th>
              <th className="px-4 py-3 font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => {
              const badge = stockBadge(product.stock ?? 0);
              const active = isProductActive(product);

              return (
                <tr
                  key={product.id}
                  className="border-b border-white/[0.06] last:border-b-0"
                >
                  <td className="px-4 py-4">
                    <div className="flex items-start gap-4">
                      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.06] sm:h-24 sm:w-24">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-contain p-2"
                          sizes="96px"
                        />
                      </div>
                      <div>
                        <p className="font-medium text-white">{product.name}</p>
                        <p className="text-xs text-[var(--muted)]">
                          SKU: {product.sku ?? "—"}
                          {product.brand ? ` · ${product.brand}` : ""}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-[var(--muted)]">
                    <p>{getCategoryDisplayName(product.categoryId)}</p>
                    {product.subcategory &&
                      product.subcategory !== product.category && (
                        <p className="mt-1 text-xs">{product.subcategory}</p>
                      )}
                  </td>
                  <td className="px-4 py-4 font-medium text-white">
                    {formatPrice(product.price)}
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                        product.stock <= 0
                          ? "bg-red-500/15 text-red-200"
                          : product.stock <= 10
                            ? "bg-amber-500/15 text-amber-100"
                            : "bg-emerald-500/15 text-emerald-100"
                      }`}
                    >
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-col gap-2">
                      <span
                        className={`inline-flex w-fit rounded-full px-2.5 py-1 text-xs font-medium ${
                          active
                            ? "bg-emerald-500/15 text-emerald-100"
                            : "bg-white/[0.06] text-[var(--muted)]"
                        }`}
                      >
                        {active ? "Activo" : "Inactivo"}
                      </span>
                      <span
                        className={`inline-flex w-fit rounded-full px-2.5 py-1 text-xs font-medium ${badge.className}`}
                      >
                        {badge.label}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-wrap gap-2">
                      <Link
                        href={`/admin/productos/${product.id}`}
                        className="rounded-lg border border-white/[0.12] px-3 py-1.5 text-xs font-medium text-white hover:bg-white/[0.05]"
                      >
                        Editar
                      </Link>
                      <AdminProductActions productId={product.id} />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
