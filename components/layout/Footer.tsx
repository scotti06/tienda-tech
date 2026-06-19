import Link from "next/link";
import { siteConfig } from "@/lib/data";
import { categoryCatalog } from "@/lib/catalog";
import { Logo } from "@/components/ui/Logo";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { CartFooterLink } from "@/components/cart/CartFooterLink";

const footerLinks = {
  Tienda: categoryCatalog.map((c) => ({
    label: c.name,
    href: c.path,
  })),
  Soporte: [
    { label: "Tienda", href: "/tienda" },
    { label: "Contacto", href: "/contacto" },
    { label: "Carrito", action: "cart" as const },
    { label: "Inicio", href: "/" },
  ],
  Legal: [
    { label: "Términos", href: "/contacto" },
    { label: "Privacidad", href: "/contacto" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-[var(--surface)]">
      <ScrollReveal>
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">
            <div className="lg:col-span-2">
              <Logo href="/" size="footer" />
              <p className="mt-5 max-w-xs text-sm leading-relaxed text-[var(--muted)]">
                {siteConfig.description}
              </p>
            </div>

            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title}>
                <h4 className="text-xs font-semibold tracking-[0.15em] text-white uppercase">
                  {title}
                </h4>
                <ul className="mt-5 space-y-3">
                  {links.map((link) => (
                    <li key={link.label}>
                      {"action" in link && link.action === "cart" ? (
                        <CartFooterLink className="text-sm text-[var(--muted)] transition-colors hover:text-white">
                          {link.label}
                        </CartFooterLink>
                      ) : (
                        <Link
                          href={link.href}
                          className="text-sm text-[var(--muted)] transition-colors hover:text-white"
                        >
                          {link.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/[0.06] pt-8 sm:flex-row">
            <p className="text-xs text-[var(--muted)]">
              © {new Date().getFullYear()} {siteConfig.name}. Todos los derechos reservados.
            </p>
            <p className="text-xs text-[var(--muted)]">
              Diseñado con precisión · Argentina
            </p>
          </div>
        </div>
      </ScrollReveal>
    </footer>
  );
}
