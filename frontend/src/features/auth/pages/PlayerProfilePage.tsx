import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router";
import { fetchAchievementCatalog, fetchAvatarCatalog } from "../../catalog/services/catalogApi";
import type {
  AchievementCatalogItem,
  AvatarCatalogItem,
} from "../../catalog/types";
import { useAuthStore } from "../store/authStore";
import { fetchSingleplayerCategories } from "../../singleplayer/services/singleplayerApi";
import type { SingleplayerCategory } from "../../singleplayer/types/singleplayer";
import { logout } from "../services/authApi";

type ProfileStats = {
  achievements: AchievementCatalogItem[];
  avatars: AvatarCatalogItem[];
  categories: SingleplayerCategory[];
};

const categoryVisuals: Record<
  string,
  { icon: string; tone: "primary" | "secondary" | "tertiary" | "neutral" }
> = {
  "wiedza ogolna": { icon: "public", tone: "primary" },
  nauka: { icon: "science", tone: "tertiary" },
  historia: { icon: "history_edu", tone: "neutral" },
  gaming: { icon: "stadia_controller", tone: "secondary" },
  gry: { icon: "stadia_controller", tone: "secondary" },
  sport: { icon: "sports_esports", tone: "tertiary" },
  muzyka: { icon: "music_note", tone: "secondary" },
  film: { icon: "theaters", tone: "secondary" },
  filmy: { icon: "theaters", tone: "secondary" },
  technologia: { icon: "memory", tone: "tertiary" },
  geografia: { icon: "travel_explore", tone: "primary" },
};

