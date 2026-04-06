import { useEffect, useMemo, useState } from "react";
import { Link, Navigate } from "react-router";
import { useAuthStore } from "../../auth/store/authStore";
import { fetchAchievementCatalog } from "../services/catalogApi";
import type { AchievementCatalogItem } from "../types";

export const AchievementCatalogPage = () => {
  const session = useAuthStore((state) => state.session);
  const isAuthInitialized = useAuthStore((state) => state.isAuthInitialized);
  const [achievements, setAchievements] = useState<AchievementCatalogItem[]>(
    [],
  );
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
              : "Nie udalo sie pobrac katalogu achievementow.",
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

  const stats = useMemo(() => {
    const total = achievements.length;
    const unlocked = achievements.filter((item) => item.isUnlocked).length;
    const locked = total - unlocked;
    const rewardAvatars = achievements.filter(
      (item) => item.rewardType === "Avatar",
    ).length;

    return { total, unlocked, locked, rewardAvatars };
  }, [achievements]);

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
    <div className="min-h-screen bg-[#0c0c21] px-6 py-10 text-[#e5e3ff] md:px-8">
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <header className="glass-panel rounded-[2rem] p-6 md:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.28em] text-[#8ff5ff]">
                Achievement catalog
              </p>
              <h1 className="mt-2 font-headline text-4xl font-black tracking-tight text-[#f4d5ff] md:text-5xl">
                Wszystkie achievementy i warunki ich zdobycia
              </h1>
              <p className="mt-3 max-w-3xl text-sm text-[#aaa8c4] md:text-base">
                Backend zwraca pelny opis warunku, a takze opis nagrody. Na tej
                podstawie frontend moze pokazac, co trzeba zrobic i co zostanie
                przyznane.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                to="/"
                className="rounded-full border border-white/10 px-5 py-3 text-sm font-bold text-[#e5e3ff] transition-colors hover:bg-white/5"
              >
                Powrot
              </Link>
              <Link
                to="/avatars"
                className="rounded-full bg-gradient-to-r from-[#e08dff] to-[#d978ff] px-5 py-3 text-sm font-black tracking-[0.18em] text-[#4f006c] transition-transform hover:scale-105 active:scale-95"
              >
                AWATARY
              </Link>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
            <CatalogStat label="Wszystkie" value={stats.total} tone="from-[#e08dff] to-[#d978ff]" />
            <CatalogStat label="Odblokowane" value={stats.unlocked} tone="from-[#8ff5ff] to-[#0d8f97]" />
            <CatalogStat label="Zablokowane" value={stats.locked} tone="from-[#ff68a7] to-[#c94d84]" />
            <CatalogStat label="Nagrody avatar" value={stats.rewardAvatars} tone="from-[#ffcf7d] to-[#ff9f4d]" />
          </div>
        </header>

        {error ? (
          <div className="rounded-[1.5rem] border border-[#ff68a7]/30 bg-[#ff68a7]/10 px-5 py-4 text-sm text-[#ffd1e0]">
            {error}
          </div>
        ) : null}

        {isLoading ? (
          <div className="glass-panel rounded-[2rem] px-6 py-10 text-center text-[#aaa8c4]">
            Ladowanie achievementow...
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
            {achievements.map((achievement) => (
              <article
                key={achievement.code}
                className="glass-panel rounded-[2rem] p-5 transition-transform duration-200 hover:-translate-y-1"
              >
                <div className="flex items-start gap-4">
                  <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-[1.4rem] bg-black/20 ring-2 ring-white/10">
                    {achievement.iconUrl ? (
                      <img
                        src={achievement.iconUrl}
                        alt={achievement.name}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-[#8ff5ff]">
                        <span className="material-symbols-outlined text-3xl">
                          emoji_events
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-headline text-2xl font-black tracking-tight text-[#f4d5ff]">
                        {achievement.name}
                      </h2>
                      <StatusBadge achievement={achievement} />
                    </div>
                    <p className="mt-2 text-sm text-[#aaa8c4]">
                      {achievement.description}
                    </p>
                  </div>
                </div>

                <dl className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-1">
                  <InfoCell
                    label="Jak zdobyc"
                    value={achievement.conditionDescription}
                  />
                  <InfoCell
                    label="Nagroda"
                    value={achievement.rewardDescription || "Brak opisu nagrody"}
                  />
                </dl>

                <div className="mt-4 flex flex-wrap gap-2">
                  {achievement.rewardAvatarImageUrl ? (
                    <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-2 text-xs font-bold text-[#8ff5ff]">
                      <img
                        src={achievement.rewardAvatarImageUrl}
                        alt={achievement.rewardAvatarKey ?? achievement.name}
                        className="h-5 w-5 rounded-full object-cover"
                      />
                      Reward avatar
                    </span>
                  ) : null}
                  {achievement.rewardCoins ? (
                    <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-2 text-xs font-bold text-[#ffcf7d]">
                      <span className="material-symbols-outlined text-sm">
                        monetization_on
                      </span>
                      {achievement.rewardCoins} coins
                    </span>
                  ) : null}
                  {achievement.awardedAt ? (
                    <span className="inline-flex items-center gap-2 rounded-full bg-emerald-400/15 px-3 py-2 text-xs font-bold text-emerald-300">
                      <span className="material-symbols-outlined text-sm">
                        verified
                      </span>
                      Zdobyte
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-2 rounded-full bg-[#ff68a7]/15 px-3 py-2 text-xs font-bold text-[#ff9fbf]">
                      <span className="material-symbols-outlined text-sm">
                        lock
                      </span>
                      Do zdobycia
                    </span>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

const CatalogStat = ({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: string;
}) => (
  <div className="rounded-[1.5rem] bg-black/15 p-4">
    <div
      className={`inline-flex rounded-full bg-gradient-to-r ${tone} px-3 py-1 text-[10px] font-black uppercase tracking-[0.24em] text-[#0c0c21]`}
    >
      {label}
    </div>
    <div className="font-headline mt-3 text-3xl font-black text-[#e5e3ff]">
      {value}
    </div>
  </div>
);

const StatusBadge = ({
  achievement,
}: {
  achievement: AchievementCatalogItem;
}) => {
  const label = achievement.isUnlocked ? "Zdobyte" : "Zablokowane";
  const className = achievement.isUnlocked
    ? "bg-emerald-400/15 text-emerald-300"
    : "bg-[#ff68a7]/15 text-[#ff9fbf]";

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.22em] ${className}`}
    >
      {label}
    </span>
  );
};

const InfoCell = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-[1.1rem] bg-black/15 px-4 py-3">
    <dt className="text-[10px] font-black uppercase tracking-[0.24em] text-[#aaa8c4]">
      {label}
    </dt>
    <dd className="mt-1 text-sm font-semibold text-[#e5e3ff]">{value}</dd>
  </div>
);
