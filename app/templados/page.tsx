import type { Metadata } from "next";
import { StoreShell } from "@/components/layout/StoreShell";
import { CategoryPageView } from "@/components/catalog/CategoryPageView";
import { getCategoryById } from "@/lib/catalog";
import { notFound } from "next/navigation";

const category = getCategoryById("vidrios");

export const metadata: Metadata = {
  title: "Vidrios templados — Techstylebv",
  description: category?.hero.description,
};

export default function TempladosPage() {
  if (!category) notFound();
  return (
    <StoreShell>
      <CategoryPageView category={category} />
    </StoreShell>
  );
}
