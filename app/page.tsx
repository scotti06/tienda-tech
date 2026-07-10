import { StoreShell } from "@/components/layout/StoreShell";
import { Hero } from "@/components/sections/Hero";
import { HomePageBody } from "@/components/home/HomePageBody";
import { Benefits } from "@/components/sections/Benefits";
import { getProducts } from "@/lib/products";
import { getHomeFeatured } from "@/lib/home";

export default async function Home() {
  const products = await getProducts();

  return (
    <StoreShell withTopPadding={false}>
      <main>
        <Hero />
        <HomePageBody featured={getHomeFeatured(products)} />
        <Benefits />
      </main>
    </StoreShell>
  );
}
