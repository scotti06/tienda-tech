import { Button } from "@/components/ui/Button";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export function Newsletter() {
  return (
    <section className="home-section pb-14 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] p-8 md:p-16">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[var(--brand-purple)]/10 via-transparent to-[var(--brand-cyan)]/5" />
            <div className="pointer-events-none absolute -right-32 -top-32 h-64 w-64 rounded-full bg-[var(--brand-purple)]/10 blur-3xl" />

            <div className="relative mx-auto max-w-xl text-center">
              <p className="text-[11px] font-semibold tracking-[0.2em] text-[var(--brand-cyan)] uppercase">
                Newsletter
              </p>
              <h2 className="mt-4 text-2xl font-semibold tracking-tight text-white md:text-3xl">
                Novedades y disponibilidad
              </h2>
              <p className="mt-4 text-[var(--muted)]">
                Dejanos tu email para avisarte cuando ingresen modelos o productos nuevos.
              </p>

              <form className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <label htmlFor="email" className="sr-only">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  className="w-full rounded-full border border-white/10 bg-white/[0.04] px-5 py-3.5 text-sm text-white placeholder:text-[var(--muted)] transition-all focus:border-[var(--brand-purple)]/40 focus:outline-none focus:ring-2 focus:ring-[var(--brand-purple)]/20 sm:max-w-xs"
                />
                <Button type="submit" variant="primary" size="md">
                  Suscribirme
                </Button>
              </form>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
