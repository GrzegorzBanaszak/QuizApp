import { useEffect, useMemo, useState } from "react";
import { Link, Navigate } from "react-router";
import { useAuthStore } from "../../auth/store/authStore";
import { AvatarCatalogActiveAvatar } from "../components/AvatarCatalogActiveAvatar";
import { AvatarCatalogSection } from "../components/AvatarCatalogSection";
import { AvatarCatalogStats } from "../components/AvatarCatalogStats";
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
              : "Nie udało się pobrać katalogu awatarów.",
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
    const selected = avatars.filter((avatar) => avatar.isSelected).length;
    const locked = avatars.filter((avatar) => !avatar.isUnlocked).length;

    return { total, unlocked, selected, locked };
  }, [avatars]);

  const selectedAvatar = useMemo(
    () => avatars.find((avatar) => avatar.isSelected) ?? null,
    [avatars],
  );

  const unlockedAvatars = useMemo(
    () => avatars.filter((avatar) => avatar.isUnlocked),
    [avatars],
  );

  const lockedAvatars = useMemo(
    () => avatars.filter((avatar) => !avatar.isUnlocked),
    [avatars],
  );

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
      <div className="pointer-events-none fixed left-[-10%] top-[-10%] h-[40vw] w-[40vw] max-h-[28rem] max-w-[28rem] rounded-full bg-[#e08dff]/12 blur-[120px]" />
      <div className="pointer-events-none fixed bottom-[-10%] right-[-10%] h-[40vw] w-[40vw] max-h-[28rem] max-w-[28rem] rounded-full bg-[#ff68a7]/12 blur-[120px]" />

      <main className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-8">
        <header className="glass-panel rounded-[2rem] p-6 md:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="mt-2 font-headline text-4xl font-black tracking-tight text-[#f4d5ff] md:text-5xl">
                Katalog awatarów
              </h1>
              <p className="mt-3 max-w-3xl text-sm text-[#aaa8c4] md:text-base">
                Przeglądaj wszystkie awatary i ich status odblokowania.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                to="/profile/edit"
                className="rounded-full border border-white/10 px-5 py-3 text-sm font-bold text-[#e5e3ff] transition-colors hover:bg-white/5"
              >
                Edytuj profil
              </Link>
              <Link
                to="/"
                className="rounded-full bg-gradient-to-r from-[#8ff5ff] to-[#0d8f97] px-5 py-3 text-sm font-black tracking-[0.18em] text-[#003f43] transition-transform hover:scale-105 active:scale-95"
              >
                Powrót
              </Link>
            </div>
          </div>

          <div className="mt-6">
            <AvatarCatalogStats
              total={stats.total}
              unlocked={stats.unlocked}
              selected={stats.selected}
              locked={stats.locked}
            />
          </div>
        </header>

        {error ? (
          <div className="rounded-[1.5rem] bg-[#ff68a7]/10 px-5 py-4 text-sm text-[#ffd1e0]">
            {error}
          </div>
        ) : null}

        {isLoading ? (
          <div className="glass-panel rounded-[2rem] px-6 py-10 text-center text-[#aaa8c4]">
            Ładowanie katalogu awatarów...
          </div>
        ) : (
          <>
            {selectedAvatar ? (
              <AvatarCatalogActiveAvatar avatar={selectedAvatar} />
            ) : null}

            <AvatarCatalogSection
              title="Odblokowane"
              count={unlockedAvatars.length}
              avatars={unlockedAvatars}
              emptyLabel="Brak odblokowanych awatarów."
            />

            <AvatarCatalogSection
              title="Zablokowane"
              count={lockedAvatars.length}
              avatars={lockedAvatars}
              emptyLabel="Brak zablokowanych awatarów."
              locked
            />
          </>
        )}
      </main>
    </div>
  );
};
