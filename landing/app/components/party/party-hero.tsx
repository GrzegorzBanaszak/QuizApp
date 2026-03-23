export function PartyHero() {
  return (
    <section className="relative overflow-hidden border-b border-outline-variant/10 px-6 pb-32 pt-20 md:px-12">
      <div className="absolute right-0 top-0 h-[600px] w-[600px] translate-x-1/4 -translate-y-1/2 rounded-full bg-primary/10 blur-[120px]" />
      <div className="absolute bottom-0 left-0 h-[400px] w-[400px] -translate-x-1/4 translate-y-1/2 rounded-full bg-secondary/10 blur-[100px]" />

      <div className="section-shell relative z-10 mx-auto flex max-w-6xl flex-col items-center text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-surface-container-high px-4 py-1.5">
          <span className="h-2 w-2 rounded-full bg-tertiary" />
          <span className="text-xs font-bold uppercase tracking-tight text-tertiary">
            New: Party Mode 2.0
          </span>
        </div>

        <h1 className="mb-6 font-headline text-5xl font-black leading-tight tracking-tight text-on-surface md:text-8xl">
          Impreza w{" "}
          <span className="bg-gradient-to-r from-primary via-secondary to-tertiary bg-clip-text text-transparent [text-shadow:0_0_15px_rgba(224,141,255,0.5)]">
            Twoim Salonie!
          </span>
        </h1>

        <p className="mb-12 max-w-2xl text-xl leading-relaxed text-on-surface-variant md:text-2xl">
          Zamien swoj telewizor w centrum rozrywki, a telefon w kontroler.
          Quizy jeszcze nigdy nie byly tak dynamiczne.
        </p>

        <div className="flex flex-col gap-6 sm:flex-row">
          <a
            href="http://localhost:5173"
            className="rounded-full bg-gradient-to-r from-primary to-secondary px-10 py-5 font-headline text-lg font-extrabold text-on-primary shadow-[0_0_30px_rgba(224,141,255,0.4)] transition-all active:scale-95"
          >
            Stworz Pokoj
          </a>
          <a
            href="http://localhost:5173"
            className="rounded-full border border-outline-variant bg-surface-bright/50 px-10 py-5 font-headline text-lg font-bold text-on-surface transition-all hover:bg-surface-bright"
          >
            Dolacz do gry
          </a>
        </div>
      </div>
    </section>
  );
}
