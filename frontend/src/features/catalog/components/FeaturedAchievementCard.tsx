import type { AchievementCatalogItem } from "../types";
import {
  formatAchievementAwardedAt,
  getAchievementAccent,
  getAchievementStatus,
} from "./achievementCatalogUtils";
import {
  AchievementMiniLabel,
  AchievementVisual,
  ProgressBlock,
  RewardChip,
  StatusPill,
} from "./AchievementCatalogShared";

export const FeaturedAchievementCard = ({
  achievement,
}: {
  achievement: AchievementCatalogItem;
}) => {
  const status = getAchievementStatus(achievement);
  const accent = getAchievementAccent(achievement, true);
  const wrapperClassName =
    status.key === "unlocked"
      ? "bg-[linear-gradient(135deg,rgba(224,141,255,0.26)_0%,rgba(255,104,167,0.18)_100%)]"
      : status.key === "in-progress"
        ? "bg-[linear-gradient(135deg,rgba(143,245,255,0.14)_0%,rgba(224,141,255,0.14)_100%)]"
        : "bg-[linear-gradient(135deg,rgba(70,70,94,0.22)_0%,rgba(12,12,33,0.28)_100%)]";
  const hiddenDescription =
    status.key === "locked"
      ? "Ukryte osiagniecie. Kontynuuj gre, aby dowiedziec sie wiecej."
      : achievement.description;

  return (
    <article
      className={`group relative overflow-hidden rounded-[2.25rem] p-1 shadow-[0_24px_80px_rgba(5,8,22,0.36)] ring-1 ring-white/8 ${wrapperClassName}`}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(143,245,255,0.18),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(224,141,255,0.22),transparent_34%)] opacity-80" />
      <div className="absolute inset-0 opacity-10">
        <div className="h-full w-full bg-[linear-gradient(120deg,transparent_0%,rgba(255,255,255,0.08)_45%,transparent_100%)]" />
      </div>
      <div className="relative flex h-full flex-col gap-8 rounded-[calc(2.25rem-4px)] bg-[#1d1d39]/55 p-8 backdrop-blur-md md:p-10 lg:flex-row">
        <div className="flex min-w-0 flex-1 flex-col">
          <div>
            <div className="flex flex-wrap items-start justify-between gap-6">
              <div className="flex items-start gap-6">
                <div className="shrink-0">
                  <AchievementVisual
                    achievement={achievement}
                    status={status}
                    featured
                  />
                </div>

                <div className="min-w-0">
                  <h2 className="font-headline text-3xl font-black uppercase tracking-[-0.05em] text-[#f4d5ff] md:text-5xl">
                    {achievement.name}
                  </h2>
                  <p
                    className={`mt-4 max-w-3xl text-base leading-8 md:text-lg ${
                      status.key === "locked"
                        ? "italic text-[#8d8aa8]"
                        : "text-[#d5d2ef]"
                    }`}
                  >
                    {hiddenDescription}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <StatusPill status={status} />
                {achievement.isElite ? (
                  <span className="rounded-full border border-[#8ff5ff]/40 bg-[#8ff5ff]/10 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.24em] text-[#8ff5ff]">
                    Elitarne
                  </span>
                ) : null}
              </div>
            </div>

            <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
              <div>
                <AchievementMiniLabel
                  label="Wyzwanie"
                  value={achievement.conditionDescription}
                />

                <div className="mt-8">
                  <ProgressBlock
                    achievement={achievement}
                    accent={accent}
                    status={status}
                    large
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-3 lg:justify-end">
                <RewardChip kind="xp" value={achievement.rewardExperience} />
                <RewardChip kind="coins" value={achievement.rewardCoins} />
                <RewardChip
                  kind="avatar"
                  value={achievement.rewardAvatarKey}
                  imageUrl={achievement.rewardAvatarImageUrl}
                />
              </div>
            </div>
          </div>

          <div className="mt-8 flex items-center justify-between gap-4 pt-5 text-sm text-[#aaa8c4]">
            <span>
              {achievement.isUnlocked && achievement.awardedAt
                ? `Zdobyte ${formatAchievementAwardedAt(achievement.awardedAt)}.`
                : status.key === "in-progress"
                  ? "Postep jest juz naliczany przez backend."
                  : "Jeszcze zablokowane"}
            </span>
            <span className="text-xs font-black uppercase tracking-[0.24em] text-[#8ff5ff]">
              {achievement.progressLabel}
            </span>
          </div>
        </div>

        <div className="rounded-[2rem] bg-[#232341]/80 p-5 lg:w-[18rem]">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#aaa8c4]">
            Status
          </p>
          <p className="mt-3 font-headline text-3xl font-black text-[#f4d5ff]">
            {status.label}
          </p>
          <p className="mt-3 text-sm leading-7 text-[#aaa8c4]">
            {achievement.rewardDescription ||
              "Nagroda zostanie ujawniona po odblokowaniu."}
          </p>
          <div className="mt-6 rounded-[1.5rem] bg-white/5 px-4 py-3">
            <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#aaa8c4]">
              Typ nagrody
            </p>
            <p className="mt-2 text-sm font-bold text-[#f4d5ff]">
              {achievement.rewardType === "Avatar" ? "Avatar" : "XP / Monety"}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
};
