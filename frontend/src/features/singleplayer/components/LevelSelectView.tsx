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
            : "Nie udalo sie pobrac poziomow dla kategorii.",
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
    const difficulty = resolveLevelDifficultyLabel(level.questionDistributions);
    const difficultyAccent = getDifficultyAccent(difficulty);
    const progress = category.levels.find((item) => item.id === level.id);
    const order = progress?.order ?? index + 1;
    const title = formatLevelTitle(level.name, order);
    const state = level.isCompleted
      ? "completed"
      : level.isUnlocked
        ? "available"
        : "locked";

    return {
      id: String(level.id),
      backendId: level.id,
      order,
      title,
      questionCount: level.totalQuestionCount,
      difficulty,
      state,
      grade: level.grade,
      accentTone: difficultyAccent.accentTone,
      accentGlow: difficultyAccent.accentGlow,
      iconTone: difficultyAccent.iconTone,
      lockedMessage:
        state === "locked"
          ? `Ukoncz poziom ${Math.max(1, order - 1)}, aby odblokowac`
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
          <span className="text-lg font-medium">Powrot do kategorii</span>
        </button>
        <div className="hidden md:block">
          <p className="text-sm uppercase tracking-widest text-[#8ff5ff]">
            Singleplayer Mode
          </p>
        </div>
      </header>

      <section className="mb-16 flex flex-col items-center justify-center gap-8 md:flex-row md:items-end md:justify-center">
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
        <div className="text-center md:text-center">
          <h1 className="font-headline mb-2 text-5xl font-bold tracking-tight text-white md:text-6xl">
            {session.profile.username}
          </h1>
          <p className="text-lg text-[#aaa8c4]">
            Twoj postep w kategorii:{" "}
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
            Ladowanie poziomow kategorii...
          </div>
        ) : null}

        {!isCategoryLevelsLoading &&
        renderedLevels.length === 0 &&
        !categoryLevelsError ? (
          <div className="glass-panel rounded-[2rem] px-6 py-10 text-center text-[#aaa8c4]">
            Ta kategoria nie ma jeszcze skonfigurowanych poziomow.
          </div>
        ) : null}

        {renderedLevels.map((level) => {
          if (level.state === "locked") {
            return (
              <div
                key={level.backendId}
                className="relative overflow-hidden rounded-[2rem] border border-white/8 bg-[#111128] p-5 opacity-70 sm:p-6"
              >
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/12 to-transparent" />

                <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-start gap-4 sm:gap-5">
                    <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-[1.25rem] border border-white/10 bg-black/30 sm:h-20 sm:w-20 sm:rounded-[1.5rem]">
                      <span className="material-symbols-outlined text-3xl text-[#aaa8c4] sm:text-4xl">
                        lock
                      </span>
                    </div>

                    <div className="min-w-0">
                      <div className="mb-3 flex flex-wrap items-center gap-2">
                        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-black uppercase tracking-[0.24em] text-[#aaa8c4]">
                          Zablokowany
                        </span>
                        <span className="rounded-full bg-white/5 px-3 py-1 text-[10px] font-black uppercase tracking-[0.24em] text-[#74738d]">
                          {`${level.questionCount} pytan`}
                        </span>
                      </div>

                      <h2 className="font-headline text-xl font-bold leading-tight text-[#aaa8c4] sm:text-2xl">
                        {level.title}
                      </h2>

                      <div className="mt-2 flex items-center gap-2 text-[#74738d]">
                        <span className="material-symbols-outlined text-sm">
                          lock
                        </span>
                        <span className="text-xs font-medium uppercase tracking-[0.2em] sm:text-sm">
                          {level.difficulty}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-[1.25rem] border border-white/8 bg-black/20 px-4 py-3 text-sm italic text-[#74738d] md:max-w-xs">
                    {level.lockedMessage}
                  </div>
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
                  ? "group relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-[#e08dff] via-[#d978ff] to-[#ff68a7] p-[2px] shadow-[0_0_30px_rgba(224,141,255,0.2)]"
                  : "group relative overflow-hidden rounded-[2rem] border border-white/8 bg-[#171730] shadow-xl transition-all hover:bg-[#29294a]"
              }
            >
              <div
                className={
                  isAvailable
                    ? "flex w-full flex-col gap-5 rounded-[calc(2rem-2px)] bg-[#1d1d39] p-5 transition-all group-hover:bg-[#29294a] sm:p-6 md:flex-row md:items-center md:justify-between"
                    : "flex w-full flex-col gap-5 p-5 sm:p-6 md:flex-row md:items-center md:justify-between"
                }
              >
                <div className="flex items-start gap-4 sm:gap-5">
                  <div
                    className={`flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-[1.25rem] bg-[#232341] sm:h-20 sm:w-20 sm:rounded-[1.5rem] ${level.accentGlow}`}
                  >
                    {isAvailable ? (
                      <span
                        className={`material-symbols-outlined text-3xl sm:text-4xl ${level.iconTone}`}
                      >
                        bolt
                      </span>
                    ) : (
                      <span
                        className={`font-headline text-4xl font-black sm:text-5xl ${level.accentTone}`}
                      >
                        {level.grade ?? level.order}
                      </span>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.24em] ${
                          isAvailable
                            ? "bg-[#e08dff]/18 text-[#f4d5ff]"
                            : "bg-[#8ff5ff]/12 text-[#8ff5ff]"
                        }`}
                      >
                        {isAvailable ? "Do startu" : "Ukonczony"}
                      </span>
                      <span className="rounded-full bg-white/5 px-3 py-1 text-[10px] font-black uppercase tracking-[0.24em] text-[#aaa8c4]">
                        {`${level.questionCount} pytan`}
                      </span>
                    </div>

                    <h2 className="font-headline text-xl font-bold leading-tight text-white sm:text-2xl">
                      {level.title}
                    </h2>

                    <div
                      className={`mt-2 flex flex-wrap items-center gap-2 ${
                        isAvailable ? level.iconTone : "text-[#8ff5ff]"
                      }`}
                    >
                      <span className="material-symbols-outlined text-sm">
                        {isAvailable ? "stars" : "check_circle"}
                      </span>
                      <span className="text-xs font-medium uppercase tracking-[0.2em] sm:text-sm">
                        {level.difficulty}
                      </span>
                    </div>

                    <div className="mt-4 h-px w-full max-w-xs bg-gradient-to-r from-white/15 to-transparent md:hidden" />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    void startLevel(level.backendId, level.title)
                  }
                  className={`w-full rounded-full px-6 py-3 text-center text-sm font-bold transition-all md:w-auto md:min-w-[12rem] ${
                    isAvailable
                      ? "bg-[#e08dff] text-base text-[#4f006c] shadow-lg shadow-[#e08dff]/40 hover:scale-[1.02]"
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
          Powrot do menu glownego
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

function formatLevelTitle(name: string, order: number): string {
  const normalizedName = name.trim();
  const expectedPrefix = `poziom ${order}`;

  if (normalizedName.toLowerCase().startsWith(expectedPrefix)) {
    return normalizedName;
  }

  return `Poziom ${order}: ${normalizedName}`;
}
