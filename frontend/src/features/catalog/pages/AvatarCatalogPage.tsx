import { useEffect, useMemo, useState } from "react";
import { Link, Navigate } from "react-router";
import { useAuthStore } from "../../auth/store/authStore";
import { fetchAvatarCatalog } from "../services/catalogApi";
import type { AvatarCatalogItem } from "../types";

export const AvatarCatalogPage = () => {
  const session = useAuthStore((state) => state.session);
  const isAuthInitialized = useAuthStore((state) => state.isAuthInitialized);
  const [avatars, setAvatars] = useState<AvatarCatalogItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!session) {
      return;
    }

    let isCancelled = false;

    void fetchAvatarCatalog()
      .then((items) => {
        if (!isCancelled) {
          setAvatars(items);
        }
      })
      .catch((err) => {
        if (!isCancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Nie udalo sie pobrac katalogu avatarow.",
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
    const total = avatars.length;
    const unlocked = avatars.filter((avatar) => avatar.isUnlocked).length;
    const purchasable = avatars.filter((avatar) => avatar.canPurchase).length;
    const achievementLocked = avatars.filter(
      (avatar) => avatar.unlockType === "Achievement" && !avatar.isUnlocked,
    ).length;

    return { total, unlocked, purchasable, achievementLocked };
  }, [avatars]);

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
                Avatar catalog
              </p>
              <h1 className="mt-2 font-headline text-4xl font-black tracking-tight text-[#f4d5ff] md:text-5xl">
                Wszystkie dostepne avatary
              </h1>
              <p className="mt-3 max-w-3xl text-sm text-[#aaa8c4] md:text-base">
                Pelny katalog obejmuje avatary startowe, achievementowe i
                sklepowe. Publicznie widoczne sa tylko domyslne presety.
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
                to="/achievements"
                className="rounded-full bg-gradient-to-r from-[#8ff5ff] to-[#0d8f97] px-5 py-3 text-sm font-black tracking-[0.18em] text-[#003f43] transition-transform hover:scale-105 active:scale-95"
              >
                OSIAGNIECIA
              </Link>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
            <CatalogStat label="Wszystkie" value={stats.total} tone="from-[#e08dff] to-[#d978ff]" />
            <CatalogStat label="Odblokowane" value={stats.unlocked} tone="from-[#8ff5ff] to-[#0d8f97]" />
            <CatalogStat label="Do kupienia" value={stats.purchasable} tone="from-[#ffcf7d] to-[#ff9f4d]" />
            <CatalogStat label="Na achievement" value={stats.achievementLocked} tone="from-[#ff68a7] to-[#c94d84]" />
          </div>
        </header>

        {error ? (
          <div className="rounded-[1.5rem] border border-[#ff68a7]/30 bg-[#ff68a7]/10 px-5 py-4 text-sm text-[#ffd1e0]">
            {error}
          </div>
        ) : null}

        {isLoading ? (
          <div className="glass-panel rounded-[2rem] px-6 py-10 text-center text-[#aaa8c4]">
            Ladowanie katalogu avatarow...
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {avatars.map((avatar) => (
              <article
                key={avatar.id}
                className="glass-panel rounded-[2rem] p-5 transition-transform duration-200 hover:-translate-y-1"
              >
                <div className="flex items-start gap-4">
                  <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-[1.4rem] ring-2 ring-white/10">
                    <img
                      src={avatar.imageUrl}
                      alt={avatar.name}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-headline text-2xl font-black tracking-tight text-[#f4d5ff]">
                        {avatar.name}
                      </h2>
                      <StatusBadge avatar={avatar} />
                    </div>
                    <p className="mt-2 text-sm text-[#aaa8c4]">
                      {avatar.unlockDescription}
                    </p>
                  </div>
                </div>

                <dl className="mt-5 grid grid-cols-1 gap-3 text-sm md:grid-cols-2">
                  <InfoCell label="Typ" value={avatar.unlockType} />
                  <InfoCell
                    label="Stan"
                    value={
                      avatar.isSelected
                        ? "Wybrany"
                        : avatar.isUnlocked
                          ? "Dostepny"
                          : "Zablokowany"
                    }
                  />
                </dl>

                {avatar.unlockAchievementCode ? (
                  <p className="mt-4 rounded-[1.25rem] bg-black/15 px-4 py-3 text-xs text-[#aaa8c4]">
                    Powiazane achievement: {avatar.unlockAchievementCode}
                  </p>
                ) : null}
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

const StatusBadge = ({ avatar }: { avatar: AvatarCatalogItem }) => {
  const label = avatar.isSelected
    ? "Wybrany"
    : avatar.isUnlocked
      ? avatar.unlockType === "Purchase"
        ? "Kupiony"
        : "Odblokowany"
      : "Zablokowany";

  const className = avatar.isSelected
    ? "bg-[#8ff5ff]/20 text-[#8ff5ff]"
    : avatar.isUnlocked
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
