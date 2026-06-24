import { StoreShell } from "@/components/layout/StoreShell";
import { Hero } from "@/components/sections/Hero";
import { HomePageBody } from "@/components/home/HomePageBody";
import { Benefits } from "@/components/sections/Benefits";
import { Testimonials } from "@/components/sections/Testimonials";
import { Newsletter } from "@/components/sections/Newsletter";
import { getProducts } from "@/lib/products";
import {
  getHomeBestsellers,
  getHomeFeatured,
  getHomeNew,
} from "@/lib/home";

export default function Home() {
  const products = getProducts();

  return (
    <StoreShell withTopPadding={false}>
      <main>
        <Hero />
        <HomePageBody
          featured={getHomeFeatured(products)}
          newest={getHomeNew(products)}
          bestsellers={getHomeBestsellers(products)}
        />
        <Benefits />
        <Testimonials />
        <Newsletter />
      </main>
    </StoreShell>
  );
}
