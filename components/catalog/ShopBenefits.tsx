import { ScrollReveal, SCROLL_REVEAL_STAGGER_MS } from "@/components/ui/ScrollReveal";
import { IconCard, IconChat, IconTruck } from "@/components/ui/Icons";

const shopBenefits = [
  {
    id: "shipping",
    title: "Envíos a toda Argentina",
    description: "Coordinamos envíos a todo el país según tu zona.",
    Icon: IconTruck,
  },
  {
    id: "payments",
    title: "Diferentes medios de pago",
    description: "Elegí la opción de pago que más te convenga.",
    Icon: IconCard,
  },
  {
    id: "support",
    title: "Atención personalizada",
    description: "Te asesoramos antes, durante y después de tu compra.",
    Icon: IconChat,
  },
] as const;

export function ShopBenefits() {
  return (
    <section
      aria-label="Beneficios de compra"
      className="border-t border-white/[0.06] py-16 md:py-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ul className="mx-auto flex max-w-2xl flex-col gap-4">
          {shopBenefits.map((benefit, index) => {
            const Icon = benefit.Icon;

            return (
              <ScrollReveal key={benefit.id} delay={index * SCROLL_REVEAL_STAGGER_MS}>
                <li className="group flex items-start gap-4 rounded-2xl glass-card p-5 transition-all duration-500 hover:border-[var(--brand-purple)]/20 md:gap-5 md:p-6">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[var(--brand-purple)]/25 bg-[var(--brand-purple)]/10 text-[var(--brand-cyan)] transition-transform duration-300 group-hover:scale-105 md:h-12 md:w-12">
                    <Icon />
                  </div>
                  <div className="min-w-0 pt-0.5">
                    <h3 className="text-base font-semibold tracking-tight text-white md:text-lg">
                      {benefit.title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-[var(--muted)]">
                      {benefit.description}
                    </p>
                  </div>
                </li>
              </ScrollReveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
