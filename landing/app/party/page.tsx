import { FooterSection } from "@/app/components/landing/footer-section";
import { TopNav } from "@/app/components/landing/top-nav";
import { PartyFeatures } from "@/app/components/party/party-features";
import { PartyHero } from "@/app/components/party/party-hero";
import { PartyHowItWorks } from "@/app/components/party/party-how-it-works";
import { PartyMobileDock } from "@/app/components/party/party-mobile-dock";
import navLinks from "@/consts/navLinks";

export default function PartyPage() {
  return (
    <main className="relative overflow-hidden bg-surface text-on-surface">
      <TopNav links={navLinks} activeHref="/party" />
      <div className="flex min-h-screen justify-center">
        <main className="min-w-0 flex-1 pb-24 md:pb-12">
          <PartyHero />
          <PartyHowItWorks />
          <PartyFeatures />
        </main>
      </div>
      <FooterSection />
      <PartyMobileDock />
    </main>
  );
}
