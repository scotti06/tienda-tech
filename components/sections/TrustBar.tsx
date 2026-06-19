import { trustPills } from "@/lib/data";
import { ScrollReveal, SCROLL_REVEAL_STAGGER_MS } from "@/components/ui/ScrollReveal";

export function TrustBar() {
  return (
    <section
      aria-label="Beneficios destacados"
      className="relative z-10 mt-0 px-4 pb-2 pt-1 sm:-mt-6 sm:px-6 sm:pb-0 lg:px-8"
    >
      <div className="scroll-snap-x hide-scrollbar mx-auto flex max-w-7xl items-start gap-2.5 overflow-x-auto pb-1 sm:grid sm:grid-cols-2 sm:gap-3 sm:overflow-visible lg:grid-cols-4">
        {trustPills.map((pill, index) => (
          <ScrollReveal
            key={pill.id}
            delay={index * SCROLL_REVEAL_STAGGER_MS}
            className="card-tap glass-card scroll-snap-start flex w-[calc((100vw-2rem-0.625rem)/2.15)] max-w-[168px] shrink-0 flex-col items-center justify-center self-start rounded-2xl px-3 py-3 text-center transition-all duration-300 sm:max-w-none sm:w-auto sm:min-w-0 sm:px-6 sm:py-8 hover:border-[var(--brand-purple)]/25 hover:shadow-[0_8px_32px_var(--glow-purple)]"
          >
            <p className="text-lg font-semibold leading-tight tracking-tight text-white sm:text-2xl md:text-3xl">
              {pill.title}
            </p>
            <p className="mt-0.5 text-[10px] font-medium leading-tight tracking-wide text-[var(--muted)] uppercase sm:mt-1 sm:text-sm">
              {pill.subtitle}
            </p>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
