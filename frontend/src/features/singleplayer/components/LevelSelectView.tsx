import { useEffect } from "react";
import { useAuthStore } from "../../auth/store/authStore";
import { fetchSingleplayerCategoryLevels } from "../services/singleplayerApi";
import { useSingleplayerStore } from "../store/singleplayerStore";
import type { SingleplayerLevelDistribution } from "../types/singleplayer";

export const LevelSelectView = () => {
  const session = useAuthStore((state) => state.session);
  const categories = useSingleplayerStore((state) => state.categories);
  const categoryLevels = useSingleplayerStore((state) => state.categoryLevels);
  const isCategoryLevelsLoading = useSingleplayerStore(
    (state) => state.isCategoryLevelsLoading,
  );
  const categoryLevelsError = useSingleplayerStore(
    (state) => state.categoryLevelsError,
  );
  const selectedCategoryId = useSingleplayerStore(
    (state) => state.selectedCategoryId,
  );
  const hydrateCategoryLevels = useSingleplayerStore(
    (state) => state.hydrateCategoryLevels,
  );
  const setCategoryLevelsLoading = useSingleplayerStore(
    (state) => state.setCategoryLevelsLoading,
  );
  const setCategoryLevelsError = useSingleplayerStore(
    (state) => state.setCategoryLevelsError,
  );
  const goToHome = useSingleplayerStore((state) => state.goToHome);
  const startLevel = useSingleplayerStore((state) => state.startLevel);

  const category =
    categories.find((item) => item.id === selectedCategoryId) ?? categories[0];

  useEffect(() => {
    if (!selectedCategoryId) {
      hydrateCategoryLevels([]);
      return;
    }

    let isCancelled = false;

    setCategoryLevelsLoading(true);
    setCategoryLevelsError(null);

    void fetchSingleplayerCategoryLevels(selectedCategoryId)
      .then((levels) => {
        if (isCancelled) {
          return;
        }

        hydrateCategoryLevels(levels);
      })
      .catch((error) => {
        if (isCancelled) {
          return;
        }

        hydrateCategoryLevels([]);
        setCategoryLevelsError(
          error instanceof Error
            ? error.message
            : "Nie udało się pobrać poziomów dla kategorii.",
        );
      })
      .finally(() => {
        if (isCancelled) {
          return;
        }

        setCategoryLevelsLoading(false);
      });

    return () => {
      isCancelled = true;
    };
  }, [
    hydrateCategoryLevels,
    selectedCategoryId,
    setCategoryLevelsError,
    setCategoryLevelsLoading,
  ]);

  if (!session || !category) {
    return null;
  }

  const renderedLevels = categoryLevels.map((level, index) => {
    const progress = category.levels.find((item) => item.id === level.id);
    const difficulty = resolveLevelDifficultyLabel(level.questionDistributions);
    const difficultyAccent = getDifficultyAccent(difficulty);
    const order = progress?.order ?? index + 1;
    const state = progress?.isCompleted
      ? "completed"
      : level.isUnlocked
        ? "available"
        : "locked";

    return {
      id: String(level.id),
      backendId: level.id,
      order,
      title: level.name,
      questionCount: level.totalQuestionCount,
      difficulty,
      state,
      accentTone: difficultyAccent.accentTone,
      accentGlow: difficultyAccent.accentGlow,
      iconTone: difficultyAccent.iconTone,
      lockedMessage:
        state === "locked"
          ? `Ukończ poziom ${Math.max(1, order - 1)}, aby odblokować`
          : undefined,
    };
  });

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden p-6 md:p-12 lg:p-20">
      <header className="mb-12 flex items-center justify-between">
        <button
          type="button"
          onClick={goToHome}
          className="group flex items-center gap-3 text-[#aaa8c4] transition-colors hover:text-[#e08dff]"
        >
          <span className="material-symbols-outlined text-[28px]">
            arrow_back
          </span>
          <span className="text-lg font-medium">Powrót do kategorii</span>
        </button>
        <div className="hidden md:block">
          <p className="text-sm uppercase tracking-widest text-[#8ff5ff]">
            Singleplayer Mode
          </p>
        </div>
      </header>

      <section className="mb-16 flex flex-col items-center gap-8 md:flex-row md:items-end">
        <div className="relative">
          <div className="h-32 w-32 rounded-full border-4 border-[#e08dff] p-1 shadow-[0_0_25px_rgba(224,141,255,0.3)]">
            <img
              src={session.profile.avatarUrl}
              alt={session.profile.username}
              className="h-full w-full rounded-full object-cover"
            />
          </div>
          <div className="absolute -bottom-2 -right-2 rounded-full bg-[#ff68a7] px-3 py-1 text-xs font-bold uppercase tracking-tight text-[#460024]">
            {session.profile.totalExperience} XP
          </div>
        </div>
        <div className="text-center md:text-left">
          <h1 className="font-headline mb-2 text-5xl font-bold tracking-tight text-white md:text-6xl">
            {session.profile.username}
          </h1>
          <p className="text-lg text-[#aaa8c4]">
            Twój postęp w kategorii:{" "}
            <span className="font-bold text-[#8ff5ff]">{category.name}</span>
          </p>
        </div>
      </section>

      <main className="mx-auto w-full max-w-4xl space-y-6">
        {categoryLevelsError ? (
          <div className="rounded-[1.5rem] border border-[#ff68a7]/30 bg-[#ff68a7]/10 px-5 py-4 text-sm text-[#ffd1e0]">
            {categoryLevelsError}
          </div>
        ) : null}

        {isCategoryLevelsLoading ? (
          <div className="glass-panel rounded-[2rem] px-6 py-10 text-center text-[#aaa8c4]">
            Ładowanie poziomów kategorii...
          </div>
        ) : null}

        {!isCategoryLevelsLoading &&
        renderedLevels.length === 0 &&
        !categoryLevelsError ? (
          <div className="glass-panel rounded-[2rem] px-6 py-10 text-center text-[#aaa8c4]">
            Ta kategoria nie ma jeszcze skonfigurowanych poziomów.
          </div>
        ) : null}

        {renderedLevels.map((level) => {
          if (level.state === "locked") {
            return (
              <div
                key={level.backendId}
                className="relative flex items-center justify-between rounded-[2rem] bg-[#111128] p-6 opacity-60"
              >
                <div className="flex items-center gap-6">
                  <div className="flex h-20 w-20 items-center justify-center rounded-[1.5rem] border border-white/10 bg-black/30">
                    <span className="material-symbols-outlined text-4xl text-[#aaa8c4]">
                      lock
                    </span>
                  </div>
                  <div>
                    <h2 className="font-headline text-2xl font-bold text-[#aaa8c4]">
                      {`Poziom ${level.order}: ${level.title}`}
                    </h2>
                    <div className="mt-1 flex items-center gap-2 text-[#74738d]">
                      <span className="material-symbols-outlined text-sm">
                        lock
                      </span>
                      <span className="text-sm font-medium uppercase tracking-wide">
                        {`${level.difficulty} • ${level.questionCount} pytań`}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="pr-4 text-sm italic text-[#74738d]">
                  {level.lockedMessage}
                </div>
              </div>
            );
          }

          const isAvailable = level.state === "available";

          return (
            <div
              key={level.backendId}
              className={
                isAvailable
                  ? "group relative flex items-center justify-between rounded-[2rem] bg-gradient-to-r from-[#e08dff] to-[#ff68a7] p-[2px] shadow-[0_0_30px_rgba(224,141,255,0.2)]"
                  : "group relative flex items-center justify-between rounded-[2rem] bg-[#171730] p-6 shadow-xl transition-all hover:bg-[#29294a]"
              }
            >
              <div
                className={
                  isAvailable
                    ? "flex w-full items-center justify-between rounded-[2rem] bg-[#1d1d39] p-6 transition-all group-hover:bg-[#29294a]"
                    : "flex w-full items-center justify-between"
                }
              >
                <div className="flex items-center gap-6">
                  <div
                    className={`flex h-20 w-20 items-center justify-center rounded-[1.5rem] bg-[#232341] ${level.accentGlow}`}
                  >
                    {isAvailable ? (
                      <span
                        className={`material-symbols-outlined text-4xl ${level.iconTone}`}
                      >
                        bolt
                      </span>
                    ) : (
                      <span
                        className={`font-headline text-5xl font-black ${level.accentTone}`}
                      >
                        {level.order}
                      </span>
                    )}
                  </div>
                  <div>
                    <h2 className="font-headline text-2xl font-bold text-white">
                      {`Poziom ${level.order}: ${level.title}`}
                    </h2>
                    <div
                      className={`mt-1 flex items-center gap-2 ${
                        isAvailable ? level.iconTone : "text-[#8ff5ff]"
                      }`}
                    >
                      <span className="material-symbols-outlined text-sm">
                        {isAvailable ? "stars" : "check_circle"}
                      </span>
                      <span className="text-sm font-medium uppercase tracking-wide">
                        {`${level.difficulty} • ${level.questionCount} pytań`}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    void startLevel(level.backendId, `Poziom ${level.order}: ${level.title}`)
                  }
                  className={`rounded-full px-6 py-2 text-sm font-bold transition-all ${
                    isAvailable
                      ? "bg-[#e08dff] px-8 py-3 text-lg text-[#4f006c] shadow-lg shadow-[#e08dff]/40 hover:scale-105"
                      : "bg-[#232341] text-[#e5e3ff] hover:bg-[#e08dff] hover:text-[#4f006c]"
                  }`}
                >
                  {isAvailable ? "ROZPOCZNIJ" : "Graj ponownie"}
                </button>
              </div>
            </div>
          );
        })}
      </main>

      <footer className="mt-16 flex justify-center pb-20">
        <button
          type="button"
          onClick={goToHome}
          className="group flex items-center gap-4 rounded-full border border-white/10 px-10 py-4 font-bold text-[#aaa8c4] transition-all hover:border-[#ff68a7] hover:text-[#ff68a7]"
        >
          <span className="material-symbols-outlined">home</span>
          Powrót do menu głównego
        </button>
      </footer>
    </div>
  );
};

