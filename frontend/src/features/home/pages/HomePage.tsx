import { Link } from "react-router";
import { AuthLoginSection } from "../../auth/components/AuthLoginSection";
import { useAuthStore } from "../../auth/store/authStore";

const modeCards = [
  {
    title: "Graj Solo",
    description:
      "Sprawdz swoja wiedze w starciu z AI. Dynamicznie generowane pytania dopasowane do Twoich zainteresowan i droga do globalnego Top 100.",
    to: "/singleplayer",
    icon: "bolt",
    iconClassName: "text-[#e08dff]",
    iconWrapperClassName:
      "bg-[#e08dff]/20 shadow-[0_0_30px_rgba(224,141,255,0.2)]",
    buttonClassName:
      "bg-gradient-to-r from-[#e08dff] to-[#d978ff] text-[#4f006c]",
    highlightClassName: "text-[#8ff5ff]",
    highlightLabel: "Top 100",
    badge: null,
  },
  {
    title: "Graj ze Znajomymi",
    description:
      "Rywalizacja w czasie rzeczywistym. Wybieraj miedzy klasycznym quizem a intensywnymi turniejami eliminacyjnymi i sprawdz, kto naprawde prowadzi lobby.",
    to: "/multiplayer",
    icon: "group",
    iconClassName: "text-[#ff68a7]",
    iconWrapperClassName:
      "bg-[#ff68a7]/20 shadow-[0_0_40px_rgba(255,104,167,0.25)]",
    buttonClassName:
      "border-2 border-[#ff68a7]/40 bg-[#29294a] text-[#ff68a7] hover:bg-[#ff68a7]/10",
    highlightClassName: "text-[#ff68a7]",
    highlightLabel: "Klasycznym Quizem",
    badge: "LIVE",
  },
  {
    title: "Tryb Imprezy",
    description:
      "Zmien salon w studio telewizyjne. Telefon staje sie kontrolerem, a wspolny ekran glowna scena z mechanikami sabotażu i widowiskowa rywalizacja.",
    to: "/party",
    icon: "tv",
    iconClassName: "text-[#8ff5ff]",
    iconWrapperClassName:
      "bg-[#8ff5ff]/20 shadow-[0_0_30px_rgba(143,245,255,0.2)]",
    buttonClassName:
      "bg-gradient-to-r from-[#8ff5ff] to-[#0d8f97] text-[#003f43]",
    highlightClassName: "text-[#8ff5ff]",
    highlightLabel: "sabotażu",
    badge: null,
  },
];

