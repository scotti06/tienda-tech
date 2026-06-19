import { StoreShell } from "@/components/layout/StoreShell";
import { Hero } from "@/components/sections/Hero";
import { HomePageBody } from "@/components/home/HomePageBody";
import { Benefits } from "@/components/sections/Benefits";
import { Testimonials } from "@/components/sections/Testimonials";
import { Newsletter } from "@/components/sections/Newsletter";

export default function Home() {
  return (
    <StoreShell withTopPadding={false}>
      <main>
        <Hero />
        <HomePageBody />
        <Benefits />
        <Testimonials />
        <Newsletter />
      </main>
    </StoreShell>
  );
}
