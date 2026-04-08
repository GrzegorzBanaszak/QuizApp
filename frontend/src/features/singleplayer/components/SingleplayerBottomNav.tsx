import { useSingleplayerStore } from "../store/singleplayerStore";

interface SingleplayerBottomNavProps {
  label?: string;
}

export const SingleplayerBottomNav = ({
  label = "Wybierz poziom",
}: SingleplayerBottomNavProps) => {
  const goToLevelSelect = useSingleplayerStore(
    (state) => state.goToLevelSelect,
  );

  return (
    <nav className="fixed bottom-16 left-0 z-50 flex w-full justify-center px-6 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:bottom-6">
      <div className="flex items-center gap-6 rounded-full bg-[#0c0c21]/92 px-5 py-3 shadow-[0_-4px_28px_rgba(5,8,22,0.28)] ring-1 ring-white/8 backdrop-blur-md md:gap-8 md:px-6 md:py-4">
        <button
          type="button"
          onClick={goToLevelSelect}
          className="group flex min-h-[56px] items-center justify-center rounded-full bg-gradient-to-r from-[#e08dff] to-[#d978ff] px-8 py-4 text-[#4f006c] ring-1 ring-[#e08dff]/20 transition-all duration-300 hover:scale-105 active:scale-95 md:min-h-[72px] md:px-10 md:py-5"
        >
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-lg md:text-xl">
              bolt
            </span>
            <span className="text-xs font-black tracking-tight sm:text-sm md:text-base">
              {label}
            </span>
          </div>
        </button>
      </div>
    </nav>
  );
};
