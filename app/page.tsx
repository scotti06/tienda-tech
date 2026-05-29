import { StoreShell } from "@/components/layout/StoreShell";
import { Hero } from "@/components/sections/Hero";
import { TrustBar } from "@/components/sections/TrustBar";
import { Categories } from "@/components/sections/Categories";
import { ProductGrid } from "@/components/sections/ProductGrid";
import { Benefits } from "@/components/sections/Benefits";
import { Testimonials } from "@/components/sections/Testimonials";
import { Newsletter } from "@/components/sections/Newsletter";

export default function Home() {
  return (
    <StoreShell withTopPadding={false}>
      <main>
        <Hero />
        <TrustBar />
        <Categories />
        <ProductGrid />
        <Benefits />
        <Testimonials />
        <Newsletter />
      </main>
    </StoreShell>
  );
}
