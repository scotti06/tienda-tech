import { trustPills } from "@/lib/data";

export function TrustBar() {
  return (
    <section aria-label="Beneficios destacados" className="relative -mt-6 z-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {trustPills.map((pill, index) => (
          <div
            key={pill.id}
            className="glass-card flex flex-col items-center justify-center rounded-2xl px-6 py-8 text-center transition-all duration-300 hover:border-[var(--brand-purple)]/25 hover:shadow-[0_8px_32px_var(--glow-purple)] animate-slide-up"
            style={{ animationDelay: `${index * 80}ms` }}
          >
            <p className="text-2xl font-semibold tracking-tight text-white md:text-3xl">
              {pill.title}
            </p>
            <p className="mt-1 text-sm font-medium tracking-wide text-[var(--muted)] uppercase">
              {pill.subtitle}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
