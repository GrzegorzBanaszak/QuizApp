import { Link } from "react-router";

interface ModeUnderConstructionProps {
  title: string;
  eyebrow: string;
  description: string;
  statusPrimary: string;
  statusSecondary: string;
}

export const ModeUnderConstruction = ({
  title,
  eyebrow,
  description,
  statusPrimary,
  statusSecondary,
}: ModeUnderConstructionProps) => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0c0c21] px-4 py-6 text-[#e5e3ff] sm:px-6 lg:px-8 lg:py-10">
      <div className="pointer-events-none fixed inset-0 -z-20 bg-[radial-gradient(circle_at_50%_50%,rgba(23,23,48,0.95)_0%,rgba(12,12,33,1)_100%)]" />
      <div className="pointer-events-none fixed inset-0 -z-20 opacity-[0.035] [background-image:radial-gradient(#e08dff_0.6px,transparent_0.6px)] [background-size:32px_32px]" />
      <div className="pointer-events-none fixed -left-24 -top-24 -z-10 h-96 w-96 rounded-full bg-[linear-gradient(135deg,#e08dff_0%,#ff68a7_100%)] opacity-15 blur-[120px]" />
      <div className="pointer-events-none fixed -bottom-48 -right-48 -z-10 h-[32rem] w-[32rem] rounded-full bg-[linear-gradient(135deg,#e08dff_0%,#ff68a7_100%)] opacity-10 blur-[140px]" />

      <main className="relative z-10 mx-auto flex min-h-[calc(100vh-6rem)] w-full max-w-4xl flex-col items-center justify-center px-2 text-center">
        <div className="relative mb-10 flex h-80 w-80 items-center justify-center sm:mb-12 sm:h-[26rem] sm:w-[26rem]">
          <div className="absolute flex items-center justify-center">
            <div className="h-60 w-60 animate-pulse rounded-full border-2 border-[#e08dff]/20 sm:h-72 sm:w-72" />
            <div className="absolute h-48 w-48 animate-ping rounded-full border border-[#8ff5ff]/10 sm:h-60 sm:w-60" />
          </div>

          <div className="glass-panel relative rounded-full bg-[#1d1d39]/65 p-10 shadow-[0_0_50px_rgba(224,141,255,0.15)] outline outline-1 outline-white/5 sm:p-12">
            <span
              className="material-symbols-outlined block leading-none text-[#e08dff] [text-shadow:0_0_15px_rgba(224,141,255,0.6),0_0_30px_rgba(224,141,255,0.2)]"
              style={{
                fontSize: "clamp(8rem, 11vw, 10rem)",
                fontVariationSettings: "'FILL' 1, 'wght' 200, 'opsz' 48",
              }}
            >
              precision_manufacturing
            </span>

            <div className="absolute -right-3 -top-3 rounded-xl border border-[#8ff5ff]/30 bg-[#8ff5ff]/20 p-3 backdrop-blur-md sm:-right-4 sm:-top-4">
              <span
                className="material-symbols-outlined text-2xl text-[#8ff5ff]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                bolt
              </span>
            </div>

            <div className="absolute -bottom-2 -left-5 rounded-xl border border-[#ff68a7]/30 bg-[#ff68a7]/20 p-3 backdrop-blur-md sm:-left-6">
              <span
                className="material-symbols-outlined text-2xl text-[#ff68a7]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                settings_input_component
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-xs font-black uppercase tracking-[0.34em] text-[#8ff5ff]">
            {eyebrow}
          </p>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#74738d]">
            {title}
          </p>
          <h1 className="font-headline text-5xl font-black uppercase italic tracking-tighter text-[#f4d5ff] [text-shadow:0_0_15px_rgba(224,141,255,0.6),0_0_30px_rgba(224,141,255,0.2)] sm:text-6xl lg:text-7xl">
            TRYB W{" "}
            <span className="bg-gradient-to-r from-[#e08dff] to-[#ff68a7] bg-clip-text text-transparent">
              BUDOWIE
            </span>
          </h1>
          <p className="mx-auto max-w-xl text-lg font-medium leading-relaxed text-[#aaa8c4] sm:text-xl">
            {description} <span className="text-[#8ff5ff]">Wróć wkrótce!</span>
          </p>
        </div>

        <div className="mt-14 flex flex-wrap justify-center gap-4 opacity-85 sm:gap-6">
          <div className="flex items-center gap-3 rounded-full border border-white/10 bg-[#111128]/80 px-5 py-3">
            <div className="h-2 w-2 animate-pulse rounded-full bg-[#8ff5ff] shadow-[0_0_8px_#8ff5ff]" />
            <span className="font-headline text-xs uppercase tracking-[0.28em] text-[#8ff5ff]">
              {statusPrimary}
            </span>
          </div>
          <div className="flex items-center gap-3 rounded-full border border-white/10 bg-[#111128]/80 px-5 py-3">
            <div className="h-2 w-2 animate-pulse rounded-full bg-[#ff68a7] shadow-[0_0_8px_#ff68a7]" />
            <span className="font-headline text-xs uppercase tracking-[0.28em] text-[#ff68a7]">
              {statusSecondary}
            </span>
          </div>
        </div>

        <div className="mt-16 sm:mt-20">
          <Link
            to="/"
            className="group relative inline-flex items-center gap-4 rounded-full bg-gradient-to-r from-[#e08dff] to-[#d978ff] px-8 py-4 font-headline text-sm font-black uppercase tracking-[0.22em] text-[#4f006c] shadow-[0_0_30px_rgba(224,141,255,0.4)] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_50px_rgba(224,141,255,0.6)] active:scale-95 sm:px-12 sm:py-5"
          >
            <span
              className="material-symbols-outlined text-xl"
              style={{ fontVariationSettings: "'wght' 700" }}
            >
              arrow_back_ios_new
            </span>
            Powrót do menu
            <span className="absolute inset-0 rounded-full border-2 border-white/20 opacity-0 transition-all duration-500 group-hover:opacity-100 sm:scale-110 group-hover:sm:scale-100" />
          </Link>
        </div>
      </main>
    </div>
  );
};
