import { StoreShell } from "@/components/layout/StoreShell";
import { ShopTiendaPageSkeleton } from "@/components/catalog/ShopTiendaPageSkeleton";

export default function TiendaLoading() {
  return (
    <StoreShell>
      <ShopTiendaPageSkeleton />
    </StoreShell>
  );
}
