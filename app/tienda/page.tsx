import type { Metadata } from "next";
import { StoreShell } from "@/components/layout/StoreShell";
import { ShopPageBody } from "@/components/catalog/ShopPageBody";
import { getProducts } from "@/lib/products";

export const metadata: Metadata = {
  title: "Tienda — Techstylebv",
  description:
    "Explorá accesorios, tecnología y productos para el hogar. Buscá por nombre, categoría o modelo.",
};

export default async function TiendaPage() {
  const products = await getProducts();

  return (
    <StoreShell>
      <ShopPageBody products={products} />
    </StoreShell>
  );
}
