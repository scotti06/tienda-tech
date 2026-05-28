import Link from "next/link";
import { siteConfig } from "@/lib/data";

const footerLinks = {
  tienda: [
    { label: "Fundas", href: "#productos" },
    { label: "Audio", href: "#productos" },
    { label: "Carga rápida", href: "#productos" },
    { label: "Cables", href: "#productos" },
  ],
  ayuda: [
    { label: "Envíos", href: "#beneficios" },
    { label: "Garantía", href: "#beneficios" },
    { label: "Devoluciones", href: "#beneficios" },
    { label: "Contacto", href: "#" },
  ],
  legal: [
    { label: "Términos", href: "#" },
    { label: "Privacidad", href: "#" },
    { label: "Cookies", href: "#" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link href="#inicio" className="flex items-center gap-2 text-lg font-semibold text-white">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 text-sm font-bold">
                P
              </span>
              {siteConfig.name}
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-zinc-400">
              {siteConfig.description} Diseño, calidad y compatibilidad garantizada
              para iPhone, Samsung y más.
            </p>
            <div className="mt-6 flex gap-3">
              {["instagram", "twitter", "youtube"].map((social) => (
                <a
                  key={social}
                  href="#"
                  aria-label={social}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-zinc-400 transition-all hover:border-white/30 hover:bg-white/5 hover:text-white"
                >
                  <span className="sr-only">{social}</span>
                  <span className="text-xs font-medium uppercase">{social[0]}</span>
                </a>
              ))}
            </div>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-sm font-semibold tracking-wide text-white uppercase">
                {title}
              </h4>
              <ul className="mt-4 space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-zinc-400 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
          <p className="text-sm text-zinc-500">
            © {new Date().getFullYear()} {siteConfig.name}. Todos los derechos reservados.
          </p>
          <p className="text-sm text-zinc-500">
            Hecho con Next.js · Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  );
}
