import Link from "next/link";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Button } from "@/components/ui/Button";
import { formatPrice, type Product } from "@/lib/data";
import { getCategoryById } from "@/lib/catalog";
import { siteConfig } from "@/lib/data";

type ProductPageViewProps = {
  product: Product;
};

export function ProductPageView({ product }: ProductPageViewProps) {
  const category = getCategoryById(product.categoryId);
  const whatsappText = encodeURIComponent(
    `Hola! Quiero consultar por: ${product.name}`,
  );

  return (
    <main className="pb-20">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[
            { label: "Inicio", href: "/" },
            { label: "Tienda", href: "/tienda" },
            ...(category
              ? [{ label: category.name, href: category.path }]
              : []),
            { label: product.name },
          ]}
        />

        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div
            className={`relative aspect-square overflow-hidden rounded-3xl border border-white/[0.08] ${product.accent}`}
          >
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(157,78,221,0.12),transparent_65%)]" />
            <div className="absolute inset-0 flex items-center justify-center p-12">
              <div className="h-48 w-48 rounded-[2.5rem] border border-white/10 bg-gradient-to-b from-white/[0.12] to-white/[0.02] backdrop-blur-sm md:h-56 md:w-56" />
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <p className="text-[11px] font-semibold tracking-[0.2em] text-[var(--brand-cyan)] uppercase">
              {product.category}
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white md:text-4xl">
              {product.name}
            </h1>
            <p className="mt-6 text-3xl font-semibold text-white">
              {formatPrice(product.price)}
            </p>
            <p className="mt-4 text-[var(--muted)] leading-relaxed">
              Consultá disponibilidad, modelos compatibles y precio actual en
              nuestro local o por WhatsApp.
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Button
                href={`https://wa.me/${siteConfig.whatsapp}?text=${whatsappText}`}
                variant="primary"
                size="lg"
                className="sm:flex-1"
              >
                Consultar por WhatsApp
              </Button>
              <Button href="/carrito" variant="secondary" size="lg">
                Agregar al carrito
              </Button>
            </div>

            {category && (
              <Link
                href={category.path}
                className="mt-8 inline-flex text-sm font-medium text-[var(--brand-cyan)] transition-colors hover:text-white"
              >
                ← Volver a {category.name}
              </Link>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
