export function MultiplayerQuickPlay() {
  return (
    <section className="flex justify-center px-6">
      <a
        href="http://localhost:5173"
        className="group relative flex items-center gap-3 rounded-full bg-gradient-to-r from-primary to-primary-container px-10 py-5 text-xl font-bold text-on-primary shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95"
      >
        <span
          className="material-symbols-outlined"
          aria-hidden="true"
          style={{
            fontVariationSettings: '"FILL" 1, "wght" 400, "GRAD" 0, "opsz" 24',
          }}
        >
          bolt
        </span>
        Szybka Gra
        <span className="absolute -inset-1 -z-10 rounded-full bg-gradient-to-r from-primary to-secondary opacity-40 blur-lg transition-opacity group-hover:opacity-60" />
      </a>
    </section>
  );
}
