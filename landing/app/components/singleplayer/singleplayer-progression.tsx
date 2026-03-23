const progressionItems = [
  {
    title: "Osiagniecia",
    description: "Zdobadz 50 unikalnych odznak za specjalne wyzwania i serie zwyciestw.",
    accent: "border-primary text-primary bg-primary/10",
  },
  {
    title: "Ekskluzywne Skiny",
    description:
      "Odblokuj awatary i efekty wizualne po ukonczeniu trudniejszych kategorii.",
    accent: "border-secondary text-secondary bg-secondary/10",
  },
];

const rewards = [
  { title: "Lowca Piorunow", tone: "from-primary to-secondary", text: "text-primary" },
  { title: "Neonowy Mistrz", tone: "from-tertiary to-primary", text: "text-tertiary" },
  { title: "???", tone: "from-surface-bright to-surface-bright", text: "text-on-surface-variant" },
  { title: "Cyber-Skin #04", tone: "from-secondary to-primary", text: "text-secondary" },
];

export function SingleplayerProgression() {
  return (
    <section className="relative overflow-hidden bg-surface-container-low py-24">
      <div className="section-shell grid items-center gap-16 px-6 lg:grid-cols-2">
        <div className="relative">
          <div className="absolute -left-10 -top-10 h-40 w-40 bg-tertiary/20 blur-[60px]" />

          <div className="relative z-10 space-y-8">
            <div>
              <h2 className="font-headline text-4xl font-black text-on-surface">
                System Progresji
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-on-surface-variant">
                Zbieraj punkty w ulubionych kategoriach, odblokowuj zawartosc i
                buduj profil, ktory pokazuje Twoja droge do mistrzostwa.
              </p>
            </div>

            <div className="space-y-6">
              {progressionItems.map((item) => (
                <article
                  key={item.title}
                  className="rounded-[2rem] bg-surface-container-high p-6"
                >
                  <div className="flex items-start gap-5">
                    <div
                      className={`rounded-2xl border-l-4 p-3 ${item.accent}`}
                    >
                      *
                    </div>
                    <div>
                      <h3 className="font-bold text-on-surface">{item.title}</h3>
                      <p className="mt-1 text-sm text-on-surface-variant">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {rewards.map((reward, index) => (
            <article
              key={reward.title}
              className={[
                "flex min-h-44 flex-col items-center justify-center rounded-[2rem] border border-outline-variant/10 bg-surface-container p-6 text-center shadow-[0_20px_40px_rgba(0,0,0,0.3)]",
                index === 1 ? "mt-8" : "",
                index === 2 ? "-mt-4" : "",
              ].join(" ")}
            >
              <div
                className={`mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br ${reward.tone} text-xl font-black text-on-primary shadow-[0_0_20px_rgba(224,141,255,0.25)]`}
              >
                {index < 2 ? "!" : index === 2 ? "?" : "S"}
              </div>
              <p className={`font-headline font-bold ${reward.text}`}>
                {reward.title}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
