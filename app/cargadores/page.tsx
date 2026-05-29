import type { Metadata } from "next";
import { StoreShell } from "@/components/layout/StoreShell";
import { CategoryPageView } from "@/components/catalog/CategoryPageView";
import { getCategoryById } from "@/lib/catalog";
import { notFound } from "next/navigation";

const category = getCategoryById("carga");

export const metadata: Metadata = {
  title: "Cargadores originales Apple — Techstylebv",
  description: category?.hero.description,
};

export default function CargadoresPage() {
  if (!category) notFound();
  return (
    <StoreShell>
      <CategoryPageView category={category} />
    </StoreShell>
  );
}
