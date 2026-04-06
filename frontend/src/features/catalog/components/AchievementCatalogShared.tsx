import type { AchievementCatalogItem } from "../types";
import type {
  AchievementAccent,
  AchievementStatus,
} from "./achievementCatalogUtils";
import { getFallbackAchievementIcon } from "./achievementCatalogUtils";

export const AchievementVisual = ({
  achievement,
  featured = false,
}: {
  achievement: AchievementCatalogItem;
  featured?: boolean;
}) => {
  const wrapperSize = featured
    ? "h-24 w-24 rounded-[1.8rem]"
    : "h-[4.5rem] w-[4.5rem] rounded-[1.4rem]";

  return (
    <div
      className={`relative flex-shrink-0 overflow-hidden bg-[#111128] shadow-[0_0_32px_rgba(224,141,255,0.12)] ring-1 ring-white/10 ${wrapperSize}`}
    >
      {achievement.iconUrl ? (
        <img
          src={achievement.iconUrl}
          alt={achievement.name}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-[#e08dff]">
          <span
            className={`material-symbols-outlined ${featured ? "text-5xl" : "text-4xl"}`}
          >
            {getFallbackAchievementIcon(achievement)}
          </span>
        </div>
      )}
    </div>
  );
};

export const ProgressBlock = ({
  achievement,
  accent,
  large = false,
}: {
  achievement: AchievementCatalogItem;
  accent: AchievementAccent;
  large?: boolean;
}) => (
  <div className="rounded-[1.5rem] bg-black/16 p-4 ring-1 ring-white/6">
    <div className="flex items-center justify-between gap-3">
      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#aaa8c4]">
        Progress
      </p>
      <span className={`text-xs font-black ${accent.barClassName}`}>
        {achievement.progressLabel}
      </span>
    </div>
    <div
      className={`mt-4 overflow-hidden rounded-full bg-[#090914] ${large ? "h-3" : "h-2.5"}`}
    >
      <div
        className={`h-full rounded-full transition-[width] duration-300 ${accent.barClassName}`}
        style={{
          width:
            achievement.progressPercent > 0
              ? `${Math.max(achievement.progressPercent, 4)}%`
              : "0%",
        }}
      />
    </div>
    <div className="mt-3 flex items-center justify-between gap-3 text-xs text-[#aaa8c4]">
      <span>{achievement.progressPercent}% wykonania</span>
      <span>{achievement.isUnlocked ? "Cel zakonczony" : "Cel aktywny"}</span>
    </div>
  </div>
);

export const StatusPill = ({ status }: { status: AchievementStatus }) => (
  <span
    className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.24em] ${status.className}`}
  >
    {status.label}
  </span>
);

export const InfoPanel = ({
  label,
  value,
}: {
  label: string;
  value: string;
}) => (
  <div className="rounded-[1.4rem] bg-black/16 px-4 py-3 ring-1 ring-white/6">
    <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#aaa8c4]">
      {label}
    </p>
    <p className="mt-2 text-sm leading-6 text-[#e5e3ff]">{value}</p>
  </div>
);

export const RewardChip = ({
  kind,
  value,
  imageUrl,
}: {
  kind: "xp" | "coins" | "avatar";
  value?: number | string | null;
  imageUrl?: string | null;
}) => {
  if (kind !== "avatar" && (!value || Number(value) <= 0)) {
    return null;
  }

  if (kind === "avatar" && !value) {
    return null;
  }

  if (kind === "xp") {
    return (
      <span className="inline-flex items-center gap-2 rounded-full bg-[#8ff5ff]/10 px-3 py-2 text-xs font-bold text-[#8ff5ff] ring-1 ring-[#8ff5ff]/15">
        <span className="material-symbols-outlined text-sm">stars</span>
        +{value} XP
      </span>
    );
  }

  if (kind === "coins") {
    return (
      <span className="inline-flex items-center gap-2 rounded-full bg-[#ffcf7d]/10 px-3 py-2 text-xs font-bold text-[#ffcf7d] ring-1 ring-[#ffcf7d]/15">
        <span className="material-symbols-outlined text-sm">
          monetization_on
        </span>
        +{value} monet
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-[#e08dff]/10 px-3 py-2 text-xs font-bold text-[#f4d5ff] ring-1 ring-[#e08dff]/15">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={String(value)}
          className="h-5 w-5 rounded-full object-cover"
          loading="lazy"
        />
      ) : (
        <span className="material-symbols-outlined text-sm">face</span>
      )}
      Avatar
    </span>
  );
};
