import Image from "next/image";
import { siteConfig } from "@/lib/data";

export function HeroBackgroundBrand() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      aria-hidden
    >
      {/* Glow — sigue la rotación del mark */}
      <div className="absolute -right-[18%] -top-[12%] rotate-[-12deg] sm:-right-[10%] sm:-top-[8%] lg:-right-[4%]">
        <div className="absolute left-[35%] top-[30%] h-[min(90vw,780px)] w-[min(90vw,780px)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--brand-purple)]/[0.22] blur-[100px]" />
        <div className="absolute left-[55%] top-[55%] h-[min(70vw,560px)] w-[min(70vw,560px)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--brand-cyan)]/[0.14] blur-[90px]" />
      </div>

      {/* Mark editorial — gigante, diagonal, cortado por el borde */}
      <div className="absolute -right-[32%] -top-[22%] sm:-right-[24%] sm:-top-[16%] md:-right-[18%] md:-top-[12%] lg:-right-[10%] lg:-top-[8%] xl:-right-[6%]">
        <div className="relative rotate-[-14deg] sm:rotate-[-12deg] lg:rotate-[-11deg]">
          <Image
            src={siteConfig.logo}
            alt=""
            width={1400}
            height={1400}
            className="w-[min(175vw,1320px)] max-w-none select-none object-contain opacity-[0.17] brightness-[1.08] contrast-[1.06] saturate-[0.88] mix-blend-screen sm:opacity-[0.19] md:opacity-[0.21] lg:opacity-[0.22]"
            style={{
              filter:
                "drop-shadow(0 0 100px rgba(157, 78, 221, 0.28)) drop-shadow(0 0 60px rgba(0, 180, 216, 0.12))",
            }}
            priority
          />
        </div>
      </div>

      {/* Capa de profundidad — duplicado desplazado, muy sutil */}
      <div className="absolute -right-[38%] top-[8%] hidden md:block lg:-right-[28%]">
        <div className="relative rotate-[-14deg] opacity-40">
          <Image
            src={siteConfig.logo}
            alt=""
            width={1400}
            height={1400}
            className="w-[min(175vw,1320px)] max-w-none object-contain opacity-[0.08] mix-blend-screen blur-[1px]"
            aria-hidden
          />
        </div>
      </div>

      {/* Scrim central — protege legibilidad del copy sin tapar el mark en los bordes */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_52%_48%_at_50%_30%,var(--void)_0%,rgba(3,3,4,0.72)_42%,transparent_68%)]" />
      <div className="absolute inset-0 bg-gradient-to-r from-[var(--void)]/85 via-[var(--void)]/25 to-transparent" />

      <div className="absolute inset-x-0 bottom-0 h-[38%] bg-gradient-to-t from-[var(--void)] via-[var(--void)]/40 to-transparent" />
    </div>
  );
}
