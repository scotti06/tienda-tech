import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { StoreShell } from "@/components/layout/StoreShell";
import { ShopPageBody } from "@/components/catalog/ShopPageBody";
import { ShopTiendaPageSkeleton } from "@/components/catalog/ShopTiendaPageSkeleton";
import { getShopProducts } from "@/lib/products";
import { shopGroups, type ShopGroupId } from "@/lib/shop";

type TiendaGrupoPageProps = {
  params: Promise<{ grupo: string }>;
};

function getGroup(grupo: string) {
  return shopGroups.find((group) => group.id === grupo);
}

export function generateStaticParams() {
  return shopGroups.map((group) => ({ grupo: group.id }));
}

export async function generateMetadata({
  params,
}: TiendaGrupoPageProps): Promise<Metadata> {
  const { grupo } = await params;
  const group = getGroup(grupo);

  if (!group) {
    return { title: "Tienda — Techstylebv" };
  }

  return {
    title: `${group.name} — Tienda — Techstylebv`,
    description: group.description,
  };
}

export default async function TiendaGrupoPage({ params }: TiendaGrupoPageProps) {
  const { grupo } = await params;
  const group = getGroup(grupo);

  if (!group) {
    notFound();
  }

  const products = await getShopProducts();

  return (
    <StoreShell>
      <Suspense fallback={<ShopTiendaPageSkeleton />}>
        <ShopPageBody
          products={products}
          initialGroup={group.id as ShopGroupId}
        />
      </Suspense>
    </StoreShell>
  );
}
