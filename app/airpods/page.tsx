import type { Metadata } from "next";
import { StoreShell } from "@/components/layout/StoreShell";
import { CategoryPageView } from "@/components/catalog/CategoryPageView";
import { getCategoryById } from "@/lib/catalog";
import { notFound } from "next/navigation";

const category = getCategoryById("airpods");

export const metadata: Metadata = {
  title: "AirPods — Techstylebv",
  description: category?.hero.description,
};

export default function AirpodsPage() {
  if (!category) notFound();
  return (
    <StoreShell>
      <CategoryPageView category={category} />
    </StoreShell>
  );
}
