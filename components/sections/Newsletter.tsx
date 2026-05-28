import { Button } from "@/components/ui/Button";

export function Newsletter() {
  return (
    <section className="relative py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-violet-950/50 via-zinc-900 to-fuchsia-950/30 px-6 py-12 md:px-12 md:py-16">
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-violet-500/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-fuchsia-500/20 blur-3xl" />

          <div className="relative mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-semibold tracking-tight text-white md:text-3xl">
              10% off en tu primera compra
            </h2>
            <p className="mt-3 text-zinc-400">
              Suscribite y recibí ofertas exclusivas, lanzamientos y tips para
              cuidar tus accesorios.
            </p>

            <form className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <label htmlFor="email-newsletter" className="sr-only">
                Email
              </label>
              <input
                id="email-newsletter"
                type="email"
                placeholder="tu@email.com"
                className="w-full rounded-full border border-white/20 bg-white/5 px-5 py-3 text-sm text-white placeholder:text-zinc-500 backdrop-blur-sm transition-colors focus:border-violet-500/50 focus:outline-none focus:ring-2 focus:ring-violet-500/30 sm:max-w-xs"
              />
              <Button type="submit" variant="primary" size="md">
                Suscribirme
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