function resolveLevelDifficultyLabel(
  distributions: SingleplayerLevelDistribution[],
): string {
  const dominantDistribution = [...distributions].sort((left, right) => {
    if (right.count !== left.count) {
      return right.count - left.count;
    }

    return (
      normalizeDifficultyWeight(right.difficulty) -
      normalizeDifficultyWeight(left.difficulty)
    );
  })[0];

  return dominantDistribution?.difficulty ?? "Easy";
}

function normalizeDifficultyWeight(difficulty: string): number {
  switch (difficulty.toLowerCase()) {
    case "easy":
      return 1;
    case "easymedium":
      return 2;
    case "medium":
      return 3;
    case "mediumhard":
      return 4;
    case "hard":
      return 5;
    default:
      return 0;
  }
}

function getDifficultyAccent(difficulty: string): {
  accentTone: string;
  accentGlow: string;
  iconTone: string;
} {
  switch (difficulty.toLowerCase()) {
    case "easy":
      return {
        accentTone: "text-emerald-400",
        accentGlow: "shadow-[0_0_12px_rgba(52,211,153,0.35)]",
        iconTone: "text-emerald-400",
      };
    case "easymedium":
      return {
        accentTone: "text-lime-300",
        accentGlow: "shadow-[0_0_12px_rgba(190,242,100,0.35)]",
        iconTone: "text-lime-300",
      };
    case "medium":
      return {
        accentTone: "text-amber-300",
        accentGlow: "shadow-[0_0_12px_rgba(252,211,77,0.35)]",
        iconTone: "text-amber-300",
      };
    case "mediumhard":
      return {
        accentTone: "text-orange-400",
        accentGlow: "shadow-[0_0_12px_rgba(251,146,60,0.35)]",
        iconTone: "text-orange-400",
      };
    case "hard":
      return {
        accentTone: "text-rose-400",
        accentGlow: "shadow-[0_0_12px_rgba(251,113,133,0.35)]",
        iconTone: "text-rose-400",
      };
    default:
      return {
        accentTone: "text-[#e08dff]",
        accentGlow: "shadow-[0_0_12px_rgba(224,141,255,0.35)]",
        iconTone: "text-[#e08dff]",
      };
  }
}
