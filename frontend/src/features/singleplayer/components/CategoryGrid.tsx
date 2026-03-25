import type { SingleplayerCategory } from "../types/singleplayer";

interface CategoryGridProps {
  categories: SingleplayerCategory[];
  selectedCategoryId: string;
  onSelect: (categoryId: string) => void;
}

export const CategoryGrid = ({
  categories,
  selectedCategoryId,
  onSelect,
}: CategoryGridProps) => {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
      {categories.map((category) => {
        const isSelected = category.id === selectedCategoryId;

        return (
          <button
            key={category.id}
            type="button"
            onClick={() => onSelect(category.id)}
            className={`group relative overflow-hidden rounded-[2rem] p-6 text-left transition-all hover:-translate-y-2 ${
              isSelected
                ? "bg-[#232341] shadow-[0_0_30px_rgba(224,141,255,0.18)] ring-1 ring-[#e08dff]/30"
                : "bg-[#171730] hover:bg-[#29294a]"
            }`}
          >
            <div
              className={`absolute left-0 top-0 h-full w-1 ${category.accent}`}
            />
            <div className="flex h-full flex-col">
              <div
                className={`mb-6 flex h-12 w-12 items-center justify-center rounded-[1.25rem] ${category.iconSurface} ${category.iconTone} transition-transform group-hover:scale-110`}
              >
                <span className="material-symbols-outlined text-3xl">
                  {category.icon}
                </span>
              </div>
              <h3 className="font-headline mb-2 text-xl font-bold">
                {category.title}
              </h3>
              <p className="mb-6 text-sm leading-relaxed text-[#aaa8c4]">
                {category.description}
              </p>
              <div className="mt-auto flex items-center justify-between lg:flex-col-reverse lg:items-start">
                <span
                  className={`inline-flex rounded-[1.5rem] px-3 py-1 text-[10px] font-black uppercase tracking-widest ring-1 ${category.difficultyTone}`}
                >
                  {category.difficulty}
                </span>
                {isSelected ? (
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#8ff5ff] lg:mb-2 lg:ml-1">
                    Wybrano
                  </span>
                ) : null}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
};
