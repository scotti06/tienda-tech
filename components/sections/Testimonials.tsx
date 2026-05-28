import { SectionHeader } from "@/components/ui/SectionHeader";
import { testimonials } from "@/lib/data";

export function Testimonials() {
  return (
    <section id="opiniones" className="relative py-20 md:py-28 overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Opiniones"
          title="Lo que dicen nuestros clientes"
          description="Miles de compradores confían en PulseTech para equipar sus dispositivos."
        />

        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <blockquote
              key={testimonial.id}
              className="flex flex-col rounded-2xl border border-white/10 bg-gradient-to-b from-zinc-900/80 to-zinc-950/80 p-6 backdrop-blur-sm transition-all duration-500 hover:border-white/20 animate-slide-up"
              style={{ animationDelay: `${index * 120}ms` }}
            >
              <div className="flex gap-1" aria-hidden>
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <svg
                    key={i}
                    className="h-4 w-4 text-amber-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              <p className="mt-4 flex-1 text-sm leading-relaxed text-zinc-300">
                &ldquo;{testimonial.content}&rdquo;
              </p>

              <footer className="mt-6 flex items-center gap-3 border-t border-white/10 pt-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 text-sm font-semibold text-white">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <cite className="not-italic text-sm font-medium text-white">
                    {testimonial.name}
                  </cite>
                  <p className="text-xs text-zinc-500">{testimonial.role}</p>
                </div>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
