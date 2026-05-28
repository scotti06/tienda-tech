import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/lib/data";

export function Hero() {
  return (
    <section
      id="inicio"
      className="relative min-h-[100dvh] flex items-center overflow-hidden pt-16"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/4 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-violet-600/20 blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-fuchsia-600/15 blur-[100px]" />
        <div className="absolute top-1/2 left-0 h-[300px] w-[300px] rounded-full bg-blue-600/10 blur-[80px]" />
      </div>

      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-8 lg:py-32">
        <div className="animate-slide-up">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-zinc-300 backdrop-blur-sm">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            Nuevos accesorios 2026
          </p>

          <h1 className="mt-6 text-4xl font-semibold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl xl:text-7xl">
            Tu móvil merece{" "}
            <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
              lo mejor
            </span>
          </h1>

          <p className="mt-6 max-w-lg text-lg leading-relaxed text-zinc-400">
            {siteConfig.tagline}. Fundas, auriculares, cargadores y cables con
            acabados premium y compatibilidad certificada.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Button href="#productos" variant="primary" size="lg">
              Ver colección
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Button>
            <Button href="#categorias" variant="secondary" size="lg">
              Explorar categorías
            </Button>
          </div>

          <dl className="mt-12 grid grid-cols-3 gap-6 border-t border-white/10 pt-8">
            {[
              { label: "Productos", value: "500+" },
              { label: "Clientes", value: "12k+" },
              { label: "Rating", value: "4.9★" },
            ].map((stat) => (
              <div key={stat.label}>
                <dt className="text-xs text-zinc-500 uppercase tracking-wide">
                  {stat.label}
                </dt>
                <dd className="mt-1 text-xl font-semibold text-white sm:text-2xl">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative hidden lg:block animate-slide-up animation-delay-200">
          <div className="relative aspect-square max-w-lg mx-auto">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-violet-600/30 via-fuchsia-500/20 to-transparent border border-white/10" />
            <div className="absolute inset-8 rounded-2xl bg-zinc-900/80 border border-white/10 backdrop-blur-xl flex flex-col items-center justify-center gap-6">
              <div className="h-32 w-32 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-900 border border-white/20 shadow-2xl" />
              <div className="flex gap-3">
                {["📱", "🎧", "⚡"].map((icon) => (
                  <div
                    key={icon}
                    className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-2xl backdrop-blur-sm transition-transform hover:scale-110"
                  >
                    {icon}
                  </div>
                ))}
              </div>
              <p className="text-sm text-zinc-400 text-center px-6">
                Colección premium · Envío gratis desde $80.000
              </p>
            </div>
            <div className="absolute -top-4 -right-4 rounded-2xl border border-white/10 bg-zinc-900/90 px-4 py-3 backdrop-blur-xl shadow-xl animate-float">
              <p className="text-xs text-zinc-500">Más vendido</p>
              <p className="text-sm font-medium text-white">Funda MagSafe Pro</p>
            </div>
            <div className="absolute -bottom-4 -left-4 rounded-2xl border border-white/10 bg-zinc-900/90 px-4 py-3 backdrop-blur-xl shadow-xl animate-float animation-delay-300">
              <p className="text-xs text-zinc-500">Entrega</p>
              <p className="text-sm font-medium text-emerald-400">24–48 horas</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
