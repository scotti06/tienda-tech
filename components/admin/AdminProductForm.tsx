"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { categoryCatalog } from "@/lib/catalog";
import type { StoreProduct } from "@/lib/store/types";
import { AdminStockControls } from "@/components/admin/AdminStockControls";

type AdminProductFormProps = {
  mode: "create" | "edit";
  product?: StoreProduct;
};

type ProductFormState = {
  name: string;
  slug: string;
  categoryId: string;
  subcategory: string;
  description: string;
  price: string;
  originalPrice: string;
  cashPrice: string;
  stock: string;
  sku: string;
  brand: string;
  badge: string;
  installments: string;
  freeShipping: boolean;
  images: string[];
};

function getInitialState(product?: StoreProduct): ProductFormState {
  return {
    name: product?.name ?? "",
    slug: product?.slug ?? "",
    categoryId: product?.categoryId ?? categoryCatalog[0]?.id ?? "fundas",
    subcategory: product?.subcategory ?? "",
    description: product?.description ?? "",
    price: product?.price ? String(product.price) : "",
    originalPrice: product?.originalPrice ? String(product.originalPrice) : "",
    cashPrice: product?.cashPrice ? String(product.cashPrice) : "",
    stock: product?.stock !== undefined ? String(product.stock) : "0",
    sku: product?.sku ?? "",
    brand: product?.brand ?? "Techstylebv",
    badge: product?.badge ?? "",
    installments: product?.installments ?? "",
    freeShipping: Boolean(product?.freeShipping),
    images: product?.images?.length
      ? product.images
      : product?.image
        ? [product.image]
        : [],
  };
}

