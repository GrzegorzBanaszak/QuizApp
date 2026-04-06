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

export const FeaturedAchievementCard = ({
  achievement,
}: {
  achievement: AchievementCatalogItem;
}) => {
  const status = getAchievementStatus(achievement);
  const accent = getAchievementAccent(achievement, true);

  return (
    <article className="group relative overflow-hidden rounded-[2.25rem] bg-[linear-gradient(135deg,rgba(29,29,57,0.92)_0%,rgba(17,17,40,0.92)_52%,rgba(12,12,33,0.94)_100%)] p-1 shadow-[0_24px_80px_rgba(5,8,22,0.36)] ring-1 ring-white/8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(143,245,255,0.18),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(224,141,255,0.22),transparent_34%)] opacity-80" />
      <div className="relative flex h-full flex-col gap-6 rounded-[calc(2.25rem-4px)] bg-[#171730]/80 p-6 backdrop-blur-xl md:p-8 lg:flex-row lg:items-stretch">
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <AchievementVisual achievement={achievement} featured />
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <StatusPill status={status} />
                  {achievement.isElite ? (
                    <span className="rounded-full bg-[#8ff5ff]/12 px-3 py-1 text-[10px] font-black uppercase tracking-[0.24em] text-[#8ff5ff] ring-1 ring-[#8ff5ff]/20">
                      Elitarne
                    </span>
                  ) : null}
                </div>
                <h2 className="mt-3 font-headline text-3xl font-black tracking-[-0.04em] text-[#f4d5ff] md:text-4xl">
                  {achievement.name}
                </h2>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-[#aaa8c4] md:text-base">
                  {achievement.description}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-2">
            <InfoPanel label="Warunek" value={achievement.conditionDescription} />
            <InfoPanel
              label="Nagroda"
              value={
                achievement.rewardDescription ||
                "Nagroda zostanie ujawniona po odblokowaniu."
              }
            />
          </div>

          <div className="mt-6">
            <ProgressBlock achievement={achievement} accent={accent} large />
          </div>
        </div>

        <div className="flex w-full flex-col justify-between gap-4 rounded-[1.9rem] bg-black/18 p-5 ring-1 ring-white/8 lg:max-w-sm">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#aaa8c4]">
              Premie
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <RewardChip kind="xp" value={achievement.rewardExperience} />
              <RewardChip kind="coins" value={achievement.rewardCoins} />
              <RewardChip
                kind="avatar"
                value={achievement.rewardAvatarKey}
                imageUrl={achievement.rewardAvatarImageUrl}
              />
            </div>
          </div>

          <div className="rounded-[1.5rem] bg-white/5 p-4">
            <p className="text-[10px] font-black uppercase tracking-[0.26em] text-[#aaa8c4]">
              Status
            </p>
            <p className="mt-2 font-headline text-2xl font-black text-[#f4d5ff]">
              {status.label}
            </p>
            <p className="mt-2 text-sm text-[#aaa8c4]">
              {achievement.awardedAt
                ? `Zdobyte ${formatAchievementAwardedAt(achievement.awardedAt)}.`
                : "Kontynuuj gre, aby domknac wymagany progres i odblokowac nagrode."}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
};
