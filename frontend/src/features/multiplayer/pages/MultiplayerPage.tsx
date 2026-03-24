import { Link } from "react-router";
import { LegacyMultiplayerApp } from "../../../legacy/LegacyMultiplayerApp";

export const MultiplayerPage = () => {
  return (
    <div className="min-h-screen bg-[#050816]">
      <div className="border-b border-white/10 bg-[#0c0c21]/90 px-6 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div>
            <p className="font-headline text-sm uppercase tracking-[0.3em] text-[#8ff5ff]">
              Multiplayer
            </p>
            <h1 className="font-headline text-2xl font-black text-[#f4d5ff]">
              Legacy flow pod nowym routerem
            </h1>
          </div>
          <Link
            to="/"
            className="rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-[#e5e3ff] transition-colors hover:bg-white/5"
          >
            Wróć do wyboru trybu
          </Link>
        </div>
      </div>
    </div>
  );
};
