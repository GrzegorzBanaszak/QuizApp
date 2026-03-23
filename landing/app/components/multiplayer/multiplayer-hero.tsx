export function MultiplayerHero() {
  return (
    <section className="relative px-6">
      <div className="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-primary/20 blur-[120px]" />
      <div className="absolute -right-12 -top-12 h-64 w-64 rounded-full bg-secondary/20 blur-[100px]" />

      <div className="section-shell relative flex flex-col items-center space-y-6 text-center">
        <span className="rounded-full border border-outline-variant/30 bg-surface-container-high px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-tertiary">
          Ecosystem Spolecznosciowy
        </span>

        <h1 className="max-w-4xl font-headline text-5xl font-black leading-[1.1] tracking-tight md:text-7xl">
          Multiplayer -
          <span className="bg-[length:200%_auto] bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
            {" "}
            Razem Razniej, Razem Mocniej
          </span>
        </h1>

        <p className="max-w-2xl text-lg text-on-surface-variant">
          Zmierz sie z graczami z calego swiata lub zapros przyjaciol do
          prywatnej rozgrywki. Czas udowodnic, kto posiada najwieksza wiedze w
          uniwersum QuizVolt.
        </p>
      </div>
    </section>
  );
}
