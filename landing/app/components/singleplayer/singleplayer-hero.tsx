export function SingleplayerHero() {
  return (
    <section className="relative overflow-hidden px-6 py-20 text-center lg:py-32">
      <div className="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-primary/20 blur-[120px]" />
      <div className="absolute right-[-6rem] top-1/2 h-80 w-80 rounded-full bg-secondary/15 blur-[100px]" />

      <div className="section-shell relative z-10 mx-auto max-w-4xl">
        <span className="mb-6 inline-block rounded-md border border-tertiary/20 bg-surface-container-highest px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-tertiary">
          Tryb Solo
        </span>

        <h1 className="mb-8 font-headline text-5xl font-black tracking-[-0.05em] text-on-surface md:text-7xl lg:text-8xl">
          Tryb Singleplayer
          <br />
          <span className="bg-gradient-to-br from-primary via-secondary to-tertiary bg-clip-text text-transparent">
            Twoja Droga do
          </span>
          <br />
          Mistrzostwa
        </h1>

        <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-on-surface-variant md:text-xl">
          Trenuj umysl, odblokowuj wyjatkowe skorki i wspinaj sie na
          szczyt rankingu w najbardziej elektryzujacym wyzwaniu dla
          jednego gracza.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <a
            href="http://localhost:5173"
            className="group relative overflow-hidden rounded-full bg-primary px-10 py-4 text-lg font-bold text-on-primary hover:shadow-[0_0_30px_rgba(224,141,255,0.4)]"
          >
            <span className="relative z-10">Zacznij Wyzwanie</span>
            <span className="absolute inset-0 bg-gradient-to-r from-secondary to-primary opacity-0 transition-opacity group-hover:opacity-100" />
          </a>

          <a
            href="#kategorie"
            className="rounded-full border border-primary/20 bg-surface-bright px-10 py-4 text-lg font-bold text-on-surface hover:border-primary/50"
          >
            Zobacz Kategorie
          </a>
        </div>
      </div>
    </section>
  );
}
