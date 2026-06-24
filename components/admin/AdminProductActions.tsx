"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";

type AdminProductActionsProps = {
  productId: string;
};

export function AdminProductActions({ productId }: AdminProductActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<"duplicate" | "delete" | null>(null);

  async function duplicateProduct() {
    setLoading("duplicate");
    await fetch(`/api/admin/products/${productId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "duplicate" }),
    });
    setLoading(null);
    router.refresh();
  }

  async function deleteProduct() {
    if (!window.confirm("¿Eliminar este producto del catálogo?")) return;
    setLoading("delete");
    await fetch(`/api/admin/products/${productId}`, { method: "DELETE" });
    setLoading(null);
    router.refresh();
  }

  return (
    <>
      <Button
        type="button"
        variant="secondary"
        size="compact"
        onClick={duplicateProduct}
        disabled={loading !== null}
      >
        {loading === "duplicate" ? "..." : "Duplicar"}
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="compact"
        onClick={deleteProduct}
        disabled={loading !== null}
      >
        {loading === "delete" ? "..." : "Eliminar"}
      </Button>
    </>
  );
}
