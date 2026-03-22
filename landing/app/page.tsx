import { FooterSection } from "@/app/components/landing/footer-section";
import { HeroSection } from "@/app/components/landing/hero-section";
import { HowItWorksSection } from "@/app/components/landing/how-it-works-section";
import { ModesSection } from "@/app/components/landing/modes-section";
import { SoloSection } from "@/app/components/landing/solo-section";
import { TopNav } from "@/app/components/landing/top-nav";

export default function Home() {
  return (
    <main className="relative overflow-hidden bg-surface text-on-surface">
      <TopNav />
      <HeroSection />
      <SoloSection />
      <ModesSection />
      <HowItWorksSection />
      <FooterSection />
    </main>
  );
}
