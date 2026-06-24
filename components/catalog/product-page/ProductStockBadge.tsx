import { getStockLevel } from "@/lib/store/types";

type ProductStockBadgeProps = {
  stock: number;
};

export function ProductStockBadge({ stock }: ProductStockBadgeProps) {
  const level = getStockLevel(stock);

  if (level === "out") {
    return (
      <span className="inline-flex items-center rounded-full bg-red-500/15 px-3 py-1 text-xs font-semibold text-red-200">
        Sin stock
      </span>
    );
  }

  if (level === "low") {
    return (
      <span className="inline-flex items-center rounded-full bg-amber-500/15 px-3 py-1 text-xs font-semibold text-amber-100">
        Quedan {stock} unidades
      </span>
    );
  }

  return (
    <span className="inline-flex items-center rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-100">
      En stock ({stock} disponibles)
    </span>
  );
}

export function getStockMessage(stock: number): string {
  const level = getStockLevel(stock);
  if (level === "out") {
    return "Producto momentáneamente agotado. Consultanos por reposición.";
  }
  if (level === "low") {
    return `Quedan pocas unidades (${stock}). Asegurá la tuya hoy.`;
  }
  return "Stock disponible para entrega inmediata o retiro en local.";
}
