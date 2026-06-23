"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";

const adjustments = [10, 5, 1, -1, -5, -10];

type AdminStockControlsProps = {
  productId: string;
  stock: number;
};

export function AdminStockControls({
  productId,
  stock,
}: AdminStockControlsProps) {
  const router = useRouter();
  const [loadingDelta, setLoadingDelta] = useState<number | null>(null);

  async function adjustStock(delta: number) {
    setLoadingDelta(delta);
    await fetch(`/api/admin/products/${productId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "adjust-stock", delta }),
    });
    setLoadingDelta(null);
    router.refresh();
  }

  return (
    <div className="rounded-xl border border-white/[0.08] bg-[#111118] p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-white">Control rápido de stock</p>
          <p className="text-xs text-[var(--muted)]">Stock actual: {stock}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {adjustments.map((delta) => (
            <Button
              key={delta}
              type="button"
              variant={delta > 0 ? "secondary" : "ghost"}
              size="compact"
              onClick={() => adjustStock(delta)}
              disabled={loadingDelta !== null}
            >
              {loadingDelta === delta ? "..." : delta > 0 ? `+${delta}` : String(delta)}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
