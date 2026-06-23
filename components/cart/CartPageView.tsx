"use client";

import Image from "next/image";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/components/cart/CartProvider";
import { CheckoutConsultButton } from "@/components/cart/CheckoutConsultButton";
import { formatPrice } from "@/lib/data";
import { TextScramble } from "@/components/ui/text-scramble";

export function CartPageView() {
  const { items, subtotal, total, removeItem, updateQuantity } = useCart();

  if (items.length === 0) {
    return (
      <main className="pb-24">
        <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { label: "Inicio", href: "/" },
              { label: "Carrito" },
            ]}
          />

          <h1 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">
            Carrito
          </h1>

          <div className="mt-12 rounded-2xl border border-white/[0.08] glass-card px-6 py-16 text-center md:px-12">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-2xl">
              🛒
            </div>
            <p className="mt-6 text-lg font-medium text-white">
              Tu carrito está vacío
            </p>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Explorá la tienda y agregá productos. Por ahora podés consultar
              disponibilidad directamente con nosotros.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button href="/tienda" variant="primary" size="lg">
                Ir a la tienda
              </Button>
              <Button href="/contacto" variant="secondary" size="lg">
                Contacto
              </Button>
            </div>
          </div>

          <p className="mt-8 text-center text-sm text-[var(--muted)]">
            ¿Ya elegiste un producto?{" "}
            <Button href="/contacto" variant="inline-link" className="text-sm">
              Consultanos por WhatsApp
            </Button>
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="pb-24">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[
            { label: "Inicio", href: "/" },
            { label: "Carrito" },
          ]}
        />

        <h1 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">
          Carrito
        </h1>

        <ul className="mt-12 space-y-4">
          {items.map((item) => (
            <li
              key={item.id}
              className="rounded-2xl border border-white/[0.08] glass-card p-4 md:p-5"
            >
              <div className="flex gap-4">
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.04]">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className={`object-contain object-center ${item.id === "7" ? "p-1" : "p-2"}`}
                    sizes="80px"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <h2 className="text-base font-semibold tracking-tight text-white line-clamp-2">
                    {item.name}
                  </h2>
                  <p className="mt-1 text-sm text-[var(--muted)]">
                    <TextScramble
                      variant="price"
                      text={formatPrice(item.price)}
                    />{" "}
                    c/u
                  </p>

                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <div className="inline-flex items-center rounded-full border border-white/[0.12] bg-white/[0.04]">
                      <Button
                        type="button"
                        variant="ghost"
                        size="compact"
                        aria-label={`Disminuir cantidad de ${item.name}`}
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        −
                      </Button>
                      <span className="min-w-8 px-2 text-center text-sm font-semibold text-white">
                        {item.quantity}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="compact"
                        aria-label={`Aumentar cantidad de ${item.name}`}
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        +
                      </Button>
                    </div>

                    <Button
                      type="button"
                      variant="inline-link"
                      className="text-sm"
                      onClick={() => removeItem(item.id)}
                    >
                      Eliminar
                    </Button>
                  </div>
                </div>

                <p className="shrink-0 text-base font-semibold text-white">
                  <TextScramble
                    variant="price"
                    text={formatPrice(item.price * item.quantity)}
                  />
                </p>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-8 rounded-2xl border border-white/[0.08] glass-card px-6 py-6 md:px-8">
          <div className="flex items-center justify-between text-sm text-[var(--muted)]">
            <span>Subtotal</span>
            <span>
              <TextScramble variant="price" text={formatPrice(subtotal)} />
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-lg font-semibold text-white">
            <span>Total</span>
            <span>
              <TextScramble variant="price" text={formatPrice(total)} />
            </span>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button href="/tienda" variant="secondary" size="lg" className="sm:flex-1">
              Seguir comprando
            </Button>
            <CheckoutConsultButton items={items} />
          </div>
        </div>
      </div>
    </main>
  );
}
