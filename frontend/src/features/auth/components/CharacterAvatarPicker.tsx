interface CharacterAvatarPickerItem {
  id: string | number;
  name: string;
  image?: string;
  imageUrl?: string;
  unlockType?: string;
  unlockDescription?: string;
  isUnlocked?: boolean;
  isSelected?: boolean;
  canPurchase?: boolean;
}

interface CharacterAvatarPickerProps {
  avatars: CharacterAvatarPickerItem[];
  selectedAvatarId: string | number | null;
  onSelectAvatar: (avatarId: string | number | null) => void;
  onResetToSourceAvatar: () => void;
  showResetToSourceAvatar: boolean;
}

export function formatAvatarUnlockTypeLabel(unlockType?: string | null): string {
  switch (unlockType) {
    case "Default":
      return "Startowy";
    case "Achievement":
      return "Osiągnięcie";
    case "Social":
      return "Społecznościowy";
    case "Current":
      return "Aktualny";
    default:
      return unlockType ?? "Dostępny";
  }
}

export const CharacterAvatarPicker = ({
  avatars,
  selectedAvatarId,
  onSelectAvatar,
  onResetToSourceAvatar,
  showResetToSourceAvatar,
}: CharacterAvatarPickerProps) => {
  return (
    <div className="grid gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <label className="px-1 text-sm font-bold uppercase tracking-[0.25em] text-[#ff68a7]">
          Wybierz awatar
        </label>
        {showResetToSourceAvatar ? (
          <button
            type="button"
            onClick={onResetToSourceAvatar}
            className="w-fit rounded-full border border-white/10 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#aaa8c4] transition-colors hover:bg-white/5 hover:text-[#e5e3ff]"
          >
            Przywróć aktualny awatar
          </button>
        ) : null}
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {avatars.map((avatar) => {
          const isActive = avatar.id === selectedAvatarId;
          const imageSrc = avatar.imageUrl ?? avatar.image ?? "";
          const isLocked = avatar.isUnlocked === false;
          const badgeLabel = isActive
            ? "WYBRANY"
            : avatar.isUnlocked
              ? formatAvatarUnlockTypeLabel(avatar.unlockType).toUpperCase()
              : formatAvatarUnlockTypeLabel(
                  avatar.unlockType ?? "Zablokowany",
                ).toUpperCase();

          return (
            <button
              key={avatar.id}
              type="button"
              onClick={() => onSelectAvatar(avatar.id)}
              className={`group relative aspect-square overflow-hidden rounded-[1.75rem] bg-[#232341] text-left transition-all duration-300 ${
                isActive
                  ? "ring-2 ring-[#e08dff] shadow-[0_0_24px_rgba(224,141,255,0.32)]"
                  : "ring-1 ring-white/10 hover:-translate-y-1 hover:ring-[#e08dff]/50"
              }`}
            >
              <img
                src={imageSrc}
                alt={avatar.name}
                className={`h-full w-full object-cover transition-transform duration-500 group-hover:scale-110 ${
                  isLocked ? "opacity-40 grayscale" : ""
                }`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c21]/85 via-[#0c0c21]/20 to-transparent" />
              {isLocked ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="material-symbols-outlined text-4xl text-[#e5e3ff]/70">
                    lock
                  </span>
                </div>
              ) : null}
              <div className="absolute left-3 top-3">
                <span
                  className={`inline-flex rounded-md px-2 py-1 text-[9px] font-black uppercase tracking-[0.18em] ${
                    isActive
                      ? "bg-[#8ff5ff] text-[#003f43]"
                      : isLocked
                        ? "bg-[#ff68a7]/20 text-[#ffb2c7]"
                        : "bg-[#0c0c21]/80 text-[#8ff5ff]"
                  }`}
                >
                  {badgeLabel}
                </span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <p className="truncate text-[10px] font-black uppercase tracking-[0.2em] text-[#e5e3ff]">
                  {avatar.name}
                </p>
                {avatar.unlockDescription ? (
                  <p className="mt-1 line-clamp-2 text-[11px] leading-snug text-[#aaa8c4]">
                    {avatar.unlockDescription}
                  </p>
                ) : null}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
