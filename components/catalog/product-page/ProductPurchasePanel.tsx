"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/components/cart/CartProvider";
import { ProductColorSelector } from "@/components/catalog/product-page/ProductColorSelector";
import { useVariantImageOverride } from "@/components/catalog/product-page/VariantImageContext";
import { formatPrice, siteConfig } from "@/lib/data";
import { TextScramble } from "@/components/ui/text-scramble";
import type { ProductVariant } from "@/lib/store/product-variant-types";
import type { ProductModel } from "@/lib/store/product-model-types";
import type { StoreProduct } from "@/lib/store/types";

type ProductPurchasePanelProps = {
  product: StoreProduct;
  colorVariants?: ProductVariant[];
  iphoneModels?: ProductModel[];
  colorsPerModel?: boolean;
  panelId?: string;
};

function buildWhatsAppUrl(productName: string, model: string, colorName?: string) {
  const colorPart = colorName ? ` en color ${colorName}` : "";
  const message = model
    ? `Hola! Quiero consultar "${productName}"${colorPart} para ${model}.`
    : `Hola! Quiero consultar "${productName}"${colorPart}.`;
  return `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(message)}`;
}

export function ProductPurchasePanel({
  product,
  colorVariants = [],
  iphoneModels = [],
  colorsPerModel = false,
  panelId = "product-purchase-panel",
}: ProductPurchasePanelProps) {
  const { addItem } = useCart();
  const setVariantOverrideImage =
    useVariantImageOverride()?.setOverrideImage;
  const [quantity, setQuantity] = useState(1);
  const [model, setModel] = useState("");
  const [selectedVariantId, setSelectedVariantId] = useState("");
  const [toast, setToast] = useState<string | null>(null);
  const [showModelHint, setShowModelHint] = useState(false);
  const [showColorHint, setShowColorHint] = useState(false);
  const toastTimerRef = useRef<number | null>(null);

  const hasIphoneModels = iphoneModels.length > 0;
  const selectedIphoneModel = iphoneModels.find(
    (item) => item.modelName === model,
  );
  const modelColorVariants: ProductVariant[] = colorsPerModel
    ? ((selectedIphoneModel?.variants ?? []) as ProductVariant[])
    : colorVariants;
  const hasColorVariants = colorsPerModel
    ? Boolean(model) && modelColorVariants.length > 0
    : colorVariants.length > 0;
  const selectedVariant = modelColorVariants.find(
    (variant) => variant.id === selectedVariantId,
  );
  const variantStock = selectedVariant?.stock ?? 0;
  const modelStock = selectedIphoneModel?.stock ?? 0;
  const productStock = product.stock ?? 0;
  const availableStock = hasColorVariants
    ? selectedVariant
      ? variantStock
      : 0
    : hasIphoneModels
      ? selectedIphoneModel
        ? modelStock
        : 0
      : productStock;
  const isOutOfStock = colorsPerModel
    ? iphoneModels.length === 0 ||
      iphoneModels.every((item) => {
        const variants = (item.variants ?? []) as ProductVariant[];
        return variants.length > 0
          ? variants.every((variant) => variant.stock <= 0)
          : item.stock <= 0;
      })
    : hasColorVariants
      ? colorVariants.every((variant) => variant.stock <= 0)
      : hasIphoneModels
        ? iphoneModels.every((item) => item.stock <= 0)
        : productStock <= 0;
  const maxQuantity = availableStock > 0 ? availableStock : 1;
  const requiresColor = hasColorVariants;
  const requiresModel = hasIphoneModels;
  const canAddToCart =
    (!requiresModel || Boolean(model)) &&
    (!requiresColor || Boolean(selectedVariant));

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        window.clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (quantity > maxQuantity && availableStock > 0) {
      setQuantity(maxQuantity);
    }
  }, [availableStock, maxQuantity, quantity]);

  useEffect(() => {
    setSelectedVariantId("");
    setQuantity(1);
    setVariantOverrideImage?.(null);
  }, [model, colorVariants, setVariantOverrideImage]);

  useEffect(() => {
    if (!setVariantOverrideImage) return;

    if (!selectedVariantId) {
      setVariantOverrideImage(null);
      return;
    }

    const image = selectedVariant?.image?.trim();
    setVariantOverrideImage(image || null);
  }, [selectedVariant, selectedVariantId, setVariantOverrideImage]);

  function showToast(message: string) {
    setToast(message);
    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current);
    }
    toastTimerRef.current = window.setTimeout(() => setToast(null), 3200);
  }

  function handleAddToCart() {
    if (isOutOfStock || !canAddToCart) return;

    addItem(
      {
        id: product.id,
        name: product.name,
        image: product.image,
        price: product.price,
        model,
        colorName: selectedVariant?.colorName,
        colorHex: selectedVariant?.colorHex,
        variantId: selectedVariant?.id,
      },
      Math.min(quantity, availableStock),
    );
    showToast(`${product.name} agregado al carrito.`);
  }

  function getAddButtonLabel() {
    if (isOutOfStock) return "Sin stock";
    if (requiresModel && !model) return "Agregar al carrito";
    if (requiresColor && !selectedVariant) return "Seleccioná un color";
    return "Agregar al carrito";
  }

  return (
    <div id={panelId} className="space-y-5">
      {hasIphoneModels && (
        <label className="block space-y-4 text-left">
          <span className="text-sm font-medium text-white">
            Modelo de iPhone compatible
          </span>
          <select
            value={model}
            onChange={(event) => {
              setModel(event.target.value);
              setShowModelHint(false);
              setQuantity(1);
            }}
            className="w-full rounded-xl border border-white/[0.12] bg-[#111118] px-4 py-3 text-sm text-white outline-none focus:border-[var(--brand-cyan)]"
          >
            <option value="">Seleccioná tu iPhone</option>
            {iphoneModels.map((iphoneModel) => (
              <option
                key={iphoneModel.id}
                value={iphoneModel.modelName}
                disabled={iphoneModel.stock <= 0}
              >
                {iphoneModel.modelName}
                {iphoneModel.stock <= 0 ? " (sin stock)" : ""}
              </option>
            ))}
          </select>
        </label>
      )}

      {hasColorVariants && (
        <ProductColorSelector
          variants={modelColorVariants}
          selectedVariantId={selectedVariantId}
          onSelect={(variantId) => {
            setSelectedVariantId(variantId);
            setShowColorHint(false);
            setQuantity(1);
          }}
        />
      )}

      <div className="flex flex-col items-center gap-3 sm:grid sm:w-full sm:grid-cols-[auto_minmax(220px,1fr)_auto] sm:items-center sm:gap-x-3 sm:gap-y-2">
        {isOutOfStock ? (
          <p className="text-sm font-medium text-red-300 sm:col-span-3">Sin stock</p>
        ) : (
          <div className="inline-flex shrink-0 items-center rounded-full border border-white/[0.12] bg-white/[0.04] sm:col-start-1 sm:row-start-1">
            <Button
              type="button"
              variant="ghost"
              size="compact"
              aria-label="Disminuir cantidad"
              disabled={quantity <= 1 || !canAddToCart}
              onClick={() => setQuantity((current) => Math.max(1, current - 1))}
            >
              −
            </Button>
            <span className="min-w-8 px-2 text-center text-sm font-semibold text-white">
              {quantity}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="compact"
              aria-label="Aumentar cantidad"
              disabled={!canAddToCart || quantity >= maxQuantity}
              onClick={() =>
                setQuantity((current) => Math.min(maxQuantity, current + 1))
              }
            >
              +
            </Button>
          </div>
        )}

        <div
          className="w-full min-w-[220px] sm:col-start-2 sm:row-start-1"
          onClick={() => {
            if (requiresModel && !model && !isOutOfStock) {
              setShowModelHint(true);
            }
            if (model && requiresColor && !selectedVariant && !isOutOfStock) {
              setShowColorHint(true);
            }
          }}
        >
          <Button
            type="button"
            variant="secondary"
            size="lg"
            className={`w-full ${!canAddToCart && !isOutOfStock ? "pointer-events-none" : ""}`}
            disabled={isOutOfStock || !canAddToCart}
            onClick={(event) => {
              event.stopPropagation();
              handleAddToCart();
            }}
          >
            {getAddButtonLabel()}
          </Button>
        </div>

        {requiresModel && !model && !isOutOfStock && (
          <p
            className={`w-full min-w-[220px] text-center text-xs transition-colors sm:col-start-2 sm:row-start-2 ${
              showModelHint
                ? "text-[var(--brand-cyan-soft)]"
                : "text-[var(--muted)]/80"
            }`}
          >
            Seleccioná un modelo
          </p>
        )}
        {model && requiresColor && !selectedVariant && !isOutOfStock && (
          <p
            className={`w-full min-w-[220px] text-center text-xs transition-colors sm:col-start-2 sm:row-start-2 ${
              showColorHint
                ? "text-[var(--brand-cyan-soft)]"
                : "text-[var(--muted)]/80"
            }`}
          >
            Seleccioná un color
          </p>
        )}

        <Button
          href={buildWhatsAppUrl(product.name, model, selectedVariant?.colorName)}
          variant="primary"
          size="lg"
          className="w-full sm:col-start-3 sm:row-start-1 sm:w-auto"
        >
          Consultar por WhatsApp
        </Button>
      </div>

      <div aria-live="polite" className="min-h-6">
        {toast && (
          <div className="flex flex-wrap items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
            <span>{toast}</span>
            <Link
              href="/carrito"
              className="font-semibold text-white underline-offset-2 hover:underline"
            >
              Ver carrito
            </Link>
          </div>
        )}
      </div>

      {product.cashPrice && product.price > 0 && (
        <p className="text-sm text-[var(--brand-purple-soft)]">
          Transferencia:{" "}
          <TextScramble
            variant="price"
            text={formatPrice(product.cashPrice)}
          />
        </p>
      )}
    </div>
  );
}

