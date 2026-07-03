"use client";

import { useId, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { VariantImageUpload } from "@/components/admin/VariantImageUpload";
import type { ProductVariantInput } from "@/lib/store/product-variant-types";
import { isSiliconeCaseProduct } from "@/lib/store/silicone-case-product";

type AdminColorVariantsSectionProps = {
  productName: string;
  productSlug: string;
  initialVariants?: ProductVariantInput[];
  onChange: (variants: ProductVariantInput[]) => void;
};

type DraftVariant = ProductVariantInput & {
  localId: string;
};

let draftCounter = 0;

function createLocalId(prefix = "draft") {
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

export function AdminColorVariantsSection({
  productName,
  productSlug,
  initialVariants = [],
  onChange,
}: AdminColorVariantsSectionProps) {
  const formId = useId();
  const [drafts, setDrafts] = useState<DraftVariant[]>(() =>
    initialVariants.map((variant) => createDraftVariant(variant)),
  );
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<DraftVariant>(() => createDraftVariant());

  const isVisible = isSiliconeCaseProduct({
    name: productName,
    slug: productSlug,
  });

  if (!isVisible) return null;

  function syncParent(nextDrafts: DraftVariant[]) {
    setDrafts(nextDrafts);
    onChange(toVariantInput(nextDrafts));
  }

  function resetForm() {
    setForm(createDraftVariant());
    setEditingId(null);
    setShowForm(false);
  }

  function handleSaveVariant() {
    if (!form.colorName.trim()) return;

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
      ? drafts.map((draft) =>
          draft.localId === editingId ? payload : draft,
        )
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

  function updateVariantImage(localId: string, image: string | null) {
    syncParent(
      drafts.map((draft) =>
        draft.localId === localId ? { ...draft, image } : draft,
      ),
    );
  }

  return (
    <section className="space-y-4 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-white">Variantes de color</h2>
          <p className="text-sm text-[var(--muted)]">
            Solo para Funda de silicona para iPhone. Cada color tiene su propio stock y foto.
          </p>
        </div>
        <Button
          type="button"
          variant="secondary"
          size="md"
          onClick={() => {
            setShowForm(true);
            setEditingId(null);
            setForm(createDraftVariant());
          }}
        >
          Agregar color
        </Button>
      </div>

      {showForm && (
        <div className="rounded-2xl border border-white/[0.08] bg-[#111118] p-4">
          <div className="grid gap-4">
            <div className="grid gap-4 md:grid-cols-[1fr,1fr,auto] md:items-end">
              <label className="block space-y-2" htmlFor={`${formId}-color-name`}>
                <span className="text-sm text-[var(--muted)]">Nombre del color</span>
                <input
                  id={`${formId}-color-name`}
                  value={form.colorName}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      colorName: event.target.value,
                    }))
                  }
                  className="admin-input"
                  placeholder="Azul"
                />
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block space-y-2" htmlFor={`${formId}-color-hex`}>
                  <span className="text-sm text-[var(--muted)]">Color</span>
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
                    className="h-11 w-full cursor-pointer rounded-xl border border-white/[0.12] bg-transparent"
                  />
                </label>

                <label className="block space-y-2" htmlFor={`${formId}-color-stock`}>
                  <span className="text-sm text-[var(--muted)]">Stock</span>
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
                  size="md"
                  onClick={handleSaveVariant}
                >
                  {editingId ? "Guardar" : "Agregar"}
                </Button>
                <Button type="button" variant="ghost" size="md" onClick={resetForm}>
                  Cancelar
                </Button>
              </div>
            </div>

            <div>
              <span className="mb-2 block text-sm text-[var(--muted)]">
                Foto de la variante
              </span>
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
        </div>
      )}

      {drafts.length > 0 ? (
        <ul className="space-y-3">
          {drafts.map((variant) => (
            <li
              key={variant.localId}
              className="flex flex-col gap-4 rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span
                    aria-hidden
                    className="h-8 w-8 shrink-0 rounded-full border border-white/20"
                    style={{ backgroundColor: variant.colorHex }}
                  />
                  {variant.image ? (
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-white/[0.12] bg-[#111118]">
                      <Image
                        src={variant.image}
                        alt={variant.colorName}
                        fill
                        className="object-contain p-1"
                        sizes="48px"
                      />
                    </div>
                  ) : null}
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{variant.colorName}</p>
                  <p className="text-xs text-[var(--muted)]">
                    {variant.colorHex} · Stock: {variant.stock}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:items-end">
                <VariantImageUpload
                  compact
                  image={variant.image}
                  colorHex={variant.colorHex}
                  onChange={(image) => updateVariantImage(variant.localId, image)}
                />
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
            </li>
          ))}
        </ul>
      ) : (
        <p className="rounded-xl border border-dashed border-white/[0.12] px-4 py-8 text-center text-sm text-[var(--muted)]">
          Todavía no hay colores cargados para esta funda.
        </p>
      )}
    </section>
  );
}
