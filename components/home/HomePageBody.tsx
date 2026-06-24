"use client";

import { useState } from "react";
import { Categories } from "@/components/sections/Categories";
import { TrustBar } from "@/components/sections/TrustBar";
import { MobileCategoryNav } from "@/components/home/MobileCategoryNav";
import { HomeProductSections } from "@/components/home/HomeProductSections";
import type { Product } from "@/lib/data";
import type { HomeCategoryFilter } from "@/lib/home";

type HomePageBodyProps = {
  featured: Product[];
  newest: Product[];
  bestsellers: Product[];
};

export function HomePageBody({
  featured,
  newest,
  bestsellers,
}: HomePageBodyProps) {
  const [activeCategory, setActiveCategory] =
    useState<HomeCategoryFilter>("all");

  return (
    <>
      <Categories />
      <MobileCategoryNav
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />
      <HomeProductSections
        activeCategory={activeCategory}
        featured={featured}
        newest={newest}
        bestsellers={bestsellers}
      />
      <TrustBar />
    </>
  );
}
