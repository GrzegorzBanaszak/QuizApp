const modes = [
  {
    title: "Klasyczny Quiz",
    description:
      "Zbierz znajomych w prywatnym lobby. Odpowiadajcie na te same pytania i sprawdzcie, kto z Was jest mistrzem wiedzy. Do 8 graczy jednoczesnie.",
    icon: "groups",
    accent: "primary",
    buttonLabel: "Stworz Lobby",
  },
  {
    title: "Tryb Turniejowy",
    description:
      "Wejdz na arene miedzynarodowa. System eliminacji, drabinka turniejowa i walka o prestizowe trofea. Codzienne turnieje o godzinie 20:00.",
    icon: "emoji_events",
    accent: "secondary",
    buttonLabel: "Zapisz sie do Areny",
  },
];

export function MultiplayerModes() {
  return (
    <section className="section-shell grid gap-8 px-6 lg:grid-cols-2">
      {modes.map((mode) => {
        const isPrimary = mode.accent === "primary";

        return (
          <article
            key={mode.title}
            className={`group relative overflow-hidden rounded-[2rem] border border-outline-variant/10 bg-surface-container p-10 transition-all duration-500 ${isPrimary ? "hover:border-primary/40" : "hover:border-secondary/40"}`}
          >
            <div className="absolute right-0 top-0 p-8 opacity-10 transition-opacity group-hover:opacity-20">
              <span className="material-symbols-outlined text-[120px] text-on-surface">
                {mode.icon}
              </span>
            </div>

            <div className="relative z-10 flex h-full flex-col space-y-6">
              <div
                className={`mb-2 flex h-16 w-16 items-center justify-center rounded-2xl text-4xl ${isPrimary ? "bg-primary/10 text-primary" : "bg-secondary/10 text-secondary"}`}
              >
                <span className="material-symbols-outlined">{mode.icon}</span>
              </div>

              <h3 className="font-headline text-3xl font-bold text-on-surface">
                {mode.title}
              </h3>

              <p className="flex-grow leading-relaxed text-on-surface-variant">
                {mode.description}
              </p>

              <a
                href="http://localhost:5173"
                className={`w-fit rounded-full border px-8 py-3 font-bold transition-all ${isPrimary ? "border-primary/20 bg-surface-bright text-primary hover:bg-primary hover:text-on-primary" : "border-secondary/20 bg-surface-bright text-secondary hover:bg-secondary hover:text-on-primary"}`}
              >
                {mode.buttonLabel}
              </a>
            </div>
          </article>
        );
      })}
    </section>
  );
}
