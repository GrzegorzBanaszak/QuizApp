import { Link } from "react-router";

const modeCards = [
  {
    title: "Graj Solo",
    description:
      "Sprawdź swoją wiedzę w starciu z AI. Dynamicznie generowane pytania dopasowane do Twoich zainteresowań i droga do globalnego Top 100.",
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
      "Rywalizacja w czasie rzeczywistym. Wybieraj między klasycznym quizem a intensywnymi turniejami eliminacyjnymi i sprawdź, kto naprawdę prowadzi lobby.",
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
      "Zmień salon w studio telewizyjne. Telefon staje się kontrolerem, a wspólny ekran główną sceną z mechanikami sabotażu i widowiskową rywalizacją.",
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
            Witaj w Świecie QuizVolt
          </h1>
          <p className="mx-auto mt-4 max-w-3xl text-base font-medium tracking-wide text-[#aaa8c4] md:text-lg">
            Zaloguj się, aby zapisać postępy lub graj od razu
          </p>
        </header>

        <section className="mb-16 w-full max-w-4xl" aria-label="Logowanie">
          <div className="glass-panel rounded-[2rem] border border-[#46465e]/30 px-5 py-6 shadow-[0_24px_80px_rgba(5,8,22,0.45)] md:px-8 md:py-10">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <button
                type="button"
                className="flex items-center justify-center gap-3 rounded-full bg-white px-6 py-4 text-sm font-bold text-gray-900 transition-all hover:scale-[1.02]"
              >
                <svg className="h-6 w-6" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                <span>Google</span>
              </button>

              <button
                type="button"
                className="flex items-center justify-center gap-3 rounded-full bg-[#1877F2] px-6 py-4 text-sm font-bold text-white transition-all hover:scale-[1.02]"
              >
                <svg
                  className="h-6 w-6 fill-current"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12S0 5.446 0 12.073c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <span>Facebook</span>
              </button>

              <a
                href="#mode-selection"
                className="flex items-center justify-center gap-3 rounded-full border-2 border-[#46465e]/30 bg-[#29294a] px-6 py-4 text-sm font-bold text-[#e5e3ff] transition-all hover:scale-[1.02] hover:border-[#e08dff]/50"
              >
                <span
                  className="material-symbols-outlined text-2xl"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  person_outline
                </span>
                <span>Graj jako Gość</span>
              </a>
            </div>

            <p className="mt-6 text-center text-[11px] uppercase tracking-[0.28em] text-[#aaa8c4] md:text-xs">
              Synchronizuj swoje wyniki na wszystkich urządzeniach
            </p>
          </div>
        </section>

        <main
          id="mode-selection"
          className="grid w-full grid-cols-1 gap-6 md:grid-cols-3 md:gap-8"
        >
          {modeCards.map((card) => {
            const [beforeHighlight, afterHighlight] =
              card.description.split(card.highlightLabel);

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

      <nav className="glass-panel fixed bottom-0 left-0 z-50 flex w-full items-center justify-around rounded-t-[2rem] px-6 pb-8 pt-4 shadow-[0_-10px_40px_rgba(224,141,255,0.08)] md:hidden">
        <div className="rounded-2xl bg-[#e08dff]/20 p-3 text-[#e08dff] shadow-[0_0_15px_rgba(224,141,255,0.3)]">
          <span className="material-symbols-outlined">bolt</span>
        </div>
        <div className="p-3 text-[#74738d] transition-colors hover:text-[#e08dff]">
          <span className="material-symbols-outlined">emoji_events</span>
        </div>
        <div className="p-3 text-[#74738d] transition-colors hover:text-[#e08dff]">
          <span className="material-symbols-outlined">leaderboard</span>
        </div>
        <div className="p-3 text-[#74738d] transition-colors hover:text-[#e08dff]">
          <span className="material-symbols-outlined">settings</span>
        </div>
      </nav>
    </div>
  );
};
