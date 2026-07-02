"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/components/cart/CartProvider";
import { PaymentIcon } from "@/components/cart/checkout/PaymentIcons";
import { submitCheckoutOrderAction } from "@/app/carrito/actions";
import { CheckoutOrderSuccess } from "@/components/cart/CheckoutOrderSuccess";
import { formatPrice } from "@/lib/data";
import {
  CHECKOUT_STEPS,
  FREE_SHIPPING_THRESHOLD,
  PAYMENT_METHODS,
  SHIPPING_METHODS,
  getInitialCheckoutForm,
  getPaymentMethodLabel,
  getShippingCost,
  getShippingMethodLabel,
  validateCheckoutStep,
  type CheckoutFormData,
  type CheckoutStepId,
  type PaymentMethod,
  type ShippingMethod,
} from "@/lib/checkout";

function CheckoutField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block w-full space-y-2">
      <span className="text-sm font-medium text-white">{label}</span>
      {children}
    </label>
  );
}

const checkoutInputClass =
  "admin-input min-h-12 w-full text-base md:min-h-0 md:text-sm";

const checkoutTextareaClass =
  "admin-input min-h-24 w-full resize-y text-base md:text-sm";

function StepCheckIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2.5}
      aria-hidden
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function StepIndicator({ currentStep }: { currentStep: CheckoutStepId }) {
  const currentStepMeta = CHECKOUT_STEPS.find((step) => step.id === currentStep);

  return (
    <>
      <div className="md:hidden">
        <ol
          className="flex items-center"
          aria-label="Pasos del checkout"
        >
          {CHECKOUT_STEPS.map((step, index) => {
            const active = step.id === currentStep;
            const completed = step.id < currentStep;
            const isLast = index === CHECKOUT_STEPS.length - 1;

            return (
              <li
                key={step.id}
                className={`flex items-center ${isLast ? "shrink-0" : "min-w-0 flex-1"}`}
              >
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-xs font-semibold transition-colors ${
                    active
                      ? "border-[var(--brand-cyan)] bg-[var(--brand-cyan)] text-[var(--void)]"
                      : completed
                        ? "border-emerald-500 bg-emerald-500 text-white"
                        : "border-white/20 bg-transparent text-[var(--muted)]"
                  }`}
                  aria-current={active ? "step" : undefined}
                >
                  {completed ? (
                    <StepCheckIcon />
                  ) : (
                    <span>{step.id}</span>
                  )}
                </div>
                {!isLast && (
                  <div
                    className={`mx-1.5 h-0.5 min-w-3 flex-1 rounded-full ${
                      step.id < currentStep ? "bg-emerald-500" : "bg-white/15"
                    }`}
                    aria-hidden
                  />
                )}
              </li>
            );
          })}
        </ol>
        {currentStepMeta && (
          <p className="mt-2.5 text-center text-sm font-medium text-white">
            {currentStepMeta.label}
          </p>
        )}
      </div>

      <ol className="hidden gap-3 md:grid md:grid-cols-5">
        {CHECKOUT_STEPS.map((step) => {
          const active = step.id === currentStep;
          const completed = step.id < currentStep;

          return (
            <li
              key={step.id}
              className={`rounded-xl border px-3 py-3 text-center ${
                active
                  ? "border-[var(--brand-cyan)]/40 bg-[var(--brand-cyan)]/10"
                  : completed
                    ? "border-emerald-500/20 bg-emerald-500/5"
                    : "border-white/[0.08] bg-white/[0.02]"
              }`}
            >
              <p
                className={`text-[10px] font-semibold tracking-[0.14em] uppercase ${
                  active ? "text-[var(--brand-cyan)]" : "text-[var(--muted)]"
                }`}
              >
                Paso {step.id}
              </p>
              <p className="mt-1 text-xs font-medium text-white">{step.label}</p>
            </li>
          );
        })}
      </ol>
    </>
  );
}

function SelectionCard({
  selected,
  onSelect,
  title,
  description,
  extra,
  icon,
}: {
  selected: boolean;
  onSelect: () => void;
  title: string;
  description: string;
  extra?: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full rounded-2xl border p-4 text-left transition-colors ${
        selected
          ? "border-[var(--brand-cyan)]/40 bg-[var(--brand-cyan)]/10"
          : "border-white/[0.08] bg-white/[0.03] hover:border-white/20"
      }`}
    >
      <div className="flex items-start gap-4">
        {icon && <div className="shrink-0">{icon}</div>}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <p className="font-semibold text-white">{title}</p>
            {extra}
          </div>
          <p className="mt-1 text-sm text-[var(--muted)]">{description}</p>
        </div>
      </div>
    </button>
  );
}

export function CheckoutPageView() {
  const router = useRouter();
  const { items, subtotal, clearCart, hydrated } = useCart();
  const [step, setStep] = useState<CheckoutStepId>(1);
  const [form, setForm] = useState<CheckoutFormData>(getInitialCheckoutForm);
  const [error, setError] = useState<string | null>(null);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const shippingCost = useMemo(
    () => getShippingCost(form.shippingMethod, subtotal),
    [form.shippingMethod, subtotal],
  );
  const total = subtotal + shippingCost;

  useEffect(() => {
    if (!hydrated) return;
    if (!orderNumber && items.length === 0) {
      router.replace("/carrito");
    }
  }, [hydrated, items.length, orderNumber, router]);

  function updateForm<K extends keyof CheckoutFormData>(
    key: K,
    value: CheckoutFormData[K],
  ) {
    setForm((current) => ({ ...current, [key]: value }));
    setError(null);
  }

  function handleContinue() {
    const validationError = validateCheckoutStep(step, form);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);
    setStep((current) => Math.min(5, current + 1) as CheckoutStepId);
  }

  function handleBack() {
    setError(null);
    setStep((current) => Math.max(1, current - 1) as CheckoutStepId);
  }

  function handleFinalize() {
    const validationError = validateCheckoutStep(5, form);
    if (validationError) {
      setError(validationError);
      return;
    }

    startTransition(async () => {
      const cartSnapshot = [...items];
      const result = await submitCheckoutOrderAction(cartSnapshot, form);

      if (!result.ok) {
        setError(result.error ?? "No se pudo completar la compra.");
        return;
      }

      if (form.paymentMethod === "mercadopago") {
        try {
          const preferenceResponse = await fetch("/api/mp/create-preference", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              orderNumber: result.orderNumber,
              total,
              shippingCost,
              items: cartSnapshot.map((item) => ({
                id: item.id,
                name: item.name,
                image: item.image,
                price: item.price,
                quantity: item.quantity,
              })),
              payer: {
                name: form.customerName.trim(),
                email: form.customerEmail.trim(),
                phone: form.customerPhone.trim(),
              },
            }),
          });

          const preferenceData = (await preferenceResponse.json()) as {
            preferenceId?: string;
            initPoint?: string;
            error?: string;
          };

          if (!preferenceResponse.ok || !preferenceData.initPoint) {
            setError(
              preferenceData.error ??
                "El pedido fue registrado, pero no pudimos iniciar el pago con Mercado Pago. Contactanos con tu número de pedido.",
            );
            return;
          }

          window.location.assign(preferenceData.initPoint);
          return;
        } catch {
          setError(
            "El pedido fue registrado, pero no pudimos conectar con Mercado Pago. Contactanos con tu número de pedido.",
          );
          return;
        }
      }

      setOrderNumber(result.orderNumber);
      clearCart();
    });
  }

  if (!hydrated) {
    return (
      <main className="pb-24">
        <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <p className="text-sm text-[var(--muted)]">Cargando checkout...</p>
        </div>
      </main>
    );
  }

  if (orderNumber) {
    return <CheckoutOrderSuccess orderNumber={orderNumber} />;
  }

  if (items.length === 0) return null;

  return (
    <main className="pb-24">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[
            { label: "Inicio", href: "/" },
            { label: "Carrito", href: "/carrito" },
            { label: "Checkout" },
          ]}
        />

        <h1 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">
          Finalizar compra
        </h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Completá los pasos para confirmar tu pedido.
        </p>

        <div className="mt-6 md:mt-8">
          <StepIndicator currentStep={step} />
        </div>

        <div className="mt-3 rounded-2xl border border-white/[0.08] glass-card p-5 md:mt-8 md:p-8">
          {step === 1 && (
            <div className="space-y-5">
              <h2 className="text-xl font-semibold text-white">Datos del cliente</h2>
              <CheckoutField label="Nombre completo">
                <input
                  value={form.customerName}
                  onChange={(event) =>
                    updateForm("customerName", event.target.value)
                  }
                  className={checkoutInputClass}
                  autoComplete="name"
                />
              </CheckoutField>
              <CheckoutField label="Email">
                <input
                  type="email"
                  value={form.customerEmail}
                  onChange={(event) =>
                    updateForm("customerEmail", event.target.value)
                  }
                  className={checkoutInputClass}
                  autoComplete="email"
                />
              </CheckoutField>
              <CheckoutField label="Teléfono / WhatsApp">
                <input
                  type="tel"
                  value={form.customerPhone}
                  onChange={(event) =>
                    updateForm("customerPhone", event.target.value)
                  }
                  className={checkoutInputClass}
                  autoComplete="tel"
                />
              </CheckoutField>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <h2 className="text-xl font-semibold text-white">
                Dirección de envío
              </h2>
              <CheckoutField label="Calle y número">
                <input
                  value={form.street}
                  onChange={(event) => updateForm("street", event.target.value)}
                  className={checkoutInputClass}
                  autoComplete="street-address"
                />
              </CheckoutField>
              <div className="grid gap-5 sm:grid-cols-2">
                <CheckoutField label="Ciudad">
                  <input
                    value={form.city}
                    onChange={(event) => updateForm("city", event.target.value)}
                    className={checkoutInputClass}
                    autoComplete="address-level2"
                  />
                </CheckoutField>
                <CheckoutField label="Provincia">
                  <input
                    value={form.province}
                    onChange={(event) =>
                      updateForm("province", event.target.value)
                    }
                    className={checkoutInputClass}
                    autoComplete="address-level1"
                  />
                </CheckoutField>
              </div>
              <CheckoutField label="Código postal">
                <input
                  value={form.postalCode}
                  onChange={(event) =>
                    updateForm("postalCode", event.target.value)
                  }
                  className={checkoutInputClass}
                  autoComplete="postal-code"
                />
              </CheckoutField>
              <CheckoutField label="Referencias (opcional)">
                <textarea
                  value={form.shippingNotes}
                  onChange={(event) =>
                    updateForm("shippingNotes", event.target.value)
                  }
                  className={checkoutTextareaClass}
                  placeholder="Piso, departamento, entre calles..."
                />
              </CheckoutField>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <h2 className="text-xl font-semibold text-white">Método de envío</h2>
              <p className="text-sm text-[var(--muted)]">
                Envío gratis en compras superiores a{" "}
                {formatPrice(FREE_SHIPPING_THRESHOLD)} con envío estándar.
              </p>
              <div className="space-y-3">
                {SHIPPING_METHODS.map((method) => {
                  const cost = getShippingCost(method.id, subtotal);
                  return (
                    <SelectionCard
                      key={method.id}
                      selected={form.shippingMethod === method.id}
                      onSelect={() => updateForm("shippingMethod", method.id)}
                      title={method.label}
                      description={method.description}
                      extra={
                        <span className="text-sm font-semibold text-[var(--brand-cyan)]">
                          {cost === 0 ? "Gratis" : formatPrice(cost)}
                        </span>
                      }
                    />
                  );
                })}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-5">
              <h2 className="text-xl font-semibold text-white">Medios de pago</h2>
              <p className="text-sm text-[var(--muted)]">
                Elegí cómo querés pagar tu pedido.
              </p>
              <div className="space-y-3">
                {PAYMENT_METHODS.map((method) => (
                  <SelectionCard
                    key={method.id}
                    selected={form.paymentMethod === method.id}
                    onSelect={() =>
                      updateForm("paymentMethod", method.id as PaymentMethod)
                    }
                    title={method.label}
                    description={method.description}
                    icon={<PaymentIcon method={method.id} />}
                  />
                ))}
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-white">
                Confirmación del pedido
              </h2>

              <div className="space-y-3">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 rounded-xl border border-white/[0.08] bg-white/[0.03] p-3"
                  >
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.04]">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-contain p-1.5"
                        sizes="64px"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-white">{item.name}</p>
                      <p className="text-sm text-[var(--muted)]">
                        Cantidad: {item.quantity}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-white">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              <dl className="space-y-3 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-[var(--muted)]">Subtotal</dt>
                  <dd className="font-medium text-white">{formatPrice(subtotal)}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-[var(--muted)]">Envío</dt>
                  <dd className="font-medium text-white">
                    {shippingCost === 0 ? "Gratis" : formatPrice(shippingCost)}
                  </dd>
                </div>
                <div className="flex justify-between gap-4 border-t border-white/[0.06] pt-3">
                  <dt className="font-semibold text-white">Total</dt>
                  <dd className="text-lg font-bold text-white">
                    {formatPrice(total)}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-[var(--muted)]">Medio de pago</dt>
                  <dd className="font-medium text-white">
                    {getPaymentMethodLabel(form.paymentMethod)}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-[var(--muted)]">Método de envío</dt>
                  <dd className="font-medium text-white">
                    {getShippingMethodLabel(form.shippingMethod)}
                  </dd>
                </div>
              </dl>

              <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-4 text-sm text-[var(--muted)]">
                <p className="font-medium text-white">{form.customerName}</p>
                <p className="mt-1">{form.customerEmail}</p>
                <p>{form.customerPhone}</p>
                <p className="mt-3">
                  {form.street}, {form.city}, {form.province} ({form.postalCode})
                </p>
              </div>
            </div>
          )}

          {error && (
            <p className="mt-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </p>
          )}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-between">
            {step > 1 ? (
              <Button
                type="button"
                variant="secondary"
                size="lg"
                onClick={handleBack}
                disabled={isPending}
              >
                Volver
              </Button>
            ) : (
              <Button href="/carrito" variant="secondary" size="lg">
                Volver al carrito
              </Button>
            )}

            {step < 5 ? (
              <Button
                type="button"
                variant="primary"
                size="lg"
                className="sm:min-w-[220px]"
                onClick={handleContinue}
              >
                Continuar
              </Button>
            ) : (
              <Button
                type="button"
                variant="primary"
                size="lg"
                className="sm:min-w-[220px]"
                onClick={handleFinalize}
                disabled={isPending}
              >
                {isPending
                  ? form.paymentMethod === "mercadopago"
                    ? "Redirigiendo a Mercado Pago..."
                    : "Procesando..."
                  : "Finalizar Compra"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
