const steps = [
  {
    label: "Krok 1",
    title: "Otworz przegladarke na TV",
    description:
      "Wejdz na tv.quizvolt.pl na dowolnym urzadzeniu z duzym ekranem, Twoim smart TV, laptopie lub konsoli.",
    accent: "text-primary",
    shellClass:
      "md:col-span-5 glass-panel border border-outline-variant/20 hover:border-primary/40",
    icon: "desktop_windows",
  },
  {
    label: "Krok 2",
    title: "Zeskanuj kod QR telefonem",
    description:
      "Nie potrzebujesz zadnej aplikacji. Otworz aparat w telefonie, zeskanuj kod z TV i wybierz swoj nick oraz awatara.",
    accent: "text-secondary",
    shellClass:
      "md:col-span-7 bg-surface-container border border-outline-variant/10 relative overflow-hidden",
    icon: "qr_code_2",
    decorate: true,
  },
  {
    label: "Krok 3",
    title: "Graj i rywalizuj",
    description:
      "Telefon staje sie Twoim unikalnym kontrolerem z przyciskami, suwakami i specjalnymi mocami sabotazu!",
    accent: "text-on-tertiary-container",
    shellClass:
      "md:col-span-12 glass-panel border border-outline-variant/20 flex flex-col gap-10 md:flex-row md:items-center",
    icon: "sports_esports",
    wide: true,
    filled: true,
  },
];

export function PartyHowItWorks() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24 md:px-12">
      <h2 className="mb-16 flex items-center gap-4 font-headline text-3xl font-bold">
        <span className="material-symbols-outlined text-primary">
          auto_awesome
        </span>
        Jak to dziala?
      </h2>

      <div className="grid grid-cols-1 gap-6 md:h-[450px] md:grid-cols-12">
        {steps.map((step) => (
          <article
            key={step.title}
            className={`group rounded-[2rem] p-8 md:p-10 ${step.shellClass}`}
          >
            {step.wide ? (
              <>
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-tertiary to-primary text-4xl md:h-24 md:w-24">
                  <span
                    className={`material-symbols-outlined ${step.accent}`}
                    style={
                      step.filled
                        ? {
                            fontVariationSettings:
                              '"FILL" 1, "wght" 400, "GRAD" 0, "opsz" 24',
                          }
                        : undefined
                    }
                  >
                    {step.icon}
                  </span>
                </div>
                <div className="text-center md:text-left">
                  <span className="mb-1 block text-sm font-bold uppercase tracking-widest text-tertiary">
                    {step.label}
                  </span>
                  <h3 className="mb-2 font-headline text-2xl font-bold">
                    {step.title}
                  </h3>
                  <p className="text-on-surface-variant">{step.description}</p>
                </div>
                <div className="ml-auto hidden gap-2 md:flex">
                  <div className="h-8 w-8 rounded-full bg-primary/20" />
                  <div className="h-8 w-8 rounded-full bg-secondary/20" />
                  <div className="h-8 w-8 rounded-full bg-tertiary/20" />
                </div>
              </>
            ) : (
              <>
                <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl border border-outline-variant/30 bg-surface-container-highest transition-transform group-hover:scale-110">
                  <span className={`material-symbols-outlined ${step.accent}`}>
                    {step.icon}
                  </span>
                </div>
                <div>
                  <span className="mb-2 block text-sm font-bold uppercase tracking-widest text-tertiary">
                    {step.label}
                  </span>
                  <h3 className="mb-4 font-headline text-3xl font-bold">
                    {step.title}
                  </h3>
                  <p className="max-w-md leading-relaxed text-on-surface-variant">
                    {step.description}
                  </p>
                </div>
                {step.decorate ? (
                  <>
                    <div className="absolute right-0 top-0 -mr-12 -mt-12 h-48 w-48 rounded-full bg-secondary/10 blur-3xl" />
                    <div className="absolute bottom-0 right-0 hidden p-8 opacity-20 transition-opacity group-hover:opacity-100 md:block">
                      <div className="flex h-32 w-32 items-center justify-center rounded-xl border-2 border-dashed border-secondary/50 p-2">
                        <div className="h-full w-full rounded-lg bg-on-surface/5" />
                      </div>
                    </div>
                  </>
                ) : null}
              </>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
