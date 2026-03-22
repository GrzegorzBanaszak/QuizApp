const steps = [
  {
    number: "01",
    title: "Wybierz Tryb",
    description: "Graj solo lub stworz pokoj dla znajomych jednym kliknieciem.",
    color: "text-primary",
    border: "border-primary/20 hover:border-primary",
    connector: "from-primary/30",
  },
  {
    number: "02",
    title: "Polacz Urzadzenia",
    description: "Zeskanuj QR kod lub wpisz PIN pokoju. Kazdy jest w grze.",
    color: "text-secondary",
    border: "border-secondary/20 hover:border-secondary",
    connector: "from-secondary/30",
  },
  {
    number: "03",
    title: "Zdominuj Ranking",
    description: "Odpowiadaj szybko i celnie, by zgarnac korone zwyciezcy.",
    color: "text-tertiary",
    border: "border-tertiary/20 hover:border-tertiary",
    connector: "from-tertiary/30",
  },
];

export function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="bg-surface-container-lowest px-6 py-32"
    >
      <div className="section-shell">
        <h2 className="mb-20 text-center font-headline text-4xl font-black tracking-tight md:text-5xl">
          Zacznij w <span className="text-primary">3 prostych krokach</span>
        </h2>

        <div className="grid gap-12 md:grid-cols-3">
          {steps.map((step, index) => (
            <article key={step.number} className="group relative space-y-6 text-center">
              <div
                className={`relative z-10 mx-auto flex h-24 w-24 items-center justify-center rounded-full border-2 bg-surface-container transition-colors ${step.border}`}
              >
                <span className={`font-headline text-4xl font-black ${step.color}`}>
                  {step.number}
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-bold text-on-surface">{step.title}</h3>
                <p className="text-sm leading-relaxed text-on-surface-variant">
                  {step.description}
                </p>
              </div>

              {index < steps.length - 1 ? (
                <div
                  className={`absolute left-[calc(50%+4rem)] top-12 hidden h-[2px] w-[calc(100%-8rem)] bg-gradient-to-r ${step.connector} to-transparent md:block`}
                />
              ) : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
