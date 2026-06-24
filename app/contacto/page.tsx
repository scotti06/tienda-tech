import type { Metadata } from "next";
import { StoreLocationSection } from "@/components/contact/StoreLocationSection";
import { StoreShell } from "@/components/layout/StoreShell";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/lib/data";
import { categoryCatalog } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Contacto — Techstylebv",
  description:
    "Contactá a Techstylebv por WhatsApp. Asesoramiento para fundas, vidrios, cargadores y AirPods.",
};

export default function ContactoPage() {
  const whatsappHref = `https://wa.me/${siteConfig.whatsapp}`;

  return (
    <StoreShell>
      <main className="pb-24">
        <section className="relative overflow-hidden border-b border-white/[0.06] py-14 md:py-20">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-1/2 top-0 h-[360px] w-[500px] -translate-x-1/2 rounded-full bg-[var(--brand-cyan)]/[0.08] blur-[100px]" />
          </div>
          <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <Breadcrumbs
              items={[
                { label: "Inicio", href: "/" },
                { label: "Contacto" },
              ]}
            />
            <h1 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">
              Contacto
            </h1>
            <p className="mt-4 text-[var(--muted)] md:text-lg">
              Consultá stock, precios y compatibilidad. Te respondemos por
              WhatsApp.
            </p>
          </div>
        </section>

        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-white/[0.08] glass-card p-6 md:p-8">
              <h2 className="text-lg font-semibold text-white">WhatsApp</h2>
              <p className="mt-2 text-sm text-[var(--muted)]">
                La forma más rápida de consultar disponibilidad y precios.
              </p>
              <Button
                href={whatsappHref}
                variant="primary"
                size="md"
                className="mt-6 w-full"
              >
                Escribir por WhatsApp
              </Button>
            </div>

            <div className="rounded-2xl border border-white/[0.08] glass-card p-6 md:p-8">
              <h2 className="text-lg font-semibold text-white">Categorías</h2>
              <ul className="mt-4 space-y-2">
                {categoryCatalog.map((cat) => (
                  <li key={cat.id}>
                    <Button href={cat.path} variant="inline-link" className="text-sm">
                      {cat.name}
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <StoreLocationSection />

          <div className="mt-8 rounded-2xl border border-white/[0.08] glass-card p-6 md:p-8">
            <h2 className="text-lg font-semibold text-white">
              Formulario de contacto
            </h2>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Próximamente. Por ahora usá WhatsApp para consultas.
            </p>
            <form className="mt-6 space-y-4 opacity-60">
              <input
                type="text"
                placeholder="Nombre"
                disabled
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-[var(--muted)]"
              />
              <input
                type="email"
                placeholder="Email"
                disabled
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-[var(--muted)]"
              />
              <textarea
                placeholder="Mensaje"
                rows={4}
                disabled
                className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-[var(--muted)]"
              />
            </form>
          </div>
        </div>
      </main>
    </StoreShell>
  );
}
