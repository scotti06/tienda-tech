import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StoreShell } from "@/components/layout/StoreShell";
import { ProductPageView } from "@/components/catalog/ProductPageView";
import { products } from "@/lib/data";
import { getProductBySlug, normalizeProductSlug } from "@/lib/catalog";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return products
    .filter((product) => product.slug?.trim())
    .map((product) => ({ slug: product.slug.trim() }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug: rawSlug } = await params;
  const slug = normalizeProductSlug(rawSlug);
  const product = getProductBySlug(slug);

  if (!product) return { title: "Producto — Techstylebv" };

  return {
    title: `${product.name} — Techstylebv`,
    description: `Consultá disponibilidad y precio de ${product.name} en Techstylebv.`,
  };
}

export default async function ProductoPage({ params }: PageProps) {
  const { slug: rawSlug } = await params;
  const slug = normalizeProductSlug(rawSlug);

  console.log("[ProductoPage] slug recibido por la ruta", {
    rawSlug,
    normalizedSlug: slug,
  });

  const product = getProductBySlug(slug);

  if (!product) {
    console.log("[ProductoPage] producto NO encontrado", {
      rawSlug,
      normalizedSlug: slug,
    });
    notFound();
  }

  console.log("[ProductoPage] producto encontrado", {
    slug: product.slug,
    id: product.id,
    name: product.name,
  });

  return (
    <StoreShell>
      <ProductPageView product={product} />
    </StoreShell>
  );
}
