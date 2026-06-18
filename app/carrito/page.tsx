import type { Metadata } from "next";
import { StoreShell } from "@/components/layout/StoreShell";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Carrito — Techstylebv",
  description: "Tu carrito de compras en Techstylebv.",
};

export default function CarritoPage() {
  return (
    <StoreShell>
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
    </StoreShell>
  );
}
