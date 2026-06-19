import type { CategoryMeta } from "@/lib/catalog";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

type CategoryHeroProps = {
  category: CategoryMeta;
};

export function CategoryHero({ category }: CategoryHeroProps) {
  const { hero } = category;

  return (
    <section className="relative overflow-hidden border-b border-white/[0.06] py-14 md:py-20">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -right-[20%] top-0 h-[320px] w-[320px] rounded-full bg-[var(--brand-purple)]/[0.12] blur-[100px]" />
        <div className="absolute -left-[10%] bottom-0 h-[240px] w-[240px] rounded-full bg-[var(--brand-cyan)]/[0.08] blur-[80px]" />
      </div>
      <ScrollReveal className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-[11px] font-semibold tracking-[0.2em] text-[var(--brand-cyan)] uppercase">
          {hero.eyebrow}
        </p>
        <h1 className="mt-4 max-w-2xl text-3xl font-semibold leading-[1.1] tracking-[-0.03em] text-white md:text-4xl lg:text-5xl">
          {hero.title}{" "}
          <span className="text-gradient-mint">{hero.highlight}</span>
        </h1>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-[var(--muted)] md:text-lg">
          {hero.description}
        </p>
      </ScrollReveal>
    </section>
  );
}
