"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/components/cart/CartProvider";
import { formatPrice, siteConfig } from "@/lib/data";
import { TextScramble } from "@/components/ui/text-scramble";
import type { StoreProduct } from "@/lib/store/types";

const IPHONE_MODELS = [
  "iPhone 16 Pro Max",
  "iPhone 16 Pro",
  "iPhone 16 Plus",
  "iPhone 16",
  "iPhone 15 Pro Max",
  "iPhone 15 Pro",
  "iPhone 15 Plus",
  "iPhone 15",
  "iPhone 14 Pro Max",
  "iPhone 14 Pro",
  "iPhone 14 Plus",
  "iPhone 14",
  "iPhone 13",
  "iPhone SE",
  "Otro modelo",
];

type ProductPurchasePanelProps = {
  product: StoreProduct;
  panelId?: string;
};

function buildWhatsAppUrl(productName: string, model: string) {
  const message = model
    ? `Hola! Quiero consultar "${productName}" para ${model}.`
    : `Hola! Quiero consultar "${productName}".`;
  return `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(message)}`;
}

export function ProductPurchasePanel({
  product,
  panelId = "product-purchase-panel",
}: ProductPurchasePanelProps) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [model, setModel] = useState("");
  const [toast, setToast] = useState<string | null>(null);
  const toastTimerRef = useRef<number | null>(null);

  const stock = product.stock ?? 0;
  const isOutOfStock = stock <= 0;
  const maxQuantity = Math.max(stock, 1);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        window.clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (quantity > maxQuantity && stock > 0) {
      setQuantity(maxQuantity);
    }
  }, [maxQuantity, quantity, stock]);

  function showToast(message: string) {
    setToast(message);
    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current);
    }
    toastTimerRef.current = window.setTimeout(() => setToast(null), 3200);
  }

  function handleAddToCart() {
    if (isOutOfStock) return;
    if (!model) {
      showToast("Seleccioná tu modelo de iPhone para continuar.");
      return;
    }

    addItem(
      {
        id: product.id,
        name: product.name,
        image: product.image,
        price: product.price,
        model,
      },
      quantity,
    );
    showToast(`${product.name} agregado al carrito.`);
  }

  return (
    <div id={panelId} className="space-y-5">
      <label className="block space-y-2 text-left">
        <span className="text-sm font-medium text-white">
          Modelo de iPhone compatible
        </span>
        <select
          value={model}
          onChange={(event) => setModel(event.target.value)}
          className="w-full rounded-xl border border-white/[0.12] bg-[#111118] px-4 py-3 text-sm text-white outline-none focus:border-[var(--brand-cyan)]"
        >
          <option value="">Seleccioná tu iPhone</option>
          {IPHONE_MODELS.map((iphoneModel) => (
            <option key={iphoneModel} value={iphoneModel}>
              {iphoneModel}
            </option>
          ))}
        </select>
      </label>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <div className="inline-flex shrink-0 items-center rounded-full border border-white/[0.12] bg-white/[0.04]">
          <Button
            type="button"
            variant="ghost"
            size="compact"
            aria-label="Disminuir cantidad"
            disabled={isOutOfStock || quantity <= 1}
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
            disabled={isOutOfStock || quantity >= maxQuantity}
            onClick={() =>
              setQuantity((current) => Math.min(maxQuantity, current + 1))
            }
          >
            +
          </Button>
        </div>

        <Button
          type="button"
          variant="secondary"
          size="lg"
          className="min-w-[220px] flex-1 sm:flex-none"
          disabled={isOutOfStock}
          onClick={handleAddToCart}
        >
          {isOutOfStock ? "Sin stock" : "Agregar al carrito"}
        </Button>

        <Button
          href={buildWhatsAppUrl(product.name, model)}
          variant="primary"
          size="lg"
          className="flex-1 sm:flex-none"
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

export function ProductStickyBar({ product }: { product: StoreProduct }) {
  const panelRef = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);
  const { addItem } = useCart();
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

  function handleQuickAdd() {
    if (isOutOfStock) return;
    addItem(
      {
        id: product.id,
        name: product.name,
        image: product.image,
        price: product.price,
      },
      1,
    );
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-white/[0.08] bg-[#0b0b10]/95 px-4 py-3 backdrop-blur-xl md:hidden">
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
          onClick={handleQuickAdd}
        >
          {isOutOfStock ? "Agotado" : "Agregar"}
        </Button>
      </div>
    </div>
  );
}