export function ProductStickyBar({
  product,
  hasColorVariants = false,
}: {
  product: StoreProduct;
  hasColorVariants?: boolean;
}) {
  const panelRef = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);
  const stock = product.stock ?? 0;
  const isOutOfStock = stock <= 0;

  useEffect(() => {
    const panel = document.getElementById("product-purchase-panel");
    panelRef.current = panel;
    if (!panel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(!entry.isIntersecting);
      },
      { threshold: 0, rootMargin: "0px 0px -40px 0px" },
    );

    observer.observe(panel);
    return () => observer.disconnect();
  }, []);

  if (!visible) return null;

  function scrollToPanel() {
    panelRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-white/[0.08] bg-[#0b0b10]/95 px-4 py-3 backdrop-blur-xl md:hidden animated-surface">
      <div className="mx-auto flex max-w-lg items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-white">
            {product.name}
          </p>
          <p className="text-base font-bold text-white">
            <TextScramble
              variant="price"
              text={formatPrice(product.price)}
            />
          </p>
        </div>
        <Button
          type="button"
          variant="secondary"
          size="md"
          disabled={isOutOfStock}
          onClick={scrollToPanel}
        >
          {isOutOfStock
            ? "Sin stock"
            : hasColorVariants
              ? "Elegir color"
              : "Ver opciones"}
        </Button>
      </div>
    </div>
  );
}
