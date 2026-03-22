const navLinks = [
  { href: "#solo", label: "Singleplayer" },
  { href: "#multiplayer", label: "Multiplayer" },
  { href: "#party", label: "Party Mode" },
];

export function TopNav() {
  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-primary/10 bg-surface/60 backdrop-blur-xl">
      <div className="section-shell flex items-center justify-between py-4">
        <a
          href="#hero"
          className="font-headline text-2xl font-black italic tracking-[-0.05em] text-primary"
        >
          QuizVolt
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-on-surface-variant hover:scale-105 hover:text-on-surface"
            >
              {link.label}
            </a>
          ))}
        </div>

        <a
          href="http://localhost:5173"
          className="rounded-full bg-gradient-to-r from-primary to-primary-container px-6 py-2 font-semibold text-on-primary shadow-[0_0_24px_rgba(224,141,255,0.25)] hover:scale-105"
        >
          Play Now
        </a>
      </div>
    </nav>
  );
}
