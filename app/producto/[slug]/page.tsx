import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StoreShell } from "@/components/layout/StoreShell";
import { ProductPageView } from "@/components/catalog/ProductPageView";
import { siteConfig } from "@/lib/data";
import {
  getProductBySlug,
  getProductPageData,
  getProducts,
} from "@/lib/products";
import { normalizeProductSlug } from "@/lib/catalog";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getProducts()
    .filter((product) => product.slug?.trim())
    .map((product) => ({ slug: product.slug.trim() }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug: rawSlug } = await params;
  const slug = normalizeProductSlug(rawSlug);
  const productData = getProductPageData(slug);
  const product = productData ?? getProductBySlug(slug);

  if (!product) return { title: "Producto — Techstylebv" };

  const description =
    productData?.description?.trim() ||
    `Consultá disponibilidad y precio de ${product.name} en ${siteConfig.name}. Accesorios originales para iPhone.`;

  return {
    title: `${product.name} — Techstylebv`,
    description,
    openGraph: {
      title: `${product.name} — Techstylebv`,
      description,
      images: product.image ? [{ url: product.image }] : undefined,
    },
  };
}

function ProductJsonLd({ product }: { product: NonNullable<ReturnType<typeof getProductPageData>> }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.images?.length ? product.images : [product.image],
    description: product.description,
    sku: product.sku,
    brand: product.brand
      ? { "@type": "Brand", name: product.brand }
      : undefined,
    offers: {
      "@type": "Offer",
      priceCurrency: "ARS",
      price: product.price > 0 ? product.price : undefined,
      availability:
        (product.stock ?? 0) > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export default async function ProductoPage({ params }: PageProps) {
  const { slug: rawSlug } = await params;
  const slug = normalizeProductSlug(rawSlug);
  const product = getProductPageData(slug);

  if (!product) {
    notFound();
  }

  return (
    <StoreShell>
      <ProductJsonLd product={product} />
      <ProductPageView product={product} />
    </StoreShell>
  );
}
