import { useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router";
import { useAuthStore } from "../../auth/store/authStore";
import { AchievementCard } from "../components/AchievementCard";
import { AchievementCatalogHero } from "../components/AchievementCatalogHero";
import { FeaturedAchievementCard } from "../components/FeaturedAchievementCard";
import {
  getAchievementCatalogStats,
  getAchievementPriority,
} from "../components/achievementCatalogUtils";
import { fetchAchievementCatalog } from "../services/catalogApi";
import type { AchievementCatalogItem } from "../types";

export const AchievementCatalogPage = () => {
  const session = useAuthStore((state) => state.session);
  const isAuthInitialized = useAuthStore((state) => state.isAuthInitialized);
  const [achievements, setAchievements] = useState<AchievementCatalogItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!session) {
      return;
    }

    let isCancelled = false;

    void fetchAchievementCatalog()
      .then((items) => {
        if (!isCancelled) {
          setAchievements(items);
        }
      })
      .catch((err) => {
        if (!isCancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Nie udalo sie pobrac katalogu osiagniec.",
          );
        }
      })
      .finally(() => {
        if (!isCancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [session]);

  const stats = useMemo(
    () => getAchievementCatalogStats(achievements),
    [achievements],
  );

  const featuredAchievement = useMemo(() => {
    if (achievements.length === 0) {
      return null;
    }

    return [...achievements].sort((left, right) => {
      const leftScore = getAchievementPriority(left);
      const rightScore = getAchievementPriority(right);

      return rightScore - leftScore;
    })[0];
  }, [achievements]);

  const remainingAchievements = useMemo(() => {
    if (!featuredAchievement) {
      return achievements;
    }

    return achievements.filter((item) => item.code !== featuredAchievement.code);
  }, [achievements, featuredAchievement]);

  if (!isAuthInitialized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0c0c21] text-[#e5e3ff]">
        <div className="glass-panel rounded-[2rem] px-8 py-6 text-center">
          <p className="font-headline text-lg font-bold">Ladowanie...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0c0c21] px-4 py-6 text-[#e5e3ff] sm:px-6 lg:px-8 lg:py-10">
      <div className="pointer-events-none fixed left-[-12%] top-[-8%] h-[44vw] w-[44vw] max-h-[30rem] max-w-[30rem] rounded-full bg-[#e08dff]/14 blur-[120px]" />
      <div className="pointer-events-none fixed right-[-12%] top-[18%] h-[26rem] w-[26rem] rounded-full bg-[#8ff5ff]/10 blur-[140px]" />
      <div className="pointer-events-none fixed bottom-[-16%] right-[-8%] h-[48vw] w-[48vw] max-h-[34rem] max-w-[34rem] rounded-full bg-[#ff68a7]/14 blur-[140px]" />
      <div className="pointer-events-none fixed inset-x-0 bottom-0 h-1 bg-gradient-to-r from-[#e08dff] via-[#ff68a7] to-[#8ff5ff]" />

      <main className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-8">
        <AchievementCatalogHero profile={session.profile} stats={stats} />

        {error ? (
          <div className="rounded-[1.75rem] bg-[#ff68a7]/10 px-5 py-4 text-sm text-[#ffd1e0] ring-1 ring-[#ff68a7]/20">
            {error}
          </div>
        ) : null}

        {isLoading ? (
          <div className="glass-panel rounded-[2rem] px-6 py-12 text-center text-[#aaa8c4]">
            Ladowanie osiagniec...
          </div>
        ) : achievements.length === 0 ? (
          <div className="glass-panel rounded-[2rem] px-6 py-12 text-center">
            <p className="font-headline text-2xl font-black text-[#f4d5ff]">
              Brak osiagniec do wyswietlenia
            </p>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-[#aaa8c4]">
              Backend nie zwrocil jeszcze zadnych definicji osiagniec dla tego
              srodowiska.
            </p>
          </div>
        ) : (
          <>
            {featuredAchievement ? (
              <FeaturedAchievementCard achievement={featuredAchievement} />
            ) : null}

            <section className="grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-3">
              {remainingAchievements.map((achievement) => (
                <AchievementCard
                  key={achievement.code}
                  achievement={achievement}
                />
              ))}
            </section>
          </>
        )}
      </main>
    </div>
  );
};
