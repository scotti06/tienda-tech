import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StoreShell } from "@/components/layout/StoreShell";
import { ProductPageView } from "@/components/catalog/ProductPageView";
import { siteConfig } from "@/lib/data";
import {
  getProductPageData,
  getProducts,
  getStoreProductBySlugForPage,
  type ProductPageData,
} from "@/lib/products";
import { normalizeProductSlug } from "@/lib/catalog";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const products = await getProducts();
  return products
    .filter((product) => product.slug?.trim())
    .map((product) => ({ slug: product.slug.trim() }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug: rawSlug } = await params;
  const slug = normalizeProductSlug(rawSlug);
  const product = await getProductPageData(slug);

  if (!product) return { title: "Producto — Techstylebv" };

  const description =
    product.description?.trim() ||
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

function ProductJsonLd({ product }: { product: ProductPageData }) {
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
  const product = await getStoreProductBySlugForPage(slug);

  if (!product || product.active === false) {
    notFound();
  }

  return (
    <StoreShell>
      <ProductJsonLd product={product} />
      <ProductPageView product={product} />
    </StoreShell>
  );
}
