import { useEffect, useState } from "react";
import { Link } from "react-router";
import { fetchPublicAvatarPreview } from "../../catalog/services/catalogApi";
import type { AvatarCatalogItem } from "../../catalog/types";

interface PublicAvatarPreviewProps {
  showCatalogCta?: boolean;
}

export const PublicAvatarPreview = ({
  showCatalogCta = false,
}: PublicAvatarPreviewProps) => {
  const [avatars, setAvatars] = useState<AvatarCatalogItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;

    void fetchPublicAvatarPreview()
      .then((items) => {
        if (!isCancelled) {
          setAvatars(items);
        }
      })
      .catch((err) => {
        if (!isCancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Nie udało się pobrać domyślnych awatarów.",
          );
        }
      })
      .finally(() => {
        if (!isCancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, []);

  return (
    <section className="mb-10 w-full">
      <div className="glass-panel rounded-[2rem] p-6 md:p-8">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.28em] text-[#8ff5ff]">
              Podgląd publiczny
            </p>
            <h2 className="mt-2 font-headline text-2xl font-black tracking-tight text-[#f4d5ff] md:text-3xl">
              Domyślne awatary do tworzenia postaci
            </h2>
            <p className="mt-2 max-w-3xl text-sm text-[#aaa8c4] md:text-base">
              Publicznie pokazujemy tylko awatary startowe. Pełny katalog jest
              dostępny po zalogowaniu.
            </p>
          </div>

          {showCatalogCta ? (
            <Link
              to="/avatars"
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#e08dff] to-[#d978ff] px-5 py-3 text-sm font-black tracking-[0.18em] text-[#4f006c] transition-transform hover:scale-105 active:scale-95"
            >
              PELNY KATALOG
            </Link>
          ) : null}
        </div>

        {error ? (
          <div className="rounded-[1.25rem] border border-[#ff68a7]/30 bg-[#ff68a7]/10 px-4 py-3 text-sm text-[#ffd1e0]">
            {error}
          </div>
        ) : null}

        {isLoading ? (
          <div className="rounded-[1.5rem] bg-black/15 px-6 py-8 text-center text-sm text-[#aaa8c4]">
            Ładowanie awatarów...
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 xl:grid-cols-8">
            {avatars.map((avatar) => (
              <article
                key={avatar.id}
                className="group rounded-[1.5rem] border border-white/10 bg-[#171730] p-4 text-center transition-transform duration-200 hover:-translate-y-1"
              >
                <div className="mx-auto mb-3 h-16 w-16 overflow-hidden rounded-full ring-2 ring-[#e08dff]/40 md:h-20 md:w-20">
                  <img
                    src={avatar.imageUrl}
                    alt={avatar.name}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="text-[10px] font-black uppercase tracking-[0.22em] text-[#8ff5ff]">
                  Startowy
                </div>
                <h3 className="mt-2 font-headline text-base font-bold text-[#e5e3ff]">
                  {avatar.name}
                </h3>
                <p className="mt-1 text-xs text-[#aaa8c4]">
                  {avatar.unlockDescription}
                </p>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
