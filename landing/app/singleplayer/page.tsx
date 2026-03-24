import { FooterSection } from "@/app/components/landing/footer-section";
import { TopNav } from "@/app/components/landing/top-nav";
import { SingleplayerCategories } from "@/app/components/singleplayer/singleplayer-categories";
import { SingleplayerCta } from "@/app/components/singleplayer/singleplayer-cta";
import { SingleplayerHero } from "@/app/components/singleplayer/singleplayer-hero";
import { SingleplayerLeaderboard } from "@/app/components/singleplayer/singleplayer-leaderboard";
import { SingleplayerProgression } from "@/app/components/singleplayer/singleplayer-progression";
import navLinks from "@/consts/navLinks";

export default function SingleplayerPage() {
  return (
    <main className="relative overflow-hidden bg-surface text-on-surface">
      <TopNav links={navLinks} activeHref="/singleplayer" />

      <div className="pt-24">
        <SingleplayerHero />
        <SingleplayerCategories />
        <SingleplayerProgression />
        <SingleplayerLeaderboard />
        <SingleplayerCta />
      </div>

      <FooterSection />
    </main>
  );
}
