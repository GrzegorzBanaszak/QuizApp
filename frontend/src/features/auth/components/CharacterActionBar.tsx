import { Link } from "react-router";

interface CharacterActionBarProps {
  isSubmitting: boolean;
  isReady: boolean;
  canSubmit: boolean;
  submitLabel: string;
  onSubmit: () => void;
}

export const CharacterActionBar = ({
  isSubmitting,
  isReady,
  canSubmit,
  submitLabel,
  onSubmit,
}: CharacterActionBarProps) => {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <button
        type="button"
        onClick={onSubmit}
        disabled={!isReady || isSubmitting || !canSubmit}
        className="rounded-full bg-gradient-to-r from-[#e08dff] to-[#d978ff] px-8 py-4 font-headline text-sm font-black tracking-[0.2em] text-[#4f006c] shadow-[0_0_30px_rgba(224,141,255,0.35)] transition-all hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? "TWORZENIE..." : submitLabel}
      </button>
      <Link
        to="/"
        className="rounded-full border border-white/10 px-8 py-4 text-center text-sm font-bold uppercase tracking-[0.2em] text-[#e5e3ff] transition-colors hover:bg-white/5"
      >
        Powrót
      </Link>
    </div>
  );
};