export const HomePage = () => {
  const session = useAuthStore((state) => state.session);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#0c0c21] pb-28 text-[#e5e3ff] md:pb-12">
      <div className="pointer-events-none fixed left-[-10%] top-[-10%] h-[50vh] w-[50vw] rounded-full bg-[#e08dff]/10 blur-[120px]" />
      <div className="pointer-events-none fixed bottom-[-10%] right-[-10%] h-[40vh] w-[40vw] rounded-full bg-[#ff68a7]/10 blur-[100px]" />
      <div className="pointer-events-none fixed right-[-3rem] top-1/4 h-32 w-32 rounded-full border border-white/5 opacity-20 md:h-48 md:w-48" />
      <div className="pointer-events-none fixed bottom-1/4 left-[-3rem] h-44 w-44 rounded-full border border-white/5 opacity-20 md:h-64 md:w-64" />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col items-center px-6 py-10 md:py-12">
        <header className="mb-8 w-full text-center md:mb-10">
          <div className="mb-4 inline-block">
            <span className="bg-gradient-to-r from-[#e08dff] to-[#ff68a7] bg-clip-text font-headline text-3xl font-black italic tracking-tight text-transparent">
              QuizVolt
            </span>
          </div>
          <h1 className="neon-text-glow font-headline text-4xl font-black uppercase tracking-[-0.04em] text-[#f4d5ff] md:text-6xl">
            Witaj w Swiecie QuizVolt
          </h1>
          <p className="mx-auto mt-4 max-w-4xl text-base font-medium tracking-wide text-[#aaa8c4] md:text-lg">
            {session
              ? "Masz aktywna sesje. Wybierz tryb gry albo sprawdz katalogi postepu."
              : "Zaloguj sie, aby zapisac postepy lub graj od razu."}
          </p>
        </header>

        <div id="login" className="flex w-full justify-center">
          <AuthLoginSection />
        </div>

        {session ? (
          <section className="mb-10 w-full">
            <div className="mb-4 flex items-end justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.28em] text-[#8ff5ff]">
                  Kolekcja gracza
                </p>
                <h2 className="mt-2 font-headline text-2xl font-black tracking-tight text-[#f4d5ff]">
                  Katalogi i postep
                </h2>
              </div>
              <span className="hidden text-sm text-[#aaa8c4] md:block">
                Przegladaj to, co juz masz i to, co mozna jeszcze odblokowac.
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Link
                to="/avatars"
                className="glass-panel group rounded-[2rem] p-6 transition-transform duration-200 hover:-translate-y-1"
              >
                <div className="mb-4 flex items-center justify-between">
                  <div className="rounded-2xl bg-[#e08dff]/20 p-3 text-[#e08dff]">
                    <span className="material-symbols-outlined">face</span>
                  </div>
                  <span className="text-xs font-black uppercase tracking-[0.24em] text-[#8ff5ff]">
                    Protected
                  </span>
                </div>
                <h3 className="font-headline text-2xl font-black tracking-tight text-[#e5e3ff]">
                  Wszystkie avatary
                </h3>
                <p className="mt-2 max-w-xl text-sm text-[#aaa8c4]">
                  Zobacz pelny katalog avatarow, w tym te odblokowane przez
                  achievementy i te dostepne do zakupu.
                </p>
              </Link>

              <Link
                to="/achievements"
                className="glass-panel group rounded-[2rem] p-6 transition-transform duration-200 hover:-translate-y-1"
              >
                <div className="mb-4 flex items-center justify-between">
                  <div className="rounded-2xl bg-[#8ff5ff]/20 p-3 text-[#8ff5ff]">
                    <span className="material-symbols-outlined">
                      emoji_events
                    </span>
                  </div>
                  <span className="text-xs font-black uppercase tracking-[0.24em] text-[#ffcf7d]">
                    Rewards
                  </span>
                </div>
                <h3 className="font-headline text-2xl font-black tracking-tight text-[#e5e3ff]">
                  Wszystkie achievementy
                </h3>
                <p className="mt-2 max-w-xl text-sm text-[#aaa8c4]">
                  Sprawdz warunki zdobycia i nagrody, ktore backend juz zwraca w
                  katalogu.
                </p>
              </Link>
            </div>
          </section>
        ) : null}

        <main
          id="mode-selection"
          className="grid w-full grid-cols-1 gap-6 md:grid-cols-3 md:gap-8"
        >
          {modeCards.map((card) => {
            const [beforeHighlight, afterHighlight] = card.description.split(
              card.highlightLabel,
            );

            return (
              <section
                key={card.title}
                className="glass-panel mode-card group flex h-full flex-col rounded-[2rem] border border-[#46465e]/20 px-8 py-8 text-center md:py-10"
              >
                <div
                  className={`relative mb-8 flex h-20 w-20 items-center justify-center self-center rounded-[1.5rem] transition-transform duration-300 group-hover:scale-110 md:h-24 md:w-24 ${card.iconWrapperClassName}`}
                >
                  <span
                    className={`material-symbols-outlined text-5xl md:text-6xl ${card.iconClassName}`}
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    {card.icon}
                  </span>
                  {card.badge ? (
                    <span className="absolute -right-2 -top-2 rounded-md bg-[#8ff5ff] px-2 py-1 text-[10px] font-black tracking-tight text-[#003f43] shadow-lg">
                      {card.badge}
                    </span>
                  ) : null}
                </div>

                <h2 className="mb-4 font-headline text-3xl font-black tracking-tight">
                  {card.title}
                </h2>

                <p className="mb-10 flex-grow leading-relaxed text-[#aaa8c4]">
                  {beforeHighlight}
                  <span className={`font-bold ${card.highlightClassName}`}>
                    {card.highlightLabel}
                  </span>
                  {afterHighlight}
                </p>

                <Link
                  to={card.to}
                  className={`w-full rounded-full px-6 py-4 text-center font-headline text-sm font-black tracking-[0.2em] transition-all duration-150 hover:-translate-y-1 ${card.buttonClassName}`}
                >
                  WYBIERZ
                </Link>
              </section>
            );
          })}
        </main>

        <footer className="mt-16 flex flex-col items-center gap-4 opacity-40 md:mt-20">
          <div className="h-1 w-16 bg-gradient-to-r from-transparent via-[#46465e] to-transparent" />
          <p className="text-xs uppercase tracking-[0.3em] text-[#aaa8c4]">
            System ID: 0X-VOLT-2024
          </p>
        </footer>
      </div>
    </div>
  );
};
