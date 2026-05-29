import type { Metadata } from "next";
import { StoreShell } from "@/components/layout/StoreShell";
import { ShopPageView } from "@/components/catalog/ShopPageView";

export const metadata: Metadata = {
  title: "Tienda — Techstylebv",
  description:
    "Fundas, vidrios templados, cargadores originales Apple y AirPods para iPhone.",
};

export default function TiendaPage() {
  return (
    <StoreShell>
      <ShopPageView />
    </StoreShell>
  );
}
