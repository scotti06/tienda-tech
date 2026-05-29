import { SectionHeader } from "@/components/ui/SectionHeader";
import { benefits } from "@/lib/data";
import {
  IconCard,
  IconChat,
  IconShield,
  IconTruck,
} from "@/components/ui/Icons";

const benefitIcons = [IconTruck, IconShield, IconCard, IconChat];

export function Benefits() {
  return (
    <section id="beneficios" className="py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Experiencia Techstylebv"
          title="Comprá con tranquilidad"
          description="Cada detalle del proceso está pensado para que recibas exactamente lo que esperás."
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit, index) => {
            const Icon = benefitIcons[index];
            return (
              <article
                key={benefit.id}
                className="group rounded-2xl glass-card p-8 transition-all duration-500 hover:border-[var(--brand-purple)]/20 animate-slide-up"
                style={{ animationDelay: `${index * 90}ms` }}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[var(--brand-purple)]/25 bg-[var(--brand-purple)]/10 text-[var(--brand-cyan)] transition-transform duration-300 group-hover:scale-105">
                  <Icon />
                </div>
                <h3 className="mt-6 text-lg font-semibold tracking-tight text-white">
                  {benefit.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">
                  {benefit.description}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
