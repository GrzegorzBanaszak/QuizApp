import Link from "next/link";

export type TopNavLink = {
  href: string;
  label: string;
};

const defaultLinks: TopNavLink[] = [
  { href: "/singleplayer", label: "Tryb Jednoosobowy" },
  { href: "/#multiplayer", label: "Multiplayer" },
  { href: "/#party", label: "Tryb Imprezy" },
];

type TopNavProps = {
  links?: TopNavLink[];
  activeHref?: string;
  ctaHref?: string;
  ctaLabel?: string;
};

export function TopNav({
  links = defaultLinks,
  activeHref,
  ctaHref = "http://localhost:5173",
  ctaLabel = "Graj Teraz",
}: TopNavProps) {
  return (
    <nav className="fixed inset-x-0 top-0 z-50 bg-surface/60 shadow-[0_8px_32px_0_rgba(224,141,255,0.08)] backdrop-blur-xl">
      <div className="section-shell flex items-center justify-between py-4">
        <Link
          href="/"
          className="font-headline text-2xl font-black italic tracking-[-0.05em] text-primary"
        >
          QuizVolt
        </Link>

        <div className="hidden items-center gap-8 font-headline tracking-tight md:flex">
          {links.map((link) => {
            const isActive = activeHref === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={[
                  "border-b-2 pb-1 text-sm font-bold",
                  isActive
                    ? "border-primary text-primary"
                    : "border-transparent text-on-surface-variant hover:scale-105 hover:text-secondary",
                ].join(" ")}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <Link
          href={ctaHref}
          className="rounded-full bg-gradient-to-r from-primary to-primary-container px-6 py-2 font-bold text-on-primary shadow-[0_0_24px_rgba(224,141,255,0.25)] active:scale-95"
        >
          {ctaLabel}
        </Link>
      </div>

      <div className="absolute bottom-0 h-px w-full bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
    </nav>
  );
}