function normalizeCategoryName(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function resolveCategoryVisual(categoryName: string) {
  return (
    categoryVisuals[normalizeCategoryName(categoryName)] ?? {
      icon: "hub",
      tone: "neutral" as const,
    }
  );
}

function formatProviderLabel(authProvider: string): string {
  if (authProvider === "Google") {
    return "Zalogowano przez Google";
  }

  if (authProvider === "Facebook") {
    return "Zalogowano przez Facebook";
  }

  return "Tryb gościa";
}

function formatCompactNumber(value: number): string {
  return new Intl.NumberFormat("pl-PL").format(value);
}

export const PlayerProfilePage = () => {
  const navigate = useNavigate();
  const session = useAuthStore((state) => state.session);
  const isAuthInitialized = useAuthStore((state) => state.isAuthInitialized);
  const setSession = useAuthStore((state) => state.setSession);
  const [stats, setStats] = useState<ProfileStats>({
    achievements: [],
    avatars: [],
    categories: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLogoutLoading, setIsLogoutLoading] = useState(false);

  useEffect(() => {
    if (!session) {
      return;
    }

    let isCancelled = false;

    void Promise.all([
      fetchAchievementCatalog(),
      fetchAvatarCatalog(),
      fetchSingleplayerCategories(),
    ])
      .then(([achievements, avatars, categories]) => {
        if (!isCancelled) {
          setStats({ achievements, avatars, categories });
        }
      })
      .catch((loadError) => {
        if (!isCancelled) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Nie udało się pobrać danych profilu gracza.",
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

  if (!isAuthInitialized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0c0c21] text-[#e5e3ff]">
        <div className="glass-panel rounded-[2rem] px-8 py-6 text-center">
          <p className="font-headline text-lg font-bold">Ładowanie profilu...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/" replace />;
  }

  const unlockedAchievements = stats.achievements.filter(
    (achievement) => achievement.isUnlocked,
  ).length;
  const unlockedAvatars = stats.avatars.filter((avatar) => avatar.isUnlocked).length;
  const authProvider = session.profile.authProvider ?? "Guest";
  const providerLabel = formatProviderLabel(authProvider);
  const level = session.profile.progress?.level ?? 1;

  const handleLogout = async () => {
    setIsLogoutLoading(true);
    setError(null);

    try {
      await logout();
      setSession(null);
      navigate("/auth/login", { replace: true });
    } catch (logoutError) {
      setError(
        logoutError instanceof Error
          ? logoutError.message
          : "Nie udało się wylogować.",
      );
    } finally {
      setIsLogoutLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0c0c21] px-4 py-6 text-[#e5e3ff] sm:px-6 lg:px-8 lg:py-10">
      <div className="pointer-events-none fixed left-[-14%] top-[-12%] h-[44vw] w-[44vw] max-h-[34rem] max-w-[34rem] rounded-full bg-[#e08dff]/12 blur-[140px]" />
      <div className="pointer-events-none fixed right-[-12%] top-[16%] h-[24rem] w-[24rem] rounded-full bg-[#8ff5ff]/10 blur-[130px]" />
      <div className="pointer-events-none fixed bottom-[-16%] right-[-8%] h-[48vw] w-[48vw] max-h-[34rem] max-w-[34rem] rounded-full bg-[#ff68a7]/14 blur-[150px]" />

      <main className="relative z-10 mx-auto flex w-full max-w-4xl flex-col gap-10 pb-24 md:pb-10">
        <section className="flex flex-col items-center gap-8 md:flex-row md:items-start">
          <div className="group relative">
            <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-[#e08dff] to-[#ff68a7] blur opacity-40 transition duration-500 group-hover:opacity-75" />
            <div className="relative h-32 w-32 overflow-hidden rounded-full border-2 border-[#e08dff]/50 bg-[#171730] shadow-[0_0_30px_rgba(224,141,255,0.2)]">
              <img
                src={session.profile.avatarUrl}
                alt={session.profile.username}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute bottom-1 right-1 rounded-full bg-[#8ff5ff] px-2 py-1 text-[10px] font-bold uppercase tracking-tight text-[#005d63] shadow-lg">
              Poziom {level}
            </div>
          </div>

          <div className="flex-1 space-y-4 text-center md:text-left">
            <div className="space-y-2">
              <h1 className="font-headline text-4xl font-black tracking-tight text-[#e5e3ff] md:text-5xl">
                {session.profile.username}
              </h1>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#46465e]/30 bg-[#1d1d39] px-3 py-1">
                <span className="material-symbols-outlined text-base text-[#8ff5ff]">
                  {authProvider === "Google"
                    ? "google_plus_reshare"
                    : authProvider === "Facebook"
                      ? "groups"
                      : "person"}
                </span>
                <span className="text-xs font-medium text-[#aaa8c4]">
                  {providerLabel}
                </span>
              </div>
            </div>

            <div className="mx-auto grid max-w-md grid-cols-2 gap-3 md:mx-0">
              <div className="glass-panel rounded-[1.5rem] px-4 py-4">
                <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#aaa8c4]">
                  Monety
                </p>
                <p className="mt-2 text-2xl font-black text-[#8ff5ff]">
                  {formatCompactNumber(session.profile.coins)}
                </p>
              </div>
              <div className="glass-panel rounded-[1.5rem] px-4 py-4">
                <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#aaa8c4]">
                  Doświadczenie
                </p>
                <p className="mt-2 text-2xl font-black text-[#e08dff]">
                  {formatCompactNumber(session.profile.totalExperience)} XP
                </p>
              </div>
            </div>
          </div>
        </section>

        {error ? (
          <div className="rounded-[1.75rem] bg-[#ff68a7]/10 px-5 py-4 text-sm text-[#ffd1e0] ring-1 ring-[#ff68a7]/20">
            {error}
          </div>
        ) : null}

        <section className="space-y-6">
          <div className="flex items-center justify-between gap-4">
            <h2 className="flex items-center gap-2 font-headline text-xl font-bold uppercase tracking-wide text-[#e08dff]">
              <span className="material-symbols-outlined">query_stats</span>
              Twoje statystyki
            </h2>
            <Link
              to="/profile/edit"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#ff68a7] to-[#e08dff] px-5 py-3 text-xs font-black uppercase tracking-[0.18em] text-[#460024] transition-transform hover:scale-105 active:scale-95"
            >
              <span className="material-symbols-outlined text-[18px]">edit</span>
              Edytuj profil
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="glass-panel group flex items-center gap-5 rounded-[2rem] p-6 transition-all hover:bg-[#29294a]/40">
              <div className="flex h-14 w-14 items-center justify-center rounded-[1.25rem] bg-[#d978ff]/20 text-[#e08dff] shadow-[0_0_20px_rgba(224,141,255,0.3)] transition-transform group-hover:scale-110">
                <span className="material-symbols-outlined text-3xl">
                  military_tech
                </span>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#aaa8c4]">
                  Osiągnięcia
                </p>
                <p className="text-2xl font-black text-[#e5e3ff]">
                  {unlockedAchievements} / {stats.achievements.length}
                </p>
                <div className="mt-2 h-1 w-32 overflow-hidden rounded-full bg-black">
                  <div
                    className="h-full bg-[#e08dff]"
                    style={{
                      width:
                        stats.achievements.length === 0
                          ? "0%"
                          : `${(unlockedAchievements / stats.achievements.length) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="glass-panel group flex items-center gap-5 rounded-[2rem] p-6 transition-all hover:bg-[#29294a]/40">
              <div className="flex h-14 w-14 items-center justify-center rounded-[1.25rem] bg-[#8ff5ff]/20 text-[#8ff5ff] shadow-[0_0_20px_rgba(143,245,255,0.3)] transition-transform group-hover:scale-110">
                <span className="material-symbols-outlined text-3xl">face</span>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#aaa8c4]">
                  Kolekcja awatarów
                </p>
                <p className="text-2xl font-black text-[#e5e3ff]">
                  {unlockedAvatars} / {stats.avatars.length}
                </p>
                <div className="mt-2 h-1 w-32 overflow-hidden rounded-full bg-black">
                  <div
                    className="h-full bg-[#8ff5ff]"
                    style={{
                      width:
                        stats.avatars.length === 0
                          ? "0%"
                          : `${(unlockedAvatars / stats.avatars.length) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="flex items-center gap-2 font-headline text-xl font-bold uppercase tracking-wide text-[#8ff5ff]">
            <span className="material-symbols-outlined">trending_up</span>
            Postęp w kategoriach
          </h2>

          <div className="relative overflow-hidden rounded-[2rem] bg-[#171730] p-8">
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#e08dff]/5 blur-[100px]" />

            {isLoading ? (
              <div className="relative z-10 rounded-[1.5rem] bg-[#111128] px-4 py-8 text-center text-sm text-[#aaa8c4]">
                Ładowanie postępu kategorii...
              </div>
            ) : stats.categories.length === 0 ? (
              <div className="relative z-10 rounded-[1.5rem] bg-[#111128] px-4 py-8 text-center text-sm text-[#aaa8c4]">
                Brak danych o kategoriach singleplayer.
              </div>
            ) : (
              <div className="relative z-10 space-y-8">
                {stats.categories.map((category) => {
                  const percent =
                    category.totalLevels === 0
                      ? 0
                      : Math.round(
                          (category.completedLevelsCount / category.totalLevels) * 100,
                        );
                  const visual = resolveCategoryVisual(category.name);
                  const toneClass =
                    visual.tone === "primary"
                      ? "text-[#e08dff]"
                      : visual.tone === "secondary"
                        ? "text-[#ff68a7]"
                        : visual.tone === "tertiary"
                          ? "text-[#8ff5ff]"
                          : "text-[#aaa8c4]";
                  const barClass =
                    visual.tone === "primary"
                      ? "from-[#bc00fb] to-[#e08dff]"
                      : visual.tone === "secondary"
                        ? "from-[#e10080] to-[#ff68a7]"
                        : visual.tone === "tertiary"
                          ? "from-[#00deec] to-[#8ff5ff]"
                          : "";

                  return (
                    <div key={category.id} className="space-y-3">
                      <div className="flex items-end justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <span
                            className={`material-symbols-outlined ${toneClass}`}
                          >
                            {visual.icon}
                          </span>
                          <span className="font-bold text-[#e5e3ff]">
                            {category.name}
                          </span>
                        </div>
                        <span className={`text-lg font-black ${toneClass}`}>
                          {percent}%
                        </span>
                      </div>

                      <div className="h-3 w-full rounded-full bg-black p-[2px]">
                        <div
                          className={
                            visual.tone === "neutral"
                              ? "h-full rounded-full bg-[#46465e] opacity-60"
                              : `h-full rounded-full bg-gradient-to-r ${barClass} shadow-[0_0_12px_rgba(224,141,255,0.25)]`
                          }
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        <div className="flex flex-col justify-center gap-3 pt-2 sm:flex-row">
          <Link
            to="/profile/edit"
            className="inline-flex items-center justify-center gap-3 rounded-full bg-gradient-to-r from-[#e08dff] to-[#d978ff] px-10 py-4 text-sm font-black uppercase tracking-[0.18em] text-[#4f006c] transition-all hover:scale-105 active:scale-95"
          >
            <span className="material-symbols-outlined">edit</span>
            Edytuj profil
          </Link>
          <button
            type="button"
            onClick={() => {
              void handleLogout();
            }}
            disabled={isLogoutLoading}
            className="inline-flex items-center justify-center gap-3 rounded-full bg-[#ff68a7]/15 px-10 py-4 text-sm font-black uppercase tracking-[0.18em] text-[#ff9cc2] transition-all hover:scale-105 hover:bg-[#ff68a7]/25 active:scale-95 disabled:cursor-wait disabled:opacity-60"
          >
            <span className="material-symbols-outlined">logout</span>
            {isLogoutLoading ? "Wylogowywanie..." : "Wyloguj"}
          </button>
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-3 rounded-full bg-[#29294a] px-10 py-4 text-sm font-black uppercase tracking-[0.18em] text-[#e5e3ff] transition-all hover:scale-105 active:scale-95"
          >
            <span className="material-symbols-outlined">arrow_back</span>
            Powrót do menu
          </Link>
        </div>
      </main>
    </div>
  );
};
