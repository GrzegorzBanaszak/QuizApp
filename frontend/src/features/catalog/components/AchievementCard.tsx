import type { AchievementCatalogItem } from "../types";
import {
  formatAchievementAwardedAt,
  getAchievementAccent,
  getAchievementStatus,
} from "./achievementCatalogUtils";
import {
  AchievementVisual,
  InfoPanel,
  ProgressBlock,
  RewardChip,
  StatusPill,
} from "./AchievementCatalogShared";

export const AchievementCard = ({
  achievement,
}: {
  achievement: AchievementCatalogItem;
}) => {
  const status = getAchievementStatus(achievement);
  const accent = getAchievementAccent(achievement, false);

  return (
    <article
      className={`group relative overflow-hidden rounded-[2rem] p-1 transition-transform duration-300 hover:-translate-y-2 ${accent.shellClassName}`}
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/6 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div
        className={`relative flex h-full flex-col rounded-[calc(2rem-4px)] p-6 backdrop-blur-xl ${accent.bodyClassName}`}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-center gap-4">
            <AchievementVisual achievement={achievement} />
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <StatusPill status={status} />
                {achievement.isElite ? (
                  <span className="rounded-full bg-[#8ff5ff]/12 px-3 py-1 text-[10px] font-black uppercase tracking-[0.22em] text-[#8ff5ff]">
                    Elitarne
                  </span>
                ) : null}
              </div>
              <h3 className="mt-3 font-headline text-2xl font-black tracking-tight text-[#f4d5ff]">
                {achievement.name}
              </h3>
            </div>
          </div>
        </div>

        <p className="mt-5 text-sm leading-7 text-[#aaa8c4]">
          {achievement.description}
        </p>

        <div className="mt-5 grid gap-3">
          <InfoPanel label="Warunek" value={achievement.conditionDescription} />
          <InfoPanel
            label="Nagroda"
            value={
              achievement.rewardDescription ||
              "Nagroda zostanie ujawniona po odblokowaniu."
            }
          />
        </div>

        <div className="mt-5">
          <ProgressBlock achievement={achievement} accent={accent} />
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <RewardChip kind="xp" value={achievement.rewardExperience} />
          <RewardChip kind="coins" value={achievement.rewardCoins} />
          <RewardChip
            kind="avatar"
            value={achievement.rewardAvatarKey}
            imageUrl={achievement.rewardAvatarImageUrl}
          />
        </div>

        <div className="mt-auto pt-5">
          <div className="rounded-[1.4rem] bg-black/18 px-4 py-3 text-sm text-[#aaa8c4] ring-1 ring-white/6">
            {achievement.awardedAt
              ? `Zdobyte ${formatAchievementAwardedAt(achievement.awardedAt)}.`
              : status.key === "in-progress"
                ? "Postep jest juz naliczany przez backend dla tego konta."
                : "Jeszcze nie ruszone. Ten achievement nadal czeka na pierwszy progres."}
          </div>
        </div>
      </div>
    </article>
  );
};
