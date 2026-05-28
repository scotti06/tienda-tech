import { SectionHeader } from "@/components/ui/SectionHeader";
import { benefits } from "@/lib/data";

export function Benefits() {
  return (
    <section id="beneficios" className="relative py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Por qué elegirnos"
          title="Comprá con total confianza"
          description="Cada pedido incluye garantía, logística rápida y soporte humano real."
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit, index) => (
            <article
              key={benefit.id}
              className="group rounded-2xl border border-white/10 bg-zinc-900/30 p-6 transition-all duration-500 hover:border-violet-500/30 hover:bg-zinc-900/60 hover:shadow-lg hover:shadow-violet-500/5 animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <span
                className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 text-2xl transition-transform duration-300 group-hover:scale-110"
                role="img"
                aria-hidden
              >
                {benefit.icon}
              </span>
              <h3 className="mt-4 text-lg font-semibold text-white">
                {benefit.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                {benefit.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
