import type { AvatarCatalogItem } from "../types";

interface AvatarCatalogSectionProps {
  title: string;
  count: number;
  avatars: AvatarCatalogItem[];
  emptyLabel: string;
  locked?: boolean;
}

export const AvatarCatalogSection = ({
  title,
  count,
  avatars,
  emptyLabel,
  locked = false,
}: AvatarCatalogSectionProps) => {
  return (
    <section>
      <div className="mb-5 flex items-center gap-4">
        <h3 className="font-headline text-2xl font-bold tracking-tight">
          {title}
        </h3>
        <div className="h-[1px] flex-1 bg-gradient-to-r from-[#46465e] to-transparent" />
        <span className="text-sm font-medium text-[#aaa8c4]">{count}</span>
      </div>

      {avatars.length === 0 ? (
        <div className="glass-panel rounded-[2rem] px-6 py-8 text-sm text-[#aaa8c4]">
          {emptyLabel}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {avatars.map((avatar) => (
            <article
              key={avatar.id}
              className={`group relative overflow-hidden rounded-[1.75rem] bg-[#171730]/90 transition-transform duration-200 hover:-translate-y-1 ${
                avatar.isSelected
                  ? "ring-2 ring-[#8ff5ff] shadow-[0_0_24px_rgba(143,245,255,0.2)]"
                  : "ring-1 ring-white/10"
              }`}
            >
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={avatar.imageUrl}
                  alt={avatar.name}
                  className={`h-full w-full object-cover transition-transform duration-500 group-hover:scale-110 ${
                    locked ? "opacity-40 grayscale" : ""
                  }`}
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c21]/90 via-[#0c0c21]/20 to-transparent" />
                {locked ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="material-symbols-outlined text-4xl text-[#e5e3ff]/75">
                      lock
                    </span>
                  </div>
                ) : null}
                <div className="absolute left-3 top-3">
                  <span
                    className={`inline-flex rounded-md px-2 py-1 text-[9px] font-black uppercase tracking-[0.18em] ${
                      avatar.isSelected
                        ? "bg-[#8ff5ff] text-[#003f43]"
                        : locked
                          ? "bg-[#ff68a7]/20 text-[#ffb2c7]"
                          : "bg-[#0c0c21]/80 text-[#8ff5ff]"
                    }`}
                  >
                    {avatar.isSelected
                      ? "Wybrany"
                      : locked
                        ? "Zablokowany"
                        : "Dostępny"}
                  </span>
                </div>
              </div>

              <div className="p-4">
                <h4 className="font-headline text-lg font-black text-[#f4d5ff]">
                  {avatar.name}
                </h4>
                <p className="mt-2 text-sm text-[#aaa8c4]">
                  {avatar.unlockDescription}
                </p>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};
