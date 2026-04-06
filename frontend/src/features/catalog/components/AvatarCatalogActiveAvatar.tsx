import type { AvatarCatalogItem } from "../types";

interface AvatarCatalogActiveAvatarProps {
  avatar: AvatarCatalogItem;
}

export const AvatarCatalogActiveAvatar = ({
  avatar,
}: AvatarCatalogActiveAvatarProps) => {
  return (
    <section className="group relative overflow-hidden rounded-[2rem]">
      <div className="absolute inset-0 bg-gradient-to-br from-[#e08dff]/15 via-[#171730] to-[#ff68a7]/15 blur-0" />
      <div className="glass-panel relative flex flex-col gap-6 p-6 md:flex-row md:items-center md:gap-8 md:p-8">
        <div className="relative shrink-0">
          <div className="h-40 w-40 overflow-hidden rounded-[1.5rem] bg-[#232341] ring-2 ring-[#e08dff] shadow-[0_0_30px_rgba(224,141,255,0.32)] md:h-52 md:w-52">
            <img
              src={avatar.imageUrl}
              alt={avatar.name}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="absolute -bottom-3 -right-3 rounded-full bg-[#8ff5ff] px-4 py-2 text-[10px] font-black tracking-[0.22em] text-[#003f43]">
            WYBRANY
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-[#8ff5ff]">
            Aktywny avatar
          </p>
          <h2 className="mt-2 font-headline text-3xl font-black tracking-tight text-[#f4d5ff] md:text-4xl">
            {avatar.name}
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[#aaa8c4] md:text-base">
            {avatar.unlockDescription}
          </p>
        </div>
      </div>
    </section>
  );
};
