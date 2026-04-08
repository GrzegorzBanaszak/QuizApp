import type { AchievementCatalogItem } from "../types";
import type {
  AchievementAccent,
  AchievementStatus,
} from "./achievementCatalogUtils";
import { getFallbackAchievementIcon } from "./achievementCatalogUtils";

export const AchievementVisual = ({
  achievement,
  status,
  featured = false,
}: {
  achievement: AchievementCatalogItem;
  status: AchievementStatus;
  featured?: boolean;
}) => {
  const wrapperSize = featured
    ? "h-24 w-24 rounded-[1.75rem]"
    : "h-16 w-16 rounded-[1.25rem]";
  const shellClassName =
    status.key === "unlocked"
      ? "bg-[#d978ff]/20 text-[#e08dff] shadow-[0_0_20px_rgba(224,141,255,0.26)]"
      : status.key === "in-progress"
        ? "bg-[#8ff5ff]/14 text-[#8ff5ff] shadow-[0_0_20px_rgba(143,245,255,0.18)]"
        : "bg-white/6 text-[#74738d] ring-1 ring-white/10";
  const fallbackIcon = getFallbackAchievementIcon(achievement);

  return (
    <div
      className={`relative flex flex-shrink-0 items-center justify-center overflow-hidden ${shellClassName} ${wrapperSize}`}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.18),transparent_58%)] opacity-80" />
      <span
        className={`material-symbols-outlined relative ${
          featured ? "text-5xl" : "text-3xl"
        }`}
        style={
          status.key === "unlocked"
            ? { fontVariationSettings: "'FILL' 1" }
            : undefined
        }
      >
        {fallbackIcon}
      </span>
    </div>
  );
};

export const ProgressBlock = ({
  achievement,
  accent,
  status,
  large = false,
}: {
  achievement: AchievementCatalogItem;
  accent: AchievementAccent;
  status: AchievementStatus;
  large?: boolean;
}) => (
  <div>
    <div className="flex items-center justify-between gap-3">
      <p
        className={`font-black uppercase text-[#aaa8c4] ${
          large
            ? "text-[11px] tracking-[0.28em]"
            : "text-[10px] tracking-[0.24em]"
        }`}
      >
        Postęp
      </p>
      <span className={`text-xs font-black italic ${accent.labelClassName}`}>
        {achievement.progressLabel}
      </span>
    </div>
    <div
      className={`mt-4 overflow-hidden rounded-full bg-[#000000] ${large ? "h-3" : "h-2"}`}
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
      <span className={status.key === "locked" ? "text-[#74738d]" : undefined}>
        {status.key === "unlocked"
          ? "Cel ukończony"
          : status.key === "in-progress"
            ? "W toku"
            : "Zablokowane"}
      </span>
    </div>
  </div>
);

export const AchievementMiniLabel = ({
  label,
  value,
}: {
  label: string;
  value: string;
}) => (
  <div>
    <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#aaa8c4]">
      {label}
    </p>
    <p className="mt-2 text-sm leading-6 text-[#e5e3ff]">{value}</p>
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
  <div className="rounded-[1.4rem] bg-black/14 px-4 py-3 ring-1 ring-white/6">
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
      <span className="inline-flex items-center gap-2 rounded-full bg-[#29294a] px-4 py-2 text-xs font-bold text-[#e5e3ff] ring-1 ring-white/10">
        <span className="material-symbols-outlined text-sm">stars</span>+{value}{" "}
        XP
      </span>
    );
  }

  if (kind === "coins") {
    return (
      <span className="inline-flex items-center gap-2 rounded-full bg-[#29294a] px-4 py-2 text-xs font-bold text-[#e5e3ff] ring-1 ring-white/10">
        <span className="material-symbols-outlined text-sm">
          monetization_on
        </span>
        +{value} monet
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-[#29294a] px-4 py-2 text-xs font-bold text-[#f4d5ff] ring-1 ring-white/10">
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
