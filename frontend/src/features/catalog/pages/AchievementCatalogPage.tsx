import { useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router";
import { useAuthStore } from "../../auth/store/authStore";
import { AchievementCard } from "../components/AchievementCard";
import { AchievementCatalogHero } from "../components/AchievementCatalogHero";
import { getAchievementCatalogStats } from "../components/achievementCatalogUtils";
import { fetchAchievementCatalog } from "../services/catalogApi";
import type { AchievementCatalogItem } from "../types";

type AchievementFilter = "all" | "unlocked" | "in-progress" | "locked" | "elite";

export const AchievementCatalogPage = () => {
  const session = useAuthStore((state) => state.session);
  const isAuthInitialized = useAuthStore((state) => state.isAuthInitialized);
  const [achievements, setAchievements] = useState<AchievementCatalogItem[]>(
    [],
  );
  const [activeFilter, setActiveFilter] = useState<AchievementFilter>("all");
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
              : "Nie udało się pobrać katalogu osiągnięć.",
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

  const filteredAchievements = useMemo(() => {
    switch (activeFilter) {
      case "unlocked":
        return achievements.filter((achievement) => achievement.isUnlocked);
      case "in-progress":
        return achievements.filter(
          (achievement) =>
            !achievement.isUnlocked && achievement.currentProgress > 0,
        );
      case "locked":
        return achievements.filter(
          (achievement) =>
            !achievement.isUnlocked && achievement.currentProgress <= 0,
        );
      case "elite":
        return achievements.filter((achievement) => achievement.isElite);
      default:
        return achievements;
    }
  }, [activeFilter, achievements]);

  const filterOptions: Array<{
    key: AchievementFilter;
    label: string;
    count: number;
  }> = [
    { key: "all", label: "Wszystkie", count: stats.total },
    { key: "unlocked", label: "Zdobyte", count: stats.unlocked },
    { key: "in-progress", label: "W toku", count: stats.inProgress },
    {
      key: "locked",
      label: "Zablokowane",
      count: stats.total - stats.unlocked - stats.inProgress,
    },
    { key: "elite", label: "Elitarne", count: stats.elite },
  ];

  if (!isAuthInitialized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0c0c21] text-[#e5e3ff]">
        <div className="glass-panel rounded-[2rem] px-8 py-6 text-center">
          <p className="font-headline text-lg font-bold">Ładowanie...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0c0c21] px-4 pb-28 pt-6 text-[#e5e3ff] sm:px-6 lg:px-8 lg:py-10">
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
            Ładowanie osiągnięć...
          </div>
        ) : achievements.length === 0 ? (
          <div className="glass-panel rounded-[2rem] px-6 py-12 text-center">
            <p className="font-headline text-2xl font-black text-[#f4d5ff]">
              Brak osiągnięć do wyświetlenia
            </p>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-[#aaa8c4]">
              W tym środowisku nie ma jeszcze dostępnych osiągnięć.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            <section className="glass-panel rounded-[2rem] p-5 ring-1 ring-white/10">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[#8ff5ff]">
                    Filtr osiągnięć
                  </p>
                  <h2 className="mt-2 font-headline text-3xl font-black text-[#f4d5ff]">
                    Jednolity widok kolekcji
                  </h2>
                  <p className="mt-2 max-w-2xl text-sm text-[#aaa8c4]">
                    Przełączaj widok między stanami odblokowania i szybciej
                    wychwytuj osiągnięcia elitarne.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {filterOptions.map((filterOption) => {
                    const isActive = filterOption.key === activeFilter;

                    return (
                      <button
                        key={filterOption.key}
                        type="button"
                        onClick={() => setActiveFilter(filterOption.key)}
                        className={`inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-xs font-black uppercase tracking-[0.18em] transition-all ${
                          isActive
                            ? "bg-gradient-to-r from-[#e08dff] to-[#ff68a7] text-[#460024] shadow-[0_10px_28px_rgba(224,141,255,0.2)]"
                            : "bg-white/5 text-[#aaa8c4] ring-1 ring-white/10 hover:bg-white/10 hover:text-[#f4d5ff]"
                        }`}
                      >
                        <span>{filterOption.label}</span>
                        <span
                          className={`rounded-full px-2 py-1 text-[10px] ${
                            isActive
                              ? "bg-black/15 text-[#460024]"
                              : "bg-black/20 text-[#8ff5ff]"
                          }`}
                        >
                          {filterOption.count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </section>

            {filteredAchievements.length === 0 ? (
              <div className="glass-panel rounded-[2rem] px-6 py-12 text-center text-[#aaa8c4]">
                Ten filtr nie zwrócił żadnych osiągnięć.
              </div>
            ) : (
              <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                {filteredAchievements.map((achievement) => (
                  <AchievementCard
                    key={achievement.code}
                    achievement={achievement}
                  />
                ))}
              </section>
            )}
          </div>
        )}
      </main>
    </div>
  );
};
