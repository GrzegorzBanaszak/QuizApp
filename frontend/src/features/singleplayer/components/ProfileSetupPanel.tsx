import type { SingleplayerAvatar } from "../types/singleplayer";

interface ProfileSetupPanelProps {
  draftName: string;
  avatars: SingleplayerAvatar[];
  selectedAvatarId: string;
  onDraftNameChange: (value: string) => void;
  onSelectAvatar: (avatarId: string) => void;
  onSave: () => void;
}

export const ProfileSetupPanel = ({
  draftName,
  avatars,
  selectedAvatarId,
  onDraftNameChange,
  onSelectAvatar,
  onSave,
}: ProfileSetupPanelProps) => {
  return (
    <div className="glass-panel grid grid-cols-1 items-center gap-10 rounded-[2rem] p-8 shadow-[0_0_30px_rgba(224,141,255,0.18)] lg:grid-cols-12">
      <div className="lg:col-span-5">
        <label
          htmlFor="nickname"
          className="mb-3 block px-1 text-sm font-bold uppercase tracking-widest text-[#e08dff]"
        >
          Twój Nick
        </label>
        <div className="group relative">
          <input
            id="nickname"
            type="text"
            value={draftName}
            maxLength={20}
            onChange={(event) => onDraftNameChange(event.target.value)}
            placeholder="Wpisz swoje imię..."
            className="w-full rounded-[2rem] bg-black/30 px-6 py-4 text-xl font-bold text-[#e5e3ff] outline-none ring-1 ring-white/10 transition-all placeholder:text-[#74738d] focus:ring-2 focus:ring-[#e08dff]"
          />
          <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#e08dff] opacity-50">
            <span className="material-symbols-outlined">edit</span>
          </div>
        </div>
      </div>

      <div className="lg:col-span-7">
        <label className="mb-4 block px-1 text-sm font-bold uppercase tracking-widest text-[#ff68a7]">
          Wybierz Awatar
        </label>
        <div className="flex flex-wrap gap-4">
          {avatars.map((avatar) => {
            const isActive = avatar.id === selectedAvatarId;

            return (
              <button
                key={avatar.id}
                type="button"
                onClick={() => onSelectAvatar(avatar.id)}
                className="group relative cursor-pointer"
              >
                <div
                  className={`h-16 w-16 overflow-hidden rounded-full transition-all group-hover:scale-105 ${
                    isActive
                      ? "opacity-100 ring-2 ring-[#e08dff] shadow-[0_0_15px_rgba(224,141,255,0.5)]"
                      : "opacity-45 ring-1 ring-white/15 hover:opacity-100 hover:ring-[#e08dff]"
                  }`}
                >
                  <img
                    src={avatar.image}
                    alt={avatar.name}
                    className="h-full w-full object-cover"
                  />
                </div>
              </button>
            );
          })}
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#232341] text-[#74738d] ring-1 ring-white/10 transition-colors hover:text-[#e08dff]">
            <span className="material-symbols-outlined">add</span>
          </div>
        </div>
      </div>

      <div className="lg:col-span-12">
        <button
          type="button"
          onClick={onSave}
          disabled={!draftName.trim()}
          className="rounded-full bg-gradient-to-r from-[#e08dff] to-[#d978ff] px-8 py-4 font-headline text-sm font-black tracking-[0.2em] text-[#4f006c] shadow-[0_0_30px_rgba(224,141,255,0.35)] transition-all hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50"
        >
          ZAPISZ POSTAĆ
        </button>
      </div>
    </div>
  );
};
