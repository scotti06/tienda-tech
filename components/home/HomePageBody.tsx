"use client";

import { useState } from "react";
import { Categories } from "@/components/sections/Categories";
import { TrustBar } from "@/components/sections/TrustBar";
import { MobileCategoryNav } from "@/components/home/MobileCategoryNav";
import { HomeProductSections } from "@/components/home/HomeProductSections";
import type { HomeCategoryFilter } from "@/lib/home";

export function HomePageBody() {
  const [activeCategory, setActiveCategory] =
    useState<HomeCategoryFilter>("all");

  return (
    <>
      <Categories />
      <MobileCategoryNav
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />
      <HomeProductSections activeCategory={activeCategory} />
      <TrustBar />
    </>
  );
}
