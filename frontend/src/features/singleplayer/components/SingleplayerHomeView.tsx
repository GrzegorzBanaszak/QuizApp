import { CategoryGrid } from "./CategoryGrid";
import { singleplayerMockData, useSingleplayerStore } from "../store/singleplayerStore";

export const SingleplayerHomeView = () => {
  const profile = useSingleplayerStore((state) => state.profile);
  const selectedCategoryId = useSingleplayerStore(
    (state) => state.selectedCategoryId,
  );
  const selectedAvatarId = profile?.avatarId ?? singleplayerMockData.avatars[0]?.id;
  const selectedAvatar =
    singleplayerMockData.avatars.find((avatar) => avatar.id === selectedAvatarId) ??
    singleplayerMockData.avatars[0];
  const goToLevelSelect = useSingleplayerStore((state) => state.goToLevelSelect);
  const setSelectedCategoryId = useSingleplayerStore(
    (state) => state.setSelectedCategoryId,
  );

  const playerName = profile?.name ?? "NeonNinja";
  const playerLevel = profile?.level ?? 42;
  const playerXp = profile?.xp ?? "2.4k XP";

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-6 pb-40 pt-12">
      <section className="mb-20">
        <div className="mb-10">
          <h1 className="bg-gradient-to-r from-[#e08dff] via-[#d978ff] to-[#ff68a7] bg-clip-text font-headline text-4xl font-black tracking-[-0.04em] text-transparent md:text-5xl">
            SINGLEPLAYER LOBBY
          </h1>
          <p className="mt-2 text-lg text-[#aaa8c4]">
            Witaj ponownie, {playerName}. Wybierz wyzwanie na dziś.
          </p>
        </div>

        <div className="glass-panel flex flex-col rounded-[2rem] p-8 shadow-[0_0_30px_rgba(224,141,255,0.18)] md:flex-row md:items-center md:gap-8">
          <div className="relative mb-6 flex-shrink-0 self-center md:mb-0">
            <div className="h-24 w-24 overflow-hidden rounded-full ring-4 ring-[#e08dff] shadow-[0_0_20px_#8A2BE2] md:h-28 md:w-28">
              <img
                src={selectedAvatar.image}
                alt={selectedAvatar.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-1 -right-1 rounded-full bg-[#ff68a7] px-2 py-0.5 text-[10px] font-black tracking-tight text-[#460024] shadow-lg">
              PRO
            </div>
          </div>

          <div className="flex min-w-0 flex-1 flex-col items-center md:items-start">
            <h2 className="mb-1 font-headline text-4xl font-black tracking-[-0.04em] text-[#e5e3ff]">
              {playerName}
            </h2>
            <div className="flex flex-wrap items-center justify-center gap-3 md:justify-start">
              <span className="inline-flex items-center rounded-full bg-[#e08dff]/20 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#e08dff] ring-1 ring-[#e08dff]/40">
                Level {playerLevel}
              </span>
              <div className="flex items-center gap-1 text-[#8ff5ff]">
                <span className="material-symbols-outlined text-sm">bolt</span>
                <span className="text-[10px] font-black uppercase tracking-widest">
                  {playerXp}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-8 flex items-center justify-between">
          <h2 className="font-headline text-3xl font-bold tracking-tight">
            Kategorie Quizu
          </h2>
          <div className="hidden items-center gap-2 text-[#8ff5ff] md:flex">
            <span className="material-symbols-outlined text-base">group</span>
            <span className="text-sm font-bold uppercase tracking-widest">
              124 graczy online
            </span>
          </div>
        </div>

        <CategoryGrid
          categories={singleplayerMockData.categories}
          selectedCategoryId={selectedCategoryId}
          onSelect={setSelectedCategoryId}
        />
      </section>

      <div className="mt-16 flex justify-center">
        <button
          type="button"
          onClick={goToLevelSelect}
          className="group relative overflow-hidden rounded-full bg-gradient-to-r from-[#e08dff] to-[#d978ff] px-12 py-5 shadow-[0_0_40px_rgba(224,141,255,0.4)] transition-all hover:scale-105 active:scale-95"
        >
          <span className="relative z-10 flex items-center gap-3 font-headline text-xl font-black tracking-tight text-[#4f006c]">
            ROZPOCZNIJ GRĘ
            <span className="material-symbols-outlined transition-transform group-hover:translate-x-2">
              bolt
            </span>
          </span>
          <div className="absolute inset-0 translate-y-full bg-white/20 transition-transform group-hover:translate-y-0" />
        </button>
      </div>
    </main>
  );
};
