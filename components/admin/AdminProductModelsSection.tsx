"use client";

import { useId, useMemo, useRef, useState, Fragment } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { IPHONE_MODEL_PRESETS } from "@/lib/store/iphone-model-presets";
import { isFundasProduct } from "@/lib/store/fundas-product";
import type { ProductModelInput } from "@/lib/store/product-model-types";
import type { ProductVariantInput } from "@/lib/store/product-variant-types";
import {
  AdminModelColorVariants,
  sumVariantStock,
} from "@/components/admin/AdminModelColorVariants";

const stockAdjustments = [10, 5, 1, -1, -5, -10];

type AdminProductModelsSectionProps = {
  mode: "create" | "edit";
  productId?: string;
  categoryId: string;
  productName?: string;
  productSlug?: string;
  productSubcategory?: string;
  isSiliconeCase?: boolean;
  initialModels?: ProductModelInput[];
  onChange: (models: ProductModelInput[]) => void;
  onTotalStockChange: (totalStock: number) => void;
};

type DraftModel = ProductModelInput & {
  localId: string;
};

let draftCounter = 0;

function createLocalId(prefix = "model") {
  draftCounter += 1;
  return `${prefix}-${draftCounter}`;
}

function createDraftModel(
  partial?: Partial<ProductModelInput>,
  localId?: string,
): DraftModel {
  return {
    localId: localId ?? partial?.id ?? createLocalId(),
    id: partial?.id,
    modelName: partial?.modelName ?? "",
    stock: partial?.stock ?? 0,
    active: partial?.active !== false,
    variants: partial?.variants ?? [],
  };
}

function toModelInput(drafts: DraftModel[]): ProductModelInput[] {
  return drafts.map(({ id, modelName, stock, active, variants }) => ({
    id,
    modelName,
    stock,
    active,
    variants,
  }));
}

function sumActiveStock(
  drafts: DraftModel[],
  isSiliconeCase: boolean,
): number {
  if (isSiliconeCase) {
    return drafts
      .filter((model) => model.active !== false)
      .reduce(
        (sum, model) => sum + sumVariantStock(model.variants ?? []),
        0,
      );
  }

  return drafts
    .filter((model) => model.active !== false)
    .reduce((sum, model) => sum + Math.max(0, Number(model.stock) || 0), 0);
}

function getModelStockDisplay(
  model: DraftModel,
  isSiliconeCase: boolean,
): number {
  if (isSiliconeCase) {
    return sumVariantStock(model.variants ?? []);
  }

  return model.stock;
}