export function AdminProductForm({ mode, product }: AdminProductFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<ProductFormState>(() =>
    getInitialState(product),
  );
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const endpoint = useMemo(
    () =>
      mode === "create"
        ? "/api/admin/products"
        : `/api/admin/products/${product?.id}`,
    [mode, product?.id],
  );

  function updateField<K extends keyof ProductFormState>(
    key: K,
    value: ProductFormState[K],
  ) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");

    const body = new FormData();
    body.append("file", file);

    const response = await fetch("/api/admin/upload", {
      method: "POST",
      body,
    });

    setUploading(false);

    if (!response.ok) {
      setError("No se pudo subir la imagen.");
      return;
    }

    const data = (await response.json()) as { url: string };
    updateField("images", [...form.images, data.url]);
    event.target.value = "";
  }

  function removeImage(url: string) {
    updateField(
      "images",
      form.images.filter((image) => image !== url),
    );
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      ...form,
      price: Number(form.price),
      originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined,
      cashPrice: form.cashPrice ? Number(form.cashPrice) : undefined,
      stock: Number(form.stock),
      image: form.images[0],
    };

    const response = await fetch(endpoint, {
      method: mode === "create" ? "POST" : "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setSaving(false);

    if (!response.ok) {
      const data = (await response.json()) as { error?: string };
      setError(data.error ?? "No se pudo guardar el producto.");
      return;
    }

    router.push("/admin/productos");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="space-y-4 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5">
          <h2 className="text-base font-semibold text-white">Información básica</h2>

          <label className="block space-y-2">
            <span className="text-sm text-[var(--muted)]">Nombre</span>
            <input
              value={form.name}
              onChange={(event) => updateField("name", event.target.value)}
              className="admin-input"
              required
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm text-[var(--muted)]">Slug (URL)</span>
            <input
              value={form.slug}
              onChange={(event) => updateField("slug", event.target.value)}
              className="admin-input"
              placeholder="Se genera automáticamente si lo dejás vacío"
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block space-y-2">
              <span className="text-sm text-[var(--muted)]">Categoría</span>
              <select
                value={form.categoryId}
                onChange={(event) =>
                  updateField("categoryId", event.target.value)
                }
                className="admin-input"
              >
                {categoryCatalog.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="block space-y-2">
              <span className="text-sm text-[var(--muted)]">Subcategoría</span>
              <input
                value={form.subcategory}
                onChange={(event) =>
                  updateField("subcategory", event.target.value)
                }
                className="admin-input"
              />
            </label>
          </div>

          <label className="block space-y-2">
            <span className="text-sm text-[var(--muted)]">Descripción</span>
            <textarea
              value={form.description}
              onChange={(event) =>
                updateField("description", event.target.value)
              }
              className="admin-input min-h-28 resize-y"
            />
          </label>
        </section>

        <section className="space-y-4 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5">
          <h2 className="text-base font-semibold text-white">Precios y stock</h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block space-y-2">
              <span className="text-sm text-[var(--muted)]">Precio</span>
              <input
                type="number"
                min="0"
                value={form.price}
                onChange={(event) => updateField("price", event.target.value)}
                className="admin-input"
                required
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm text-[var(--muted)]">Precio anterior</span>
              <input
                type="number"
                min="0"
                value={form.originalPrice}
                onChange={(event) =>
                  updateField("originalPrice", event.target.value)
                }
                className="admin-input"
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm text-[var(--muted)]">Precio transferencia</span>
              <input
                type="number"
                min="0"
                value={form.cashPrice}
                onChange={(event) => updateField("cashPrice", event.target.value)}
                className="admin-input"
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm text-[var(--muted)]">Stock</span>
              <input
                type="number"
                min="0"
                value={form.stock}
                onChange={(event) => updateField("stock", event.target.value)}
                className="admin-input"
              />
            </label>
          </div>

          {mode === "edit" && product && (
            <AdminStockControls productId={product.id} stock={product.stock ?? 0} />
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block space-y-2">
              <span className="text-sm text-[var(--muted)]">SKU</span>
              <input
                value={form.sku}
                onChange={(event) => updateField("sku", event.target.value)}
                className="admin-input"
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm text-[var(--muted)]">Marca</span>
              <input
                value={form.brand}
                onChange={(event) => updateField("brand", event.target.value)}
                className="admin-input"
              />
            </label>
          </div>

          <label className="flex items-center gap-3 text-sm text-white">
            <input
              type="checkbox"
              checked={form.freeShipping}
              onChange={(event) =>
                updateField("freeShipping", event.target.checked)
              }
            />
            Envío gratis
          </label>
        </section>
      </div>

      <section className="space-y-4 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-semibold text-white">Imágenes</h2>
            <p className="text-sm text-[var(--muted)]">
              La primera imagen se usa como principal en el catálogo.
            </p>
          </div>
          <label className="inline-flex cursor-pointer items-center justify-center rounded-xl border border-white/[0.12] px-4 py-2 text-sm font-medium text-white hover:bg-white/[0.05]">
            {uploading ? "Subiendo..." : "Subir imagen"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleUpload}
              disabled={uploading}
            />
          </label>
        </div>

        {form.images.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {form.images.map((image, index) => (
              <div
                key={image}
                className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-3"
              >
                <div className="relative aspect-square overflow-hidden rounded-xl bg-[#111118]">
                  <Image
                    src={image}
                    alt={`Vista previa ${index + 1}`}
                    fill
                    className="object-contain p-2"
                    sizes="160px"
                  />
                </div>
                <div className="mt-3 flex items-center justify-between gap-2">
                  <span className="text-xs text-[var(--muted)]">
                    {index === 0 ? "Principal" : `Imagen ${index + 1}`}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeImage(image)}
                    className="text-xs text-red-200 hover:text-red-100"
                  >
                    Quitar
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="rounded-xl border border-dashed border-white/[0.12] px-4 py-8 text-center text-sm text-[var(--muted)]">
            Todavía no hay imágenes. Subí una para ver la vista previa.
          </p>
        )}
      </section>

      {error && (
        <p className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </p>
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button type="submit" variant="primary" size="lg" disabled={saving}>
          {saving
            ? "Guardando..."
            : mode === "create"
              ? "Crear producto"
              : "Guardar cambios"}
        </Button>
        <Button href="/admin/productos" variant="secondary" size="lg">
          Cancelar
        </Button>
      </div>
    </form>
  );
}
