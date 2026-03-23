const features = [
  {
    title: "Przeszkadzaj Innym",
    description:
      'Zdobadz power-upy i zamroz ekran przeciwnika, ukryj jego odpowiedzi pod warstwa "lodu" lub zamien jego przyciski miejscami.',
    accentShell: "bg-error/10 text-error",
    icon: "ac_unit",
  },
  {
    title: "Dynamiczne Tempo",
    description:
      "Pytania zmieniaja sie w rytm muzyki. Im szybciej odpowiesz, tym wiecej punktow i szans na ataki specjalne otrzymasz.",
    accentShell: "bg-primary/10 text-primary",
    icon: "rocket_launch",
  },
];

export function PartyFeatures() {
  return (
    <section className="bg-surface-container-lowest/50 py-24">
      <div className="mx-auto max-w-6xl px-6 md:px-12">
        <div className="mb-16 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <h2 className="mb-4 font-headline text-4xl font-black tracking-tight">
              Mieszanka Quizu i Turnieju
            </h2>
            <p className="text-lg text-on-surface-variant">
              To nie jest zwykle odpowiadanie na pytania. To walka o
              przetrwanie w cyfrowym ringu.
            </p>
          </div>

          <div className="rounded-full border border-outline-variant bg-surface-container-high px-6 py-3 text-sm font-bold text-tertiary">
            TRYB TURNIEJOWY: AKTYWNY
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {features.map((feature) => (
            <article
              key={feature.title}
              className="rounded-[2rem] border border-outline-variant/20 bg-surface-container-high p-8 transition-transform hover:scale-[1.02]"
            >
              <div className="flex items-start gap-6">
                <div
                  className={`rounded-2xl p-4 text-4xl ${feature.accentShell}`}
                >
                  <span className="material-symbols-outlined">
                    {feature.icon}
                  </span>
                </div>
                <div>
                  <h3 className="mb-3 font-headline text-2xl font-bold">
                    {feature.title}
                  </h3>
                  <p className="leading-relaxed text-on-surface-variant">
                    {feature.description}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
