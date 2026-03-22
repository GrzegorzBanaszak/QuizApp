import { Icon } from "@/app/components/landing/ui-icon";

const avatars = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDHngyJjojxNPRnhUkovepJUq91opHHqRf5VWEdwMOVb12sToVvOMy4sk9adyMuiASb0Qch0xXMt5AEG9b4ytgxiQFKzWYHUo3PdX41aIioVf683uGcJb7wsN3TlPyt4wdQaJgw9-G5ESZoPT-Tsan3hSHlp9EcYgEXph9L90y6PcM4OoPiGatncifDC7VKLK1t7BWrcMjXk1UKMaNXCrxuHXLzEeV0Xo1tSNPtN7WFZ-nydl2M9NWdI4a_lG1vfsoZwQxmya8P_th3",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCQGvTNKHL4S9033yiH-yooghGRz0RqunRV1McBpkazn5LrZxq31POqANUH5M_qFABwgiuDZBj9uxqLPwuOV6qcBXBECKKg_frMJ55RHQAAeKYhFCV5lCWPN8e1_-NwV6SyL--BXY5sAjgV2GyuobJ-sd_irp2b97oD_HY3gWYORhqUwX4UwAxbSNwRhQHpUrKxfLPRRr2NhBjsc4Sx1uLSEmYbGKQv-PVDgjTaaTQbW8DpddR_e4gSzjir04NDBE75EEc_xXK6h52W",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCuLjYdCmsfDqKyeG9O2cMh-TbRFIV_byFxpPnH8R3bdAFA7qOJw6pojRUWAxLwF9XUGNu1tVCIm7Zh88DPU_r-v1po5ZqfvwtdKunN9y9Hty2-kCy7ru2EILO3_DnpKf6wuNwWOu7QZBqwv3UkQQRZqfQR4cm-Pvo4xQfaeUfe5p5rNrugDcMMrHqpIkx2cwboeZZ_illtScfPziLFRdunuAJdZTodWOr6AnZNYjfB9W6THL7VaRTOOKBKesXdBYRh177J33cSGtWk",
];

export function HeroSection() {
  return (
    <section
      id="hero"
      className="relative flex min-h-screen items-center overflow-hidden px-6 pb-20 pt-36"
    >
      <div className="absolute left-[-10%] top-[-10%] h-[28rem] w-[28rem] rounded-full bg-primary/10 blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] h-[24rem] w-[24rem] rounded-full bg-secondary/10 blur-[120px]" />

      <div className="section-shell relative z-10 grid items-center gap-12 lg:grid-cols-2">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-surface-container-high px-4 py-2">
            <Icon name="bolt" className="h-4 w-4 text-tertiary" />
            <span className="text-xs font-bold uppercase tracking-[0.24em] text-tertiary">
              Nowa era quizow
            </span>
          </div>

          <div className="space-y-6">
            <h1 className="font-headline text-5xl font-black leading-[1.05] tracking-[-0.04em] md:text-7xl">
              QuizVolt - <span className="text-gradient">Najlepsza gra quizowa</span>{" "}
              nowej generacji!
            </h1>
            <p className="max-w-xl text-lg leading-relaxed text-on-surface-variant md:text-xl">
              Poczuj elektryzujace emocje w najbardziej dynamicznym quizie
              spolecznosciowym. Rywalizuj, tworz i wygrywaj w swiecie neonowej
              wiedzy.
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <a
              href="http://localhost:5173"
              className="rounded-full bg-gradient-to-r from-primary to-primary-container px-10 py-4 text-lg font-black text-on-primary shadow-[0_0_30px_rgba(224,141,255,0.35)] hover:scale-105"
            >
              Zacznij grac
            </a>
            <a
              href="#how-it-works"
              className="rounded-full border border-primary/20 bg-surface-bright px-10 py-4 text-lg font-bold text-on-surface hover:bg-surface-variant"
            >
              Dowiedz sie wiecej
            </a>
          </div>

          <div className="flex items-center gap-6 pt-4">
            <div className="flex -space-x-3">
              {avatars.map((avatar, index) => (
                <img
                  key={avatar}
                  alt={`Gracz ${index + 1}`}
                  className="h-10 w-10 rounded-full border-2 border-surface object-cover"
                  src={avatar}
                />
              ))}
            </div>
            <p className="text-sm font-medium text-on-surface-variant">
              Dolacz do <span className="font-bold text-tertiary">+50,000</span>{" "}
              graczy online
            </p>
          </div>
        </div>

        <div className="group relative">
          <div className="absolute -inset-1 rounded-[2rem] bg-gradient-to-r from-primary to-secondary opacity-25 blur group-hover:opacity-50" />
          <div className="ambient-glow relative aspect-video overflow-hidden rounded-[2rem] bg-surface-container">
            <img
              alt="QuizVolt Gameplay"
              className="h-full w-full object-cover opacity-80"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuB7BBZYI5MtO9EZRa4IGVzKWumPZk62EVLrMxTTKQ_YSkMYR1bFHnSIqzNSVsmX7-U9wLQ4dos-oSwXlUsV8S1jUU9cy-044fUE0NfZ3pYVS_Jc6VkjPtA4ALDi0Zrt9gLxyIhunkCf2GRgBWcMJqAcy6EugiB-JfWjYuQTgdALno30iUEuT3tkEzHjRwyE8PFPaxzD83pFzXR61GPSUba9D9RtKhhwnp8qAwkDF8YAtQMJNQoP8v8ezEyiqPmlb1tZmxOl1RyZhtRW"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 backdrop-blur-md">
                <Icon name="play" className="h-6 w-6 text-primary" filled />
              </div>
              <span className="font-headline text-lg font-bold tracking-tight text-on-surface">
                Zobacz trailer QuizVolt
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
