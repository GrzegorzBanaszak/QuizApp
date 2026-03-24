const items = [
  { label: "Graj", icon: "sports_esports" },
  { label: "Pokoje", icon: "qr_code_scanner", active: true, filled: true },
  { label: "Sklep", icon: "local_fire_department" },
  { label: "Profil", icon: "person" },
];

export function PartyMobileDock() {
  return (
    <nav className="fixed bottom-0 left-0 z-50 flex w-full items-center justify-around rounded-t-[2rem] border-t border-[#1d1d39] bg-[#0c0c21]/90 px-4 pb-6 pt-2 shadow-[0_-10px_30px_rgba(0,0,0,0.5)] backdrop-blur-2xl md:hidden">
      {items.map((item) => (
        <div
          key={item.label}
          className={
            item.active
              ? "mb-2 flex scale-110 flex-col items-center justify-center rounded-full bg-gradient-to-tr from-primary to-secondary p-3 text-on-primary shadow-[0_0_20px_rgba(224,141,255,0.4)]"
              : "flex flex-col items-center justify-center p-3 text-on-surface-variant"
          }
        >
          <span
            className="material-symbols-outlined"
            style={
              item.filled
                ? {
                    fontVariationSettings:
                      '"FILL" 1, "wght" 400, "GRAD" 0, "opsz" 24',
                  }
                : undefined
            }
          >
            {item.icon}
          </span>
          <span className="font-headline text-[10px] uppercase tracking-widest">
            {item.label}
          </span>
        </div>
      ))}
    </nav>
  );
}
