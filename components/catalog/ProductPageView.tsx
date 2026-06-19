import Image from "next/image";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Button } from "@/components/ui/Button";
import { ScrollReveal, SCROLL_REVEAL_STAGGER_MS } from "@/components/ui/ScrollReveal";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { SimilarProductsCarousel } from "@/components/catalog/SimilarProductsCarousel";
import { formatPrice, getImageFrame, getProductImageBoxStyle, getProductImagePaddingClass, type Product } from "@/lib/data";
import { getCategoryById } from "@/lib/catalog";

type ProductPageViewProps = {
  product: Product;
};

export function ProductPageView({ product }: ProductPageViewProps) {
  const category = getCategoryById(product.categoryId);

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
          <ScrollReveal>
            <div
              className={`relative aspect-square overflow-hidden rounded-3xl border border-white/[0.08] ${product.accent}`}
            >
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(157,78,221,0.12),transparent_65%)]" />
              <div
                className={`absolute inset-0 flex items-center justify-center ${getProductImagePaddingClass(product, "p-12")}`}
              >
                <div
                  className="relative"
                  style={getProductImageBoxStyle(
                    product,
                    getImageFrame(product.imageFrame),
                    "detail",
                  )}
                >
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    priority
                    className="object-contain object-center drop-shadow-[0_14px_22px_rgba(0,0,0,0.22)]"
                    sizes={`(max-width: 1024px) 100vw, ${Math.max(product.imageFrame.width, product.imageFrame.height)}px`}
                  />
                </div>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={SCROLL_REVEAL_STAGGER_MS}>
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

            <div className="mt-10">
              <AddToCartButton
                product={{
                  id: product.id,
                  name: product.name,
                  image: product.image,
                  price: product.price,
                }}
              />
            </div>
            </div>
          </ScrollReveal>
        </div>

        {category && (
          <Button
            href={category.path}
            variant="inline-link"
            className="mt-8 text-sm font-medium hover:text-white"
          >
            ← Volver a {category.name}
          </Button>
        )}

        <SimilarProductsCarousel product={product} />
      </div>
    </main>
  );
}
