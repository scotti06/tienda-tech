import type { Metadata } from "next";
import { Suspense } from "react";
import { StoreShell } from "@/components/layout/StoreShell";
import { ShopPageBody } from "@/components/catalog/ShopPageBody";
import { ShopTiendaPageSkeleton } from "@/components/catalog/ShopTiendaPageSkeleton";
import { getShopProducts } from "@/lib/products";

export const metadata: Metadata = {
  title: "Tienda — Techstylebv",
  description:
    "Explorá accesorios, tecnología y productos para el hogar. Buscá por nombre, categoría o modelo.",
};

export default async function TiendaPage() {
  const products = await getShopProducts();

  return (
    <StoreShell>
      <Suspense fallback={<ShopTiendaPageSkeleton />}>
        <ShopPageBody products={products} />
      </Suspense>
    </StoreShell>
  );
}
