import { useAuthStore } from "../../auth/store/authStore";
import { CategoryGrid } from "./CategoryGrid";
import { useSingleplayerStore } from "../store/singleplayerStore";
import { Link } from "react-router";

export const SingleplayerHomeView = () => {
  const session = useAuthStore((state) => state.session);
  const categories = useSingleplayerStore((state) => state.categories);
  const isCategoriesLoading = useSingleplayerStore(
    (state) => state.isCategoriesLoading,
  );
  const categoriesError = useSingleplayerStore(
    (state) => state.categoriesError,
  );
  const selectedCategoryId = useSingleplayerStore(
    (state) => state.selectedCategoryId,
  );
  const setSelectedCategoryId = useSingleplayerStore(
    (state) => state.setSelectedCategoryId,
  );

  if (!session) {
    return null;
  }

  const totalCompletedLevels = categories.reduce(
    (sum, category) => sum + category.completedLevelsCount,
    0,
  );
  const totalLevels = categories.reduce(
    (sum, category) => sum + category.totalLevels,
    0,
  );
  const selectedCategory =
    categories.find((category) => category.id === selectedCategoryId) ??
    categories[0] ??
    null;

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-6 pb-48 pt-12">
      <section className="mb-20">
        <div className="mb-10">
          <h1 className="bg-gradient-to-r from-[#e08dff] via-[#d978ff] to-[#ff68a7] bg-clip-text font-headline text-4xl font-black tracking-[-0.04em] text-transparent md:text-5xl">
            TRYB SOLO
          </h1>
          <p className="mt-2 text-lg text-[#aaa8c4]">
            Witaj ponownie, {session.profile.username}. Wybierz wyzwanie na
            dziś.
          </p>
        </div>

        <div className="glass-panel flex flex-col rounded-[2rem] p-8 shadow-[0_0_30px_rgba(224,141,255,0.18)] md:flex-row md:items-center md:gap-8">
          <div className="relative mb-6 flex-shrink-0 self-center md:mb-0">
            <div className="h-24 w-24 overflow-hidden rounded-full ring-4 ring-[#e08dff] shadow-[0_0_20px_#8A2BE2] md:h-28 md:w-28">
              <img
                src={session.profile.avatarUrl}
                alt={session.profile.username}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-1 -right-1 rounded-full bg-[#ff68a7] px-2 py-0.5 text-[10px] font-black tracking-tight text-[#460024] shadow-lg">
              USER
            </div>
          </div>

          <div className="flex min-w-0 flex-1 flex-col items-center md:items-start">
            <h2 className="mb-1 font-headline text-4xl font-black tracking-[-0.04em] text-[#e5e3ff]">
              {session.profile.username}
            </h2>
            <div className="flex flex-wrap items-center justify-center gap-3 md:justify-start">
              <span className="inline-flex items-center rounded-full bg-[#e08dff]/20 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#e08dff] ring-1 ring-[#e08dff]/40">
                {session.profile.totalExperience} XP
              </span>
              <div className="flex items-center gap-1 text-[#8ff5ff]">
                <span className="material-symbols-outlined text-sm">toll</span>
                <span className="text-[10px] font-black uppercase tracking-widest">
                  {session.profile.coins} monet
                </span>
              </div>
              <div className="flex items-center gap-1 text-[#ffcf7d]">
                <span className="material-symbols-outlined text-sm">stars</span>
                <span className="text-[10px] font-black uppercase tracking-widest">
                  {totalCompletedLevels}/{totalLevels} poziomów
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-8 flex items-center justify-between">
          <h2 className="font-headline text-3xl font-bold tracking-tight">
            Kategorie quizu
          </h2>
          <div className="hidden items-center gap-2 text-[#8ff5ff] md:flex">
            <span className="material-symbols-outlined text-base">stars</span>
            <span className="text-sm font-bold uppercase tracking-widest">
              {selectedCategory
                ? `${selectedCategory.completedLevelsCount}/${selectedCategory.totalLevels} w wybranej kategorii`
                : "Brak kategorii"}
            </span>
          </div>
        </div>

        {categoriesError ? (
          <div className="mb-6 rounded-[1.5rem] border border-[#ff68a7]/30 bg-[#ff68a7]/10 px-5 py-4 text-sm text-[#ffd1e0]">
            {categoriesError}
          </div>
        ) : null}

        {isCategoriesLoading ? (
          <div className="glass-panel rounded-[2rem] px-6 py-10 text-center text-[#aaa8c4]">
            Ładowanie kategorii singleplayer...
          </div>
        ) : categories.length > 0 ? (
          <CategoryGrid
            categories={categories}
            selectedCategoryId={selectedCategoryId}
            onSelect={setSelectedCategoryId}
          />
        ) : (
          <div className="glass-panel rounded-[2rem] px-6 py-10 text-center text-[#aaa8c4]">
            Brak dostępnych kategorii.
          </div>
        )}
      </section>

      <div className="mt-16 flex justify-center">
        <Link
          to="/"
          className="group relative overflow-hidden rounded-full border border-white/10 bg-[#111128] px-12 py-5 shadow-[0_0_40px_rgba(17,17,40,0.4)] transition-all hover:scale-105 active:scale-95"
        >
          <span className="relative z-10 flex items-center gap-3 font-headline text-xl font-black tracking-tight text-[#e5e3ff]">
            POWRÓT
            <span className="material-symbols-outlined transition-transform group-hover:-translate-x-2">
              arrow_back
            </span>
          </span>
        </Link>
      </div>
    </main>
  );
};
