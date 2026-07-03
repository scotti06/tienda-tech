"use client";

import { useEffect, useId, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { VariantImageUpload } from "@/components/admin/VariantImageUpload";
import type { ProductVariantInput } from "@/lib/store/product-variant-types";

const stockAdjustments = [10, 5, 1, -1, -5, -10];

type AdminModelColorVariantsProps = {
  modelName: string;
  variants: ProductVariantInput[];
  onChange: (variants: ProductVariantInput[]) => void;
};

type DraftVariant = ProductVariantInput & {
  localId: string;
};

let draftCounter = 0;

function createLocalId(prefix = "variant") {
  draftCounter += 1;
  return `${prefix}-${draftCounter}`;
}

function createDraftVariant(
  partial?: Partial<ProductVariantInput>,
  localId?: string,
): DraftVariant {
  return {
    localId: localId ?? partial?.id ?? createLocalId(),
    id: partial?.id,
    colorName: partial?.colorName ?? "",
    colorHex: partial?.colorHex ?? "#3B82F6",
    stock: partial?.stock ?? 0,
    active: partial?.active !== false,
    image: partial?.image ?? null,
  };
}

function toVariantInput(drafts: DraftVariant[]): ProductVariantInput[] {
  return drafts.map(({ id, colorName, colorHex, stock, active, image }) => ({
    id,
    colorName,
    colorHex,
    stock,
    active,
    image,
  }));
}

export function sumVariantStock(variants: ProductVariantInput[]): number {
  return variants
    .filter((variant) => variant.active !== false)
    .reduce((sum, variant) => sum + Math.max(0, Number(variant.stock) || 0), 0);
}

export function AdminModelColorVariants({
  modelName,
  variants,
  onChange,
}: AdminModelColorVariantsProps) {
  const formId = useId();
  const [drafts, setDrafts] = useState<DraftVariant[]>(() =>
    variants.map((variant) => createDraftVariant(variant)),
  );
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<DraftVariant>(() => createDraftVariant());
  const [formError, setFormError] = useState("");

  const variantsKey = JSON.stringify(
    variants.map((variant) => ({
      id: variant.id,
      colorName: variant.colorName,
      colorHex: variant.colorHex,
      stock: variant.stock,
      active: variant.active,
      image: variant.image,
    })),
  );

  useEffect(() => {
    setDrafts(variants.map((variant) => createDraftVariant(variant)));
  }, [variantsKey]);

  function syncParent(nextDrafts: DraftVariant[]) {
    setDrafts(nextDrafts);
    onChange(toVariantInput(nextDrafts));
  }

  function resetForm() {
    setForm(createDraftVariant());
    setEditingId(null);
    setShowForm(false);
    setFormError("");
  }

  function handleSaveVariant() {
    if (!form.colorName.trim()) {
      setFormError("Ingresá un nombre para el color (ej. Azul, Rojo).");
      return;
    }

    setFormError("");

    const existing = editingId
      ? drafts.find((draft) => draft.localId === editingId)
      : undefined;

    const payload = createDraftVariant(
      {
        id: existing?.id,
        colorName: form.colorName.trim(),
        colorHex: form.colorHex,
        stock: Number(form.stock) || 0,
        active: form.active !== false,
        image: form.image ?? existing?.image ?? null,
      },
      editingId ?? undefined,
    );

    const nextDrafts = editingId
      ? drafts.map((draft) => (draft.localId === editingId ? payload : draft))
      : [...drafts, payload];

    syncParent(nextDrafts);
    resetForm();
  }

  function handleEdit(localId: string) {
    const draft = drafts.find((item) => item.localId === localId);
    if (!draft) return;
    setEditingId(localId);
    setForm({ ...draft });
    setShowForm(true);
  }

  function handleDelete(localId: string) {
    syncParent(drafts.filter((draft) => draft.localId !== localId));
    if (editingId === localId) resetForm();
  }

  function adjustVariantStock(localId: string, delta: number) {
    syncParent(
      drafts.map((draft) =>
        draft.localId === localId
          ? {
              ...draft,
              stock: Math.max(0, (Number(draft.stock) || 0) + delta),
            }
          : draft,
      ),
    );
  }

  return (
    <div className="mt-4 space-y-3 rounded-xl border border-white/[0.08] bg-[#0d0d12] p-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-white">Colores — {modelName}</p>
          <p className="text-xs text-[var(--muted)]">
            Stock del modelo: {sumVariantStock(toVariantInput(drafts))} unidades
            {" · "}
            Guardá el producto para persistir los colores.
          </p>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="compact"
          onClick={() => {
            setShowForm(true);
            setEditingId(null);
            setForm(createDraftVariant());
            setFormError("");
          }}
        >
          Agregar color
        </Button>
      </div>

      {showForm && (
        <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-3">
          <div className="grid gap-3 md:grid-cols-[1fr,auto,auto] md:items-end">
            <label className="block space-y-2" htmlFor={`${formId}-color-name`}>
              <span className="text-xs text-[var(--muted)]">Nombre del color</span>
              <input
                id={`${formId}-color-name`}
                value={form.colorName}
                onChange={(event) => {
                  setFormError("");
                  setForm((current) => ({
                    ...current,
                    colorName: event.target.value,
                  }));
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    handleSaveVariant();
                  }
                }}
                className="admin-input"
                placeholder="Azul"
                required
              />
            </label>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block space-y-2" htmlFor={`${formId}-color-hex`}>
                <span className="text-xs text-[var(--muted)]">Color</span>
                <input
                  id={`${formId}-color-hex`}
                  type="color"
                  value={form.colorHex}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      colorHex: event.target.value,
                    }))
                  }
                  className="h-10 w-full cursor-pointer rounded-xl border border-white/[0.12] bg-transparent"
                />
              </label>

              <label className="block space-y-2" htmlFor={`${formId}-color-stock`}>
                <span className="text-xs text-[var(--muted)]">Stock</span>
                <input
                  id={`${formId}-color-stock`}
                  type="number"
                  min="0"
                  value={form.stock}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      stock: Number(event.target.value),
                    }))
                  }
                  className="admin-input"
                />
              </label>
            </div>

            <div className="flex gap-2 md:justify-end">
              <Button
                type="button"
                variant="primary"
                size="compact"
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  handleSaveVariant();
                }}
              >
                {editingId ? "Guardar" : "Crear color"}
              </Button>
              <Button type="button" variant="ghost" size="compact" onClick={resetForm}>
                Cancelar
              </Button>
            </div>
          </div>

          {formError && (
            <p className="mt-3 text-xs text-red-300">{formError}</p>
          )}

          <div className="mt-3">
            <VariantImageUpload
              image={form.image}
              colorHex={form.colorHex}
              onChange={(image) =>
                setForm((current) => ({
                  ...current,
                  image,
                }))
              }
            />
          </div>
        </div>
      )}

      {drafts.length > 0 ? (
        <ul className="space-y-2">
          {drafts.map((variant) => (
            <li
              key={variant.localId}
              className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-3"
            >
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center gap-3">
                  <span
                    aria-hidden
                    className="h-7 w-7 shrink-0 rounded-full border border-white/20"
                    style={{ backgroundColor: variant.colorHex }}
                  />
                  {variant.image ? (
                    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-white/[0.12] bg-[#111118]">
                      <Image
                        src={variant.image}
                        alt={variant.colorName}
                        fill
                        className="object-contain p-1"
                        sizes="40px"
                      />
                    </div>
                  ) : null}
                  <div>
                    <p className="text-sm font-medium text-white">{variant.colorName}</p>
                    <p className="text-xs text-[var(--muted)]">Stock: {variant.stock}</p>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex flex-wrap gap-1.5">
                    {stockAdjustments.map((delta) => (
                      <Button
                        key={delta}
                        type="button"
                        variant={delta > 0 ? "secondary" : "ghost"}
                        size="compact"
                        onClick={() => adjustVariantStock(variant.localId, delta)}
                      >
                        {delta > 0 ? `+${delta}` : String(delta)}
                      </Button>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="compact"
                      onClick={() => handleEdit(variant.localId)}
                    >
                      Editar
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="compact"
                      onClick={() => handleDelete(variant.localId)}
                    >
                      Eliminar
                    </Button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="rounded-lg border border-dashed border-white/[0.1] px-3 py-4 text-center text-xs text-[var(--muted)]">
          Sin colores para este modelo.
        </p>
      )}
    </div>
  );
}
