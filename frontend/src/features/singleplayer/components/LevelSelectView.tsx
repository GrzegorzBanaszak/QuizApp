import { singleplayerMockData, useSingleplayerStore } from "../store/singleplayerStore";

export const LevelSelectView = () => {
  const profile = useSingleplayerStore((state) => state.profile);
  const selectedCategoryId = useSingleplayerStore(
    (state) => state.selectedCategoryId,
  );
  const goToHome = useSingleplayerStore((state) => state.goToHome);
  const startLevel = useSingleplayerStore((state) => state.startLevel);

  if (!profile) return null;

  const avatar =
    singleplayerMockData.avatars.find((item) => item.id === profile.avatarId) ??
    singleplayerMockData.avatars[0];
  const category =
    singleplayerMockData.categories.find(
      (item) => item.id === selectedCategoryId,
    ) ?? singleplayerMockData.categories[0];

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
              src={avatar.image}
              alt={avatar.name}
              className="h-full w-full rounded-full object-cover"
            />
          </div>
          <div className="absolute -bottom-2 -right-2 rounded-full bg-[#ff68a7] px-3 py-1 text-xs font-bold uppercase tracking-tight text-[#460024]">
            Level {profile.level}
          </div>
        </div>
        <div className="text-center md:text-left">
          <h1 className="font-headline mb-2 text-5xl font-bold tracking-tight text-white md:text-6xl">
            {profile.name}
          </h1>
          <p className="text-lg text-[#aaa8c4]">
            Twój postęp w kategorii:{" "}
            <span className="font-bold text-[#8ff5ff]">{category.title}</span>
          </p>
        </div>
      </section>

      <main className="mx-auto w-full max-w-4xl space-y-6">
        {singleplayerMockData.levels.map((level) => {
          if (level.state === "locked") {
            return (
              <div
                key={level.id}
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
                      {level.title}
                    </h2>
                    <div className="mt-1 flex items-center gap-2 text-[#74738d]">
                      <span className="text-sm font-medium uppercase tracking-wide">
                        Status: Zablokowany
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
          const accentTone =
            level.accent === "secondary" ? "text-[#ff68a7]" : "text-[#e08dff]";
          const accentGlow =
            level.accent === "secondary"
              ? "shadow-[0_0_12px_rgba(255,104,167,0.35)]"
              : "shadow-[0_0_12px_rgba(224,141,255,0.35)]";

          return (
            <div
              key={level.id}
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
                    className={`flex h-20 w-20 items-center justify-center rounded-[1.5rem] bg-[#232341] ${accentGlow}`}
                  >
                    {isAvailable ? (
                      <span className="material-symbols-outlined text-4xl text-[#e08dff]">
                        bolt
                      </span>
                    ) : (
                      <span
                        className={`font-headline text-5xl font-black ${accentTone}`}
                      >
                        {level.letter}
                      </span>
                    )}
                  </div>
                  <div>
                    <h2 className="font-headline text-2xl font-bold text-white">
                      {level.title}
                    </h2>
                    <div
                      className={`mt-1 flex items-center gap-2 ${
                        isAvailable ? "text-[#e08dff]" : "text-[#8ff5ff]"
                      }`}
                    >
                      <span className="material-symbols-outlined text-sm">
                        {isAvailable ? "stars" : "check_circle"}
                      </span>
                      <span className="text-sm font-medium uppercase tracking-wide">
                        {level.subtitle}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => startLevel(level.id)}
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
