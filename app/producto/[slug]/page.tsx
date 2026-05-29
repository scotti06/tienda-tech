import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StoreShell } from "@/components/layout/StoreShell";
import { ProductPageView } from "@/components/catalog/ProductPageView";
import { products } from "@/lib/data";
import { getProductBySlug } from "@/lib/catalog";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { title: "Producto — Techstylebv" };
  return {
    title: `${product.name} — Techstylebv`,
    description: `Consultá disponibilidad y precio de ${product.name} en Techstylebv.`,
  };
}

export default async function ProductoPage({ params }: PageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  return (
    <StoreShell>
      <ProductPageView product={product} />
    </StoreShell>
  );
}
