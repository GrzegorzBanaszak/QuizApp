import { Link } from "react-router";

interface SingleplayerBottomNavProps {
  label?: string;
}

export const SingleplayerBottomNav = ({
  label = "Wróć do trybów",
}: SingleplayerBottomNavProps) => {
  return (
    <nav className="fixed bottom-0 left-0 z-50 flex w-full justify-center px-6 pb-8">
      <div className="flex items-center gap-8 rounded-full bg-[#111128]/80 px-6 py-4 shadow-[0_-4px_40px_rgba(224,141,255,0.08)] ring-1 ring-white/10 backdrop-blur-xl">
        <Link
          to="/"
          className="group flex items-center justify-center rounded-full bg-purple-900/30 px-8 py-3 text-purple-200 ring-1 ring-purple-500/20 transition-all duration-300 hover:bg-purple-800/20 hover:text-purple-100 active:scale-90"
        >
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-xl">arrow_back</span>
            <span className="text-sm font-bold tracking-tight">Powrót</span>
          </div>
        </Link>
        <div className="h-6 w-px bg-white/10" />
        <span className="hidden text-xs font-bold uppercase tracking-[0.2em] text-[#aaa8c4] sm:block">
          {label}
        </span>
      </div>
    </nav>
  );
};
