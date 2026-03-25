import { singleplayerMockData, useSingleplayerStore } from "../store/singleplayerStore";

export const ResultView = () => {
  const selectedLevelId = useSingleplayerStore((state) => state.selectedLevelId);
  const replay = useSingleplayerStore((state) => state.replay);
  const goToLevelSelect = useSingleplayerStore(
    (state) => state.goToLevelSelect,
  );
  const topThree = singleplayerMockData.leaderboard.slice(0, 3);
  const currentPlayer = singleplayerMockData.leaderboard.find(
    (entry) => entry.isCurrentPlayer,
  );
  const rest = singleplayerMockData.leaderboard.filter(
    (entry) =>
      !entry.isCurrentPlayer && !topThree.some((top) => top.id === entry.id),
  );
  const rank = selectedLevelId === "hard" ? "S" : "A";

  return (
    <div className="min-h-screen bg-[#0c0c21] pb-24 text-[#e5e3ff] md:pb-12">
      <main className="mx-auto mb-12 grid max-w-7xl grid-cols-1 gap-8 px-6 pt-12 lg:grid-cols-12">
        <section className="space-y-8 lg:col-span-7">
          <div className="relative w-full">
            <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-[#e08dff]/20 blur-[100px]" />
            <div className="relative z-10 flex flex-col items-center gap-6 md:flex-row md:items-end md:gap-12">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-[#e08dff] to-[#ff68a7] opacity-30 blur-3xl transition-opacity group-hover:opacity-50" />
                <h1 className="font-headline bg-gradient-to-b from-[#e5e3ff] to-[#e08dff] bg-clip-text text-[8rem] font-black italic leading-none text-transparent md:text-[12rem]">
                  {rank}
                </h1>
              </div>
              <div className="mb-4 flex flex-col">
                <span className="font-headline mb-2 text-sm font-bold uppercase tracking-[0.3em] text-[#8ff5ff]">
                  Poziom ukończony
                </span>
                <h2 className="font-headline text-4xl font-black tracking-tight text-[#e5e3ff] md:text-6xl">
                  LEGENDA PULSU
                </h2>
                <p className="mt-2 max-w-sm text-[#aaa8c4]">
                  Perfekcyjna synchronizacja. Twoje reakcje przekroczyły granice systemu.
                </p>
              </div>
            </div>
          </div>

          <div className="grid w-full grid-cols-2 gap-4">
            <div className="rounded-[2rem] border-l-4 border-[#e08dff] bg-[#171730] p-6">
              <span className="text-xs font-bold uppercase tracking-widest text-[#aaa8c4]">
                Wynik końcowy
              </span>
              <div className="font-headline mt-1 text-3xl font-black">
                1,450 <span className="text-sm text-[#e08dff]">pts</span>
              </div>
            </div>
            <div className="rounded-[2rem] border-l-4 border-[#74738d] bg-[#171730] p-6">
              <span className="text-xs font-bold uppercase tracking-widest text-[#aaa8c4]">
                Czas
              </span>
              <div className="font-headline mt-1 text-3xl font-black">
                02:45
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[2rem] bg-[#1d1d39] p-8">
            <div className="absolute right-0 top-0 h-32 w-32 bg-[#ff68a7]/10 blur-3xl" />
            <h3 className="font-headline mb-6 flex items-center gap-2 text-xl font-bold">
              <span className="material-symbols-outlined text-[#e08dff]">
                redeem
              </span>
              Odblokowane nagrody
            </h3>
            <div className="flex flex-wrap gap-6">
              {singleplayerMockData.rewards.map((reward) => (
                <div
                  key={reward.id}
                  className="flex cursor-default items-center gap-4 rounded-full border border-white/10 bg-[#29294a]/50 p-3 pr-6 transition-colors hover:border-[#e08dff]/40"
                >
                  <div
                    className={`flex h-12 w-12 items-center justify-center overflow-hidden rounded-full ${
                      reward.image
                        ? "border-2 border-[#ff68a7]"
                        : "bg-gradient-to-br from-[#e08dff] to-[#ff68a7]"
                    }`}
                  >
                    {reward.image ? (
                      <img
                        src={reward.image}
                        alt={reward.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="material-symbols-outlined text-[#4f006c]">
                        {reward.icon}
                      </span>
                    )}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-[#e5e3ff]">
                      {reward.title}
                    </div>
                    <div className="text-[10px] uppercase tracking-wider text-[#aaa8c4]">
                      {reward.subtitle}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex w-full flex-col gap-4 pt-4 sm:flex-row">
            <button
              type="button"
              onClick={replay}
              className="flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#e08dff] to-[#d978ff] px-8 py-4 font-bold text-[#4f006c] shadow-[0_10px_30px_rgba(224,141,255,0.3)] transition-all hover:scale-105 active:scale-95"
            >
              <span className="material-symbols-outlined">play_arrow</span>
              Graj ponownie
            </button>
            <button
              type="button"
              onClick={goToLevelSelect}
              className="flex items-center justify-center gap-2 rounded-full border border-[#e08dff]/20 bg-[#29294a] px-8 py-4 font-bold text-[#e5e3ff] transition-all hover:bg-[#232341] active:scale-95"
            >
              <span className="material-symbols-outlined">map</span>
              Powrót do wyboru poziomu
            </button>
          </div>
        </section>

        <aside className="space-y-6 lg:col-span-5">
          <div className="rounded-[2rem] border-t-2 border-[#8ff5ff] bg-[#171730] p-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="font-headline text-xl font-black uppercase tracking-tight">
                  Leaderboard
                </h3>
                <p className="text-xs font-bold uppercase tracking-widest text-[#8ff5ff]">
                  Trudność: Legendary
                </p>
              </div>
              <span className="material-symbols-outlined text-[#8ff5ff]/50">
                leaderboard
              </span>
            </div>

            <div className="space-y-2">
              {topThree.map((entry, index) => (
                <div
                  key={entry.id}
                  className={`flex items-center gap-4 rounded-[1.5rem] p-4 ${
                    index === 0
                      ? "border-l-4 border-[#8ff5ff] bg-[#29294a] shadow-lg shadow-black/20"
                      : "bg-[#1d1d39] transition-colors hover:bg-[#29294a]"
                  }`}
                >
                  <span
                    className={`font-headline w-6 text-xl font-black italic ${
                      index === 0 ? "text-[#8ff5ff]" : "text-[#aaa8c4]"
                    }`}
                  >
                    {index + 1}
                  </span>
                  <div
                    className={`h-10 w-10 overflow-hidden rounded-full ${
                      index === 0
                        ? "border-2 border-[#8ff5ff]"
                        : "border border-white/10"
                    }`}
                  >
                    <img
                      src={entry.avatar}
                      alt={entry.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-[#e5e3ff]">{entry.name}</div>
                    {entry.title ? (
                      <div className="text-[10px] font-bold uppercase text-[#aaa8c4]">
                        {entry.title}
                      </div>
                    ) : null}
                  </div>
                  <div className="font-headline text-xl font-black">
                    {entry.score}
                  </div>
                </div>
              ))}

              {currentPlayer ? (
                <div className="relative overflow-hidden rounded-[1.5rem] border border-[#e08dff]/30 bg-[#e08dff]/10 p-4">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#e08dff]/5 to-transparent" />
                  <div className="relative z-10 flex items-center gap-4">
                    <span className="font-headline w-6 text-xl font-black italic text-[#e08dff]">
                      8
                    </span>
                    <div className="h-10 w-10 overflow-hidden rounded-full border-2 border-[#e08dff]">
                      <img
                        src={currentPlayer.avatar}
                        alt={currentPlayer.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1 font-bold text-[#e08dff]">
                      {currentPlayer.name}
                    </div>
                    <div className="font-headline text-xl font-black">
                      {currentPlayer.score}
                    </div>
                  </div>
                </div>
              ) : null}

              <div className="space-y-1 pt-4 opacity-60">
                {rest.map((entry, index) => (
                  <div
                    key={entry.id}
                    className="flex items-center justify-between border-b border-white/5 px-4 py-2 text-sm"
                  >
                    <span className="flex items-center gap-4">
                      <span className="font-headline w-6 italic">
                        {index + 9}
                      </span>
                      {entry.name}
                    </span>
                    <span className="font-bold">{entry.score}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="button"
              className="mt-6 w-full py-3 text-sm font-bold uppercase tracking-widest text-[#8ff5ff] transition-all hover:underline"
            >
              Zobacz pełny ranking
            </button>
          </div>
        </aside>
      </main>
    </div>
  );
};
