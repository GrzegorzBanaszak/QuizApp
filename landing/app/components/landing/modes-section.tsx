import { Icon } from "@/app/components/landing/ui-icon";
import { SectionHeading } from "@/app/components/landing/section-heading";

const modeCards = [
  {
    id: "party",
    icon: "group" as const,
    title: "Tryb Party",
    description:
      "Uruchom gre w przegladarce na TV, a goscie dolacza skanujac kod QR. Telefon staje sie Twoim panelem odpowiedzi, z wibracjami i dzwiekami prosto w dloni.",
    badgeClass: "bg-secondary-container text-on-secondary-container",
    shellClass: "glass-panel border border-white/5",
    bullets: [
      "Do 50 graczy jednoczesnie",
      "Nie wymaga instalacji aplikacji",
    ],
  },
  {
    id: "multiplayer",
    icon: "globe" as const,
    title: "Multiplayer Online",
    description:
      "Rywalizuj z przyjaciolmi lub losowymi przeciwnikami w szybkich bitwach 1vs1 lub turniejach dla 8 osob. Szybkie lobby, zero lagow.",
    badgeClass: "bg-primary/20 text-primary",
    shellClass: "bg-surface-container-highest",
    bullets: [],
  },
];

export function ModesSection() {
  return (
    <section className="relative overflow-hidden px-6 py-32">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,104,167,0.05)_0%,_transparent_70%)]" />

      <div className="section-shell relative z-10 space-y-12 text-center">
        <SectionHeading
          centered
          title="Impreza w Twoim"
          highlight="Salonie!"
          description="Zapomnij o nudnych planszowkach. Przeksztalc dowolny ekran w centrum rozrywki, a swoj telefon w potezny kontroler."
        />

        <div className="grid gap-8 md:grid-cols-2">
          {modeCards.map((card) => (
            <article
              id={card.id}
              key={card.title}
              className={`${card.shellClass} flex h-full flex-col justify-between rounded-[2rem] p-10 text-left`}
            >
              <div className="space-y-4">
                <div
                  className={`flex h-16 w-16 items-center justify-center rounded-[1.5rem] ${card.badgeClass}`}
                >
                  <Icon name={card.icon} className="h-8 w-8" />
                </div>
                <h3 className="font-headline text-3xl font-bold text-on-surface">
                  {card.title}
                </h3>
                <p className="leading-relaxed text-on-surface-variant">
                  {card.description}
                </p>
              </div>

              {card.bullets.length > 0 ? (
                <ul className="mt-8 space-y-3">
                  {card.bullets.map((bullet) => (
                    <li
                      key={bullet}
                      className="flex items-center gap-3 text-sm text-on-surface"
                    >
                      <Icon name="check" className="h-5 w-5 text-secondary" />
                      {bullet}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="mt-8 flex items-center gap-4">
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface-container">
                    <div className="h-full w-3/4 bg-gradient-to-r from-tertiary to-primary" />
                  </div>
                  <span className="text-xs font-bold text-tertiary">
                    3,421 aktywnych bitew
                  </span>
                </div>
              )}
            </article>
          ))}
        </div>

        <div className="pt-8">
          <img
            alt="Gracze podczas imprezy"
            className="mx-auto w-full max-w-4xl rounded-[2rem] grayscale transition-all duration-700 hover:grayscale-0"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCP4Q_XOeTR0t0OopdgsEuWkCophBL_EDLUCmVTS9VlX7O-4Dwh4Vl4SgWvC5S9zOdkQyOlWvi5514meYSCcrr42ok3S-PnTDHqdndJzh20unJ3lFdMb0_fquElo1hFmceY4h5o4nQFiSwwf9Nv7OMTsnMa0PosF4CuACNs2K8Effvj2yDy-TjurUGNaBpMloo5uApsV4HsrfohTtwo5ml5O8Y-Jp2kwFd4Sn3ZSxvbDOkjtdNdRsZZSwJpFJ79ii36lA_inmnxkqdb"
          />
        </div>
      </div>
    </section>
  );
}
