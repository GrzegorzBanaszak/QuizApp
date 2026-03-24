import { FooterSection } from "@/app/components/landing/footer-section";
import { TopNav } from "@/app/components/landing/top-nav";
import { MultiplayerHero } from "@/app/components/multiplayer/multiplayer-hero";
import { MultiplayerModes } from "@/app/components/multiplayer/multiplayer-modes";
import { MultiplayerQuickPlay } from "@/app/components/multiplayer/multiplayer-quick-play";
import { MultiplayerSocial } from "@/app/components/multiplayer/multiplayer-social";
import navLinks from "@/consts/navLinks";

export default function MultiplayerPage() {
  return (
    <main className="relative overflow-hidden bg-surface text-on-surface">
      <TopNav links={navLinks} activeHref="/multiplayer" />

      <div className="section-shell space-y-20 px-6 pb-24 pt-32">
        <MultiplayerHero />
        <MultiplayerQuickPlay />
        <MultiplayerModes />
        <MultiplayerSocial />
      </div>

      <FooterSection />
    </main>
  );
}
