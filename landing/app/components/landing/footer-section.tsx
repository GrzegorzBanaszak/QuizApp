const footerLinks = ["Discord", "Twitter", "Contact Us", "Privacy Policy"];

export function FooterSection() {
  return (
    <footer className="bg-surface-container-lowest px-6 pb-10 pt-20 text-sm">
      <div className="section-shell border-t border-primary/5 pt-10">
        <div className="flex flex-col items-center justify-between gap-10 md:flex-row">
          <div className="flex flex-col items-center gap-4 md:items-start">
            <div className="font-headline text-lg font-bold text-primary">
              QuizVolt
            </div>
            <p className="text-center text-tertiary md:text-left">
              © 2024 QuizVolt. The Electric Social Experience.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-8">
            {footerLinks.map((label) => (
              <a
                key={label}
                href="#"
                className="text-on-surface-variant hover:text-tertiary"
              >
                {label}
              </a>
            ))}
          </div>
        </div>

        <div className="mt-10 text-center md:text-left">
          <div className="inline-flex flex-wrap gap-4">
            <span className="rounded-[1.5rem] border border-outline-variant/20 bg-surface-container px-3 py-1 text-[10px] uppercase tracking-[0.24em] text-on-surface-variant">
              v2.0.4-NEON
            </span>
            <span className="rounded-[1.5rem] border border-outline-variant/20 bg-surface-container px-3 py-1 text-[10px] uppercase tracking-[0.24em] text-on-surface-variant">
              EU Server Status: Online
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
