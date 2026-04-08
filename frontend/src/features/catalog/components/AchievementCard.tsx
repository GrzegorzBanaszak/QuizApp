import type { AchievementCatalogItem } from "../types";
import {
  formatAchievementAwardedAt,
  getAchievementAccent,
  getAchievementStatus,
} from "./achievementCatalogUtils";
import {
  AchievementVisual,
  ProgressBlock,
  StatusPill,
} from "./AchievementCatalogShared";

export const AchievementCard = ({
  achievement,
}: {
  achievement: AchievementCatalogItem;
}) => {
  const status = getAchievementStatus(achievement);
  const accent = getAchievementAccent(achievement, false);
  const wrapperClassName =
    achievement.isElite
      ? "bg-[linear-gradient(135deg,rgba(255,207,125,0.95)_0%,rgba(143,245,255,0.7)_52%,rgba(224,141,255,0.9)_100%)] shadow-[0_24px_72px_rgba(5,8,22,0.28)]"
      : status.key === "unlocked"
      ? "bg-[linear-gradient(135deg,rgba(224,141,255,0.18)_0%,rgba(255,104,167,0.16)_100%)]"
      : status.key === "in-progress"
        ? "bg-[#171730]"
        : "bg-[#111128] opacity-75";
  const hiddenDescription =
    status.key === "locked"
      ? "Ukryte osiagniecie. Kontynuuj gre, aby dowiedziec sie wiecej."
      : achievement.description;
  const rewardSummary = achievement.rewardAvatarKey
    ? "Avatar"
    : achievement.rewardExperience
      ? `+${achievement.rewardExperience} XP`
      : achievement.rewardCoins
        ? `+${achievement.rewardCoins} monet`
        : "Nagroda po odblokowaniu";
  const footerLabel = achievement.isUnlocked && achievement.awardedAt
    ? formatAchievementAwardedAt(achievement.awardedAt)
    : status.key === "in-progress"
      ? "Aktywny progres"
      : "Jeszcze zablokowane";

  return (
    <article
      className={`group relative overflow-hidden rounded-[2rem] p-1 transition-transform duration-300 hover:-translate-y-2 ${wrapperClassName}`}
    >
      <div
        className={`relative flex h-full flex-col rounded-[calc(2rem-4px)] p-8 ${
          status.key === "locked"
            ? "bg-[#111128] grayscale"
            : achievement.isElite
              ? "bg-[linear-gradient(180deg,rgba(23,23,48,0.98)_0%,rgba(19,19,42,0.94)_100%)]"
              : "bg-[#171730]"
        }`}
      >
        <div
          className={`pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${
            achievement.isElite
              ? "bg-[radial-gradient(circle_at_top_right,rgba(255,207,125,0.18),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(143,245,255,0.16),transparent_38%)]"
              : status.key === "unlocked"
              ? "bg-gradient-to-br from-[#e08dff]/20 via-transparent to-[#ff68a7]/20"
              : status.key === "in-progress"
                ? "bg-gradient-to-br from-[#8ff5ff]/8 via-transparent to-[#ff68a7]/10"
                : "bg-transparent"
          }`}
        />

        <div className="relative flex items-start justify-between gap-4">
          <AchievementVisual achievement={achievement} status={status} />

          <div className="flex min-w-0 flex-1 flex-wrap items-center justify-end gap-2">
            <StatusPill status={status} />
            {achievement.isElite ? (
              <span className="rounded-full border border-[#8ff5ff]/30 bg-[#8ff5ff]/10 px-4 py-1 text-[10px] font-black uppercase tracking-[0.22em] text-[#8ff5ff]">
                Elitarne
              </span>
            ) : null}
          </div>
        </div>

        <h3
          className={`relative mt-6 font-headline text-2xl font-bold ${
            status.key === "locked" ? "text-[#74738d]" : "text-[#f4d5ff]"
          }`}
        >
          {achievement.name}
        </h3>

        <p
          className={`relative mt-2 text-sm leading-relaxed ${
            status.key === "locked" ? "italic text-[#8d8aa8]" : "text-[#d5d2ef]"
          }`}
        >
          {hiddenDescription}
        </p>

        <div className="relative mt-auto pt-8">
          <ProgressBlock
            achievement={achievement}
            accent={accent}
            status={status}
          />
          <div className="mt-4 flex items-center justify-between gap-3 border-t border-white/10 pt-4">
            <div className="flex min-w-0 items-center gap-2">
              <span
                className={`material-symbols-outlined text-sm ${
                  status.key === "locked" ? "text-[#74738d]" : "text-[#8ff5ff]"
                }`}
              >
                {achievement.rewardAvatarKey ? "inventory_2" : "stars"}
              </span>
              <span
                className={`truncate text-xs font-bold ${
                  status.key === "locked" ? "text-[#74738d]" : "text-[#e5e3ff]"
                }`}
              >
                {status.key === "locked" ? "??? / ukryta nagroda" : rewardSummary}
              </span>
            </div>
            <span className="text-[10px] font-medium italic text-[#aaa8c4]">
              {footerLabel}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
};