export function AdminProductModelsSection({
  mode,
  productId,
  categoryId,
  productName = "",
  productSlug = "",
  productSubcategory = "",
  isSiliconeCase = false,
  initialModels = [],
  onChange,
  onTotalStockChange,
}: AdminProductModelsSectionProps) {
  const router = useRouter();
  const formId = useId();
  const listId = `${formId}-iphone-models`;
  const [drafts, setDrafts] = useState<DraftModel[]>(() =>
    initialModels.map((model) => createDraftModel(model)),
  );
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<DraftModel>(() => createDraftModel());
  const [loadingModelId, setLoadingModelId] = useState<string | null>(null);
  const [loadingDelta, setLoadingDelta] = useState<number | null>(null);
  const [formError, setFormError] = useState("");
  const [savingModel, setSavingModel] = useState(false);
  const modelNameRef = useRef<HTMLInputElement>(null);
  const stockRef = useRef<HTMLInputElement>(null);

  const isVisible =
    mode === "edit" &&
    isFundasProduct({
      categoryId,
      name: productName,
      slug: productSlug,
      subcategory: productSubcategory,
    });

  const presetOptions = useMemo(() => {
    const existing = new Set(
      drafts.map((draft) => draft.modelName.trim().toLowerCase()),
    );
    return IPHONE_MODEL_PRESETS.filter(
      (preset) => !existing.has(preset.toLowerCase()),
    );
  }, [drafts]);

  if (!isVisible) return null;

  function syncParent(nextDrafts: DraftModel[]) {
    const models = toModelInput(nextDrafts);
    setDrafts(nextDrafts);
    onChange(models);
    onTotalStockChange(sumActiveStock(nextDrafts, isSiliconeCase));
  }

  function updateModelVariants(
    localId: string,
    variants: ProductVariantInput[],
  ) {
    const nextDrafts = drafts.map((draft) =>
      draft.localId === localId ? { ...draft, variants } : draft,
    );
    syncParent(nextDrafts);
  }

  function resetForm() {
    setForm(createDraftModel());
    setEditingId(null);
    setShowForm(false);
    setFormError("");
  }

  function readFormValues() {
    const modelName = (form.modelName || modelNameRef.current?.value || "").trim();
    const stock = Number(form.stock ?? stockRef.current?.value ?? 0);

    return {
      modelName,
      stock: Number.isFinite(stock) ? Math.max(0, stock) : 0,
    };
  }

  async function persistModels(nextDrafts: DraftModel[]) {
    if (!productId) {
      syncParent(nextDrafts);
      return true;
    }

    const models = toModelInput(nextDrafts);
    const response = await fetch(`/api/admin/products/${productId}/models`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        models,
        syncVariantsPerModel: isSiliconeCase,
      }),
    });

    if (!response.ok) {
      const data = (await response.json()) as { error?: string };
      setFormError(data.error ?? "No se pudieron guardar los modelos.");
      return false;
    }

    const data = (await response.json()) as {
      models: Array<{
        id: string;
        modelName: string;
        stock: number;
        active: boolean;
        variants?: ProductVariantInput[];
      }>;
      totalStock: number;
    };

    const syncedDrafts = data.models.map((model) =>
      createDraftModel({
        id: model.id,
        modelName: model.modelName,
        stock: model.stock,
        active: model.active,
        variants: model.variants ?? [],
      }),
    );

    syncParent(syncedDrafts);
    onTotalStockChange(data.totalStock);
    router.refresh();
    return true;
  }

  async function handleSaveModel() {
    setFormError("");
    const { modelName, stock } = readFormValues();

    if (!modelName) {
      setFormError("Ingresá un modelo de iPhone.");
      return;
    }

    const duplicate = drafts.some(
      (draft) =>
        draft.modelName.trim().toLowerCase() === modelName.toLowerCase() &&
        draft.localId !== editingId,
    );

    if (duplicate) {
      setFormError("Ese modelo ya está cargado.");
      return;
    }

    const existing = editingId
      ? drafts.find((draft) => draft.localId === editingId)
      : undefined;

    const payload = createDraftModel(
      {
        id: existing?.id,
        modelName,
        stock: isSiliconeCase ? 0 : stock,
        active: form.active !== false,
        variants: existing?.variants ?? [],
      },
      editingId ?? undefined,
    );

    const nextDrafts = editingId
      ? drafts.map((draft) => (draft.localId === editingId ? payload : draft))
      : [...drafts, payload];

    setSavingModel(true);
    const saved = await persistModels(nextDrafts);
    setSavingModel(false);

    if (!saved) return;

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
    const nextDrafts = drafts.filter((draft) => draft.localId !== localId);
    void persistModels(nextDrafts).then((saved) => {
      if (!saved) return;
      if (editingId === localId) resetForm();
    });
  }

  async function adjustModelStock(model: DraftModel, delta: number) {
    if (!productId || !model.id) {
      const nextDrafts = drafts.map((draft) =>
        draft.localId === model.localId
          ? {
              ...draft,
              stock: Math.max(0, (Number(draft.stock) || 0) + delta),
            }
          : draft,
      );
      syncParent(nextDrafts);
      return;
    }

    setLoadingModelId(model.id);
    setLoadingDelta(delta);

    const response = await fetch(`/api/admin/products/${productId}/models`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "adjust-stock",
        modelId: model.id,
        delta,
      }),
    });

    setLoadingModelId(null);
    setLoadingDelta(null);

    if (!response.ok) return;

    const data = (await response.json()) as {
      model: { id: string; modelName: string; stock: number; active: boolean };
      totalStock: number;
    };

    const nextDrafts = drafts.map((draft) =>
      draft.id === data.model.id
        ? { ...draft, stock: data.model.stock }
        : draft,
    );

    syncParent(nextDrafts);
    onTotalStockChange(data.totalStock);
    router.refresh();
  }

  function updateModelName(value: string) {
    setFormError("");
    setForm((current) => ({
      ...current,
      modelName: value,
    }));
  }

  function updateModelStock(value: number) {
    setForm((current) => ({
      ...current,
      stock: value,
    }));
  }

  return (
    <section className="space-y-4 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-white">Modelos de iPhone</h2>
          <p className="text-sm text-[var(--muted)]">
            {isSiliconeCase
              ? "Gestioná modelos de iPhone y sus colores con stock independiente. El stock total se calcula automáticamente."
              : "Gestioná el stock por modelo compatible. El stock total del producto se calcula automáticamente."}
          </p>
        </div>
        <Button
          type="button"
          variant="secondary"
          size="md"
          onClick={() => {
            setShowForm(true);
            setEditingId(null);
            setForm(createDraftModel());
          }}
        >
          Crear modelo
        </Button>
      </div>

      {showForm && (
        <div className="rounded-2xl border border-white/[0.08] bg-[#111118] p-4">
          <div className="grid gap-4 md:grid-cols-[1fr,auto,auto] md:items-end">
            <label className="block space-y-2" htmlFor={`${formId}-model-name`}>
              <span className="text-sm text-[var(--muted)]">Modelo de iPhone</span>
              <input
                id={`${formId}-model-name`}
                ref={modelNameRef}
                list={listId}
                value={form.modelName}
                onChange={(event) => updateModelName(event.target.value)}
                onInput={(event) => {
                  const value = (event.target as HTMLInputElement).value;
                  updateModelName(value);
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    void handleSaveModel();
                  }
                }}
                className="admin-input"
                placeholder="iPhone 15 Pro Max"
              />
              <datalist id={listId}>
                {presetOptions.map((preset) => (
                  <option key={preset} value={preset} />
                ))}
              </datalist>
            </label>

            {!isSiliconeCase && (
              <label className="block space-y-2" htmlFor={`${formId}-model-stock`}>
                <span className="text-sm text-[var(--muted)]">Stock</span>
                <input
                  id={`${formId}-model-stock`}
                  ref={stockRef}
                  type="number"
                  min="0"
                  value={form.stock}
                  onChange={(event) =>
                    updateModelStock(Number(event.target.value))
                  }
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      void handleSaveModel();
                    }
                  }}
                  className="admin-input"
                />
              </label>
            )}

            <div className="flex flex-col gap-2 md:justify-end">
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="primary"
                  size="md"
                  disabled={savingModel}
                  onClick={() => void handleSaveModel()}
                >
                  {savingModel
                    ? "Guardando..."
                    : editingId
                      ? "Guardar"
                      : "Crear modelo"}
                </Button>
                <Button type="button" variant="ghost" size="md" onClick={resetForm}>
                  Cancelar
                </Button>
              </div>
              {formError && (
                <p className="text-xs text-red-300">{formError}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {drafts.length > 0 ? (
        <div className="overflow-x-auto rounded-xl border border-white/[0.08]">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-white/[0.08] bg-white/[0.02] text-xs uppercase tracking-[0.12em] text-[var(--muted)]">
              <tr>
                <th className="px-4 py-3 font-semibold">Modelo</th>
                <th className="px-4 py-3 font-semibold">Stock</th>
                <th className="px-4 py-3 font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {drafts.map((model) => {
                const isLoading = loadingModelId === model.id;
                const modelStock = getModelStockDisplay(model, isSiliconeCase);

                return (
                  <Fragment key={model.localId}>
                    <tr
                      key={model.localId}
                      className="border-b border-white/[0.06]"
                    >
                      <td className="px-4 py-4 font-medium text-white">
                        {model.modelName}
                      </td>
                      <td className="px-4 py-4 text-[var(--muted)]">
                        {modelStock}
                        {isSiliconeCase && (
                          <span className="mt-1 block text-[10px] text-[var(--muted)]/80">
                            Suma de colores
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex flex-col gap-3">
                          {!isSiliconeCase && (
                            <div className="flex flex-wrap gap-2">
                              {stockAdjustments.map((delta) => (
                                <Button
                                  key={delta}
                                  type="button"
                                  variant={delta > 0 ? "secondary" : "ghost"}
                                  size="compact"
                                  disabled={isLoading}
                                  onClick={() => adjustModelStock(model, delta)}
                                >
                                  {isLoading && loadingDelta === delta
                                    ? "..."
                                    : delta > 0
                                      ? `+${delta}`
                                      : String(delta)}
                                </Button>
                              ))}
                            </div>
                          )}
                          <div className="flex gap-2">
                            <Button
                              type="button"
                              variant="ghost"
                              size="compact"
                              onClick={() => handleEdit(model.localId)}
                            >
                              Editar
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="compact"
                              onClick={() => handleDelete(model.localId)}
                            >
                              Eliminar
                            </Button>
                          </div>
                        </div>
                      </td>
                    </tr>
                    {isSiliconeCase && model.id && (
                      <tr key={`${model.localId}-colors`} className="border-b border-white/[0.06]">
                        <td colSpan={3} className="px-4 pb-4">
                          <AdminModelColorVariants
                            modelName={model.modelName}
                            variants={model.variants ?? []}
                            onChange={(variants) =>
                              updateModelVariants(model.localId, variants)
                            }
                          />
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="rounded-xl border border-dashed border-white/[0.12] px-4 py-8 text-center text-sm text-[var(--muted)]">
          Todavía no hay modelos cargados para esta funda.
        </p>
      )}
    </section>
  );
}
