import { Link } from "react-router";

const modeCards = [
  {
    title: "Graj Solo",
    description:
      "Sprawdź swoją wiedzę w starciu z AI. Buduj ranking, odblokowuj progres i wracaj po kolejne wyzwania.",
    to: "/singleplayer",
    icon: "bolt",
    accent: "from-[#e08dff] to-[#d978ff]",
    iconTone: "text-[#e08dff]",
    badge: null,
  },
  {
    title: "Graj ze Znajomymi",
    description:
      "Rywalizacja w czasie rzeczywistym w pokojach multiplayer. To tutaj działa obecny flow lobby, głosowania i pytań.",
    to: "/multiplayer",
    icon: "group",
    accent: "from-[#ff68a7] to-[#b90068]",
    iconTone: "text-[#ff68a7]",
    badge: "LIVE",
  },
  {
    title: "Tryb Imprezy",
    description:
      "Telefon jako kontroler, wspólny ekran jako centrum gry i miejsce na bardziej widowiskowe mechaniki niż klasyczny quiz.",
    to: "/party",
    icon: "tv",
    accent: "from-[#8ff5ff] to-[#00eefc]",
    iconTone: "text-[#8ff5ff]",
    badge: null,
  },
];

export const HomePage = () => {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#0c0c21] text-[#e5e3ff]">
      <div className="pointer-events-none fixed left-[-10%] top-[-10%] h-[45vh] w-[45vw] rounded-full bg-[#e08dff]/12 blur-[120px]" />
      <div className="pointer-events-none fixed bottom-[-10%] right-[-10%] h-[35vh] w-[35vw] rounded-full bg-[#ff68a7]/12 blur-[120px]" />
      <div className="pointer-events-none fixed right-[-4rem] top-1/4 h-48 w-48 rotate-12 rounded-full border border-white/10 opacity-20" />
      <div className="pointer-events-none fixed bottom-1/4 left-[-5rem] h-64 w-64 -rotate-12 rounded-full border border-white/10 opacity-20" />

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 py-10">
        <header className="mb-16 w-full max-w-7xl text-center">
          <div className="mb-4 inline-block">
            <span className="font-headline text-3xl font-black italic tracking-tight text-transparent bg-gradient-to-r from-[#e08dff] to-[#ff68a7] bg-clip-text">
              QuizVolt
            </span>
          </div>
          <h1 className="neon-text-glow font-headline text-4xl font-black uppercase tracking-[-0.04em] text-[#f4d5ff] md:text-6xl">
            Wybierz Tryb Rozgrywki
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg font-medium tracking-wide text-[#aaa8c4]">
            Nowy frontend jest podzielony na trzy osobne ścieżki produktu.
            Każdy tryb dostaje własny ekran wejścia i własną przestrzeń na logikę.
          </p>
        </header>

        <main className="grid w-full max-w-7xl grid-cols-1 gap-8 md:grid-cols-3">
          {modeCards.map((card) => (
            <section
              key={card.title}
              className="mode-card glass-panel flex flex-col items-center rounded-[2rem] px-8 py-10 text-center"
            >
              <div className="relative mb-8 flex h-24 w-24 items-center justify-center rounded-[1.75rem] bg-white/5 shadow-[0_0_40px_rgba(224,141,255,0.16)] transition-transform duration-300 group-hover:scale-110">
                <span
                  className={`material-symbols-outlined text-6xl ${card.iconTone}`}
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

              <h2 className="font-headline mb-4 text-3xl font-black tracking-tight">
                {card.title}
              </h2>

              <p className="mb-10 flex-grow leading-relaxed text-[#aaa8c4]">
                {card.description}
              </p>

              <Link
                to={card.to}
                className={`w-full rounded-full bg-gradient-to-r px-6 py-4 text-center font-headline text-sm font-black tracking-[0.2em] text-[#14071f] transition-all duration-150 hover:-translate-y-1 ${card.accent}`}
              >
                WYBIERZ
              </Link>
            </section>
          ))}
        </main>

        <footer className="mt-20 flex flex-col items-center gap-4 opacity-50">
          <div className="h-px w-24 bg-gradient-to-r from-transparent via-white/40 to-transparent" />
          <p className="text-xs uppercase tracking-[0.3em] text-[#aaa8c4]">
            Frontend Reset / Mode Router
          </p>
        </footer>
      </div>
    </div>
  );
};
