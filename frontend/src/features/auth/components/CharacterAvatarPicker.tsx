import type { AuthAvatar } from "../data/authMockData";

interface CharacterAvatarPickerProps {
  avatars: AuthAvatar[];
  selectedAvatarId: string | null;
  onSelectAvatar: (avatarId: string | null) => void;
  onResetToSourceAvatar: () => void;
  showResetToSourceAvatar: boolean;
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
            Użyj zdjęcia z social media
          </button>
        ) : null}
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {avatars.map((avatar) => {
          const isActive = avatar.id === selectedAvatarId;

          return (
            <button
              key={avatar.id}
              type="button"
              onClick={() => onSelectAvatar(avatar.id)}
              className={`group relative aspect-square overflow-hidden rounded-[1.5rem] bg-[#232341] transition-all duration-300 ${
                isActive
                  ? "ring-2 ring-[#e08dff] shadow-[0_0_24px_rgba(224,141,255,0.32)]"
                  : "ring-1 ring-white/10 hover:-translate-y-1 hover:ring-[#e08dff]/50"
              }`}
            >
              <img
                src={avatar.image}
                alt={avatar.name}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c21]/70 via-transparent to-transparent" />
              <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between gap-2">
                <span className="max-w-[70%] truncate text-left text-[11px] font-bold uppercase tracking-[0.2em] text-[#e5e3ff]">
                  {avatar.name}
                </span>
                <span className="rounded-md bg-[#0c0c21]/80 px-1.5 py-0.5 text-[9px] font-black uppercase tracking-[0.18em] text-[#8ff5ff]">
                  {avatar.badge}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
