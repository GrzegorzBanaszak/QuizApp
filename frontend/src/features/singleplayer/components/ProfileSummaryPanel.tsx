import type {
  SingleplayerAvatar,
  SingleplayerProfile,
} from "../types/singleplayer";

interface ProfileSummaryPanelProps {
  avatar: SingleplayerAvatar;
  profile: SingleplayerProfile;
  onEdit: () => void;
}

export const ProfileSummaryPanel = ({
  avatar,
  profile,
  onEdit,
}: ProfileSummaryPanelProps) => {
  return (
    <div className="glass-panel rounded-[2rem] p-12 shadow-[0_0_30px_rgba(224,141,255,0.18)]">
      <div className="flex flex-col items-center justify-center">
        <div className="relative mb-6">
          <div className="h-40 w-40 overflow-hidden rounded-full ring-4 ring-[#e08dff] shadow-[0_0_30px_rgba(138,43,226,0.8)]">
            <img
              src={avatar.image}
              alt={avatar.name}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="absolute bottom-0 right-4 rounded-full bg-[#ff68a7] px-3 py-1 text-xs font-black tracking-tight text-[#460024] shadow-lg">
            {avatar.badge}
          </div>
        </div>

        <div className="text-center">
          <h2 className="font-headline mb-2 text-5xl font-black tracking-[-0.04em] text-[#e5e3ff]">
            {profile.name}
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <span className="inline-flex items-center rounded-full bg-[#e08dff]/20 px-4 py-1.5 text-sm font-bold uppercase tracking-widest text-[#e08dff] ring-1 ring-[#e08dff]/40">
              Level {profile.level}
            </span>
            <div className="flex items-center gap-1 text-[#8ff5ff]">
              <span className="material-symbols-outlined text-sm">bolt</span>
              <span className="text-xs font-black uppercase tracking-widest">
                {profile.xp}
              </span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onEdit}
          className="mt-8 rounded-full bg-white/6 px-6 py-3 text-sm font-bold uppercase tracking-[0.2em] text-[#e5e3ff] ring-1 ring-white/10 transition-all hover:bg-white/10"
        >
          Zmień postać
        </button>
      </div>
    </div>
  );
};
