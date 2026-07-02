import type { Metadata } from "next";
import { StoreShell } from "@/components/layout/StoreShell";
import { ShopPageView } from "@/components/catalog/ShopPageView";

export const metadata: Metadata = {
  title: "Tienda — Techstylebv",
  description:
    "Explorá accesorios, tecnología y productos para el hogar. Buscá por nombre, categoría o modelo.",
};

export default function TiendaPage() {
  return (
    <StoreShell>
      <ShopPageView />
    </StoreShell>
  );
}
