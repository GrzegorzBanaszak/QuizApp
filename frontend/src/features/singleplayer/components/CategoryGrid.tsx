import type { SingleplayerCategory } from "../types/singleplayer";

interface CategoryGridProps {
  categories: SingleplayerCategory[];
  selectedCategoryId: number | null;
  onSelect: (categoryId: number) => void;
}

const difficultyToneMap: Record<
  string,
  { activeClassName: string; inactiveClassName: string }
> = {
  easy: {
    activeClassName:
      "text-emerald-400 drop-shadow-[0_0_12px_rgba(52,211,153,0.45)]",
    inactiveClassName: "text-emerald-400/25",
  },
  easymedium: {
    activeClassName:
      "text-lime-300 drop-shadow-[0_0_12px_rgba(190,242,100,0.45)]",
    inactiveClassName: "text-lime-300/25",
  },
  medium: {
    activeClassName:
      "text-amber-300 drop-shadow-[0_0_12px_rgba(252,211,77,0.45)]",
    inactiveClassName: "text-amber-300/25",
  },
  mediumhard: {
    activeClassName:
      "text-orange-400 drop-shadow-[0_0_12px_rgba(251,146,60,0.45)]",
    inactiveClassName: "text-orange-400/25",
  },
  hard: {
    activeClassName:
      "text-rose-400 drop-shadow-[0_0_12px_rgba(251,113,133,0.45)]",
    inactiveClassName: "text-rose-400/25",
  },
};

export const CategoryGrid = ({
  categories,
  selectedCategoryId,
  onSelect,
}: CategoryGridProps) => {
  return (
    <div className="space-y-4">
      {categories.map((category) => {
        const isSelected = category.id === selectedCategoryId;
        const progressLabel = `${category.completedLevelsCount}/${category.totalLevels} ukończonych`;

        return (
          <button
            key={category.id}
            type="button"
            onClick={() => onSelect(category.id)}
            className={`group relative w-full overflow-hidden rounded-[2rem] p-6 text-left transition-all md:p-7 ${
              isSelected
                ? "bg-[#232341] shadow-[0_0_30px_rgba(224,141,255,0.18)] ring-1 ring-[#e08dff]/30"
                : "bg-[#171730] hover:bg-[#20203e]"
            }`}
          >
            <div
              className={`absolute inset-y-0 left-0 w-1 bg-gradient-to-b ${
                isSelected
                  ? "from-[#8ff5ff] via-[#e08dff] to-[#ff68a7]"
                  : "from-white/10 via-white/5 to-transparent"
              }`}
            />

            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between md:gap-8">
              <div className="min-w-0 flex-1">
                <div className="mb-3 flex flex-wrap items-center gap-3">
                  <h3 className="font-headline text-2xl font-bold tracking-tight text-[#f4d5ff]">
                    {category.name}
                  </h3>
                  <span className="inline-flex rounded-full bg-[#8ff5ff]/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-[#8ff5ff]">
                    {progressLabel}
                  </span>
                  {isSelected ? (
                    <span className="inline-flex rounded-full bg-[#e08dff]/15 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-[#e08dff]">
                      Wybrano
                    </span>
                  ) : null}
                </div>

                <p className="max-w-2xl text-sm leading-relaxed text-[#aaa8c4] md:text-base">
                  {category.description}
                </p>
              </div>

              <div className="flex flex-shrink-0 items-center gap-2 self-start md:self-center">
                {category.levels.map((level) => {
                  const difficultyKey = level.difficulty
                    .replace(/[^a-z]/gi, "")
                    .toLowerCase();
                  const tone =
                    difficultyToneMap[difficultyKey] ?? difficultyToneMap.medium;

                  return (
                    <span
                      key={level.id}
                      className={`material-symbols-outlined text-[2rem] transition-transform group-hover:scale-105 ${
                        level.isCompleted
                          ? tone.activeClassName
                          : tone.inactiveClassName
                      }`}
                      title={`Poziom ${level.order}: ${level.difficulty}${level.isCompleted ? " - ukończony" : ""}`}
                      style={{
                        fontVariationSettings: level.isCompleted
                          ? "'FILL' 1, 'wght' 700, 'GRAD' 0, 'opsz' 24"
                          : "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24",
                      }}
                    >
                      star
                    </span>
                  );
                })}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
};
