import { Icon } from "@/app/components/landing/ui-icon";
import { SectionHeading } from "@/app/components/landing/section-heading";

const featureCards = [
  {
    icon: "brain" as const,
    title: "AI Real-Time",
    description: "Pytania generowane przez AI w czasie rzeczywistym.",
    color: "text-primary",
    accent: "border-primary",
    raised: false,
  },
  {
    icon: "trend" as const,
    title: "Top 100",
    description: "Wspinaj sie do elitarnego grona najlepszych na swiecie.",
    color: "text-tertiary",
    accent: "",
    raised: true,
  },
  {
    icon: "sliders" as const,
    title: "Poziomy Trudnosci",
    description: "Od amatora po arcymistrza wiedzy.",
    color: "text-secondary",
    accent: "",
    raised: false,
  },
  {
    icon: "crown" as const,
    title: "Nagrody",
    description: "Unikalne skiny i odznaki dla mistrzow solo.",
    color: "text-tertiary",
    accent: "border-tertiary",
    raised: true,
  },
];

export function SoloSection() {
  return (
    <section id="solo" className="bg-surface-container-low/30 px-6 py-32">
      <div className="section-shell grid items-center gap-12 lg:grid-cols-12">
        <div className="order-2 lg:order-1 lg:col-span-5">
          <div className="grid grid-cols-2 gap-4">
            {featureCards.map((card) => (
              <article
                key={card.title}
                className={[
                  "rounded-[2rem] p-6",
                  card.raised ? "mt-8 bg-surface-container-high" : "bg-surface-container",
                  card.accent ? `border-l-4 ${card.accent}` : "",
                ].join(" ")}
              >
                <div className="space-y-4">
                  <Icon name={card.icon} className={`h-8 w-8 ${card.color}`} />
                  <h3 className="text-lg font-bold text-on-surface">{card.title}</h3>
                  <p className="text-sm leading-relaxed text-on-surface-variant">
                    {card.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="order-1 space-y-8 lg:order-2 lg:col-span-7">
          <SectionHeading
            title="Graj Solo, Rywalizuj z"
            highlight="Calym Swiatem"
            description="Nasze algorytmy dbaja o to, abys nigdy nie uslyszal tego samego pytania dwa razy. Wyzwania dopasowuja sie do Twojego poziomu, oferujac dynamiczna rozgrywke, ktora trenuje Twoj mozg."
          />

          <article className="group relative overflow-hidden rounded-[2rem] bg-surface-container-highest p-8">
            <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary font-headline text-lg font-black text-on-primary">
                  #1
                </div>
                <div>
                  <div className="font-bold text-on-surface">Aktualny Lider</div>
                  <div className="text-sm text-on-surface-variant">
                    Gracz: Neon_Wiz
                  </div>
                </div>
              </div>

              <div className="text-left md:text-right">
                <div className="text-2xl font-black text-primary">12,450 PKT</div>
                <div className="text-xs font-bold uppercase tracking-[0.24em] text-tertiary">
                  Tryb Legendarny
                </div>
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
          </article>
        </div>
      </div>
    </section>
  );
}
