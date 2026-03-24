import { Link } from "react-router";

export const PartyPage = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0c0c21] px-6 py-12 text-[#e5e3ff]">
      <div className="pointer-events-none absolute bottom-0 right-0 h-80 w-80 rounded-full bg-[#8ff5ff]/14 blur-[120px]" />
      <div className="mx-auto flex min-h-[80vh] max-w-5xl flex-col justify-center gap-8">
        <Link
          to="/"
          className="w-fit rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-[#e5e3ff] transition-colors hover:bg-white/5"
        >
          Wróć do wyboru trybu
        </Link>

        <div className="glass-panel max-w-3xl rounded-[2rem] p-10">
          <p className="font-headline text-sm uppercase tracking-[0.3em] text-[#8ff5ff]">
            Party Mode
          </p>
          <h1 className="font-headline mt-4 text-5xl font-black tracking-[-0.04em] text-[#f4d5ff]">
            Osobna przestrzeń pod ekran hosta i kontrolery graczy
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-[#aaa8c4]">
            Ta ścieżka jest przygotowana pod tryb imprezowy z odrębnym flow
            urządzeń, kodem pokoju i logiką telewizyjnego ekranu głównego.
            Zostaje odcięta od obecnego multiplayera, więc można ją rozwijać
            niezależnie.
          </p>
        </div>
      </div>
    </div>
  );
};
