import type { AchievementCatalogItem } from "../types";

const achievementDateFormatter = new Intl.DateTimeFormat("pl-PL", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

export interface AchievementCatalogStats {
  total: number;
  unlocked: number;
  inProgress: number;
  elite: number;
  rewardAvatars: number;
  achievementExperience: number;
}

export interface AchievementStatus {
  key: "unlocked" | "in-progress" | "locked";
  label: string;
  className: string;
}

export interface AchievementAccent {
  shellClassName: string;
  bodyClassName: string;
  barClassName: string;
  labelClassName: string;
}

export function getAchievementCatalogStats(
  achievements: AchievementCatalogItem[],
): AchievementCatalogStats {
  const total = achievements.length;
  const unlocked = achievements.filter((item) => item.isUnlocked).length;
  const inProgress = achievements.filter(
    (item) => !item.isUnlocked && item.currentProgress > 0,
  ).length;
  const elite = achievements.filter((item) => item.isElite).length;
  const rewardAvatars = achievements.filter(
    (item) => item.rewardType === "Avatar",
  ).length;
  const achievementExperience = achievements
    .filter((item) => item.isUnlocked)
    .reduce((sum, item) => sum + (item.rewardExperience ?? 0), 0);

  return {
    total,
    unlocked,
    inProgress,
    elite,
    rewardAvatars,
    achievementExperience,
  };
}

export function getAchievementStatus(
  achievement: AchievementCatalogItem,
): AchievementStatus {
  if (achievement.isUnlocked) {
    return {
      key: "unlocked",
      label: "Zdobyte",
      className: "bg-[#e08dff]/15 text-[#f4d5ff] ring-1 ring-[#e08dff]/25",
    };
  }

  if (achievement.currentProgress > 0) {
    return {
      key: "in-progress",
      label: "W toku",
      className: "bg-[#8ff5ff]/12 text-[#8ff5ff] ring-1 ring-[#8ff5ff]/20",
    };
  }

  return {
    key: "locked",
    label: "Zablokowane",
    className: "bg-white/6 text-[#aaa8c4] ring-1 ring-white/10",
  };
}

export function getAchievementAccent(
  achievement: AchievementCatalogItem,
  featured: boolean,
): AchievementAccent {
  if (achievement.isUnlocked) {
    return {
      shellClassName:
        "bg-[linear-gradient(145deg,rgba(224,141,255,0.22)_0%,rgba(255,104,167,0.16)_100%)] ring-1 ring-[#e08dff]/12",
      bodyClassName: featured ? "" : "bg-[#171730]/82",
      barClassName:
        "bg-gradient-to-r from-[#e08dff] via-[#f1a3ff] to-[#ff68a7]",
      labelClassName: "text-[#f4d5ff]",
    };
  }

  if (achievement.currentProgress > 0) {
    return {
      shellClassName:
        "bg-[linear-gradient(145deg,rgba(143,245,255,0.15)_0%,rgba(224,141,255,0.08)_100%)] ring-1 ring-[#8ff5ff]/10",
      bodyClassName: featured ? "" : "bg-[#171730]/78",
      barClassName: "bg-gradient-to-r from-[#8ff5ff] to-[#00deec]",
      labelClassName: "text-[#8ff5ff]",
    };
  }

  return {
    shellClassName: "bg-white/[0.04] ring-1 ring-white/8",
    bodyClassName: featured ? "" : "bg-[#14142c]/78 saturate-50",
    barClassName: "bg-[#46465e]",
    labelClassName: "text-[#aaa8c4]",
  };
}

export function getAchievementPriority(achievement: AchievementCatalogItem) {
  return (
    (achievement.isElite ? 1000 : 0) +
    (achievement.isUnlocked ? 500 : 0) +
    achievement.progressPercent +
    (achievement.rewardExperience ?? 0) +
    (achievement.rewardCoins ?? 0)
  );
}

export function getFallbackAchievementIcon(
  achievement: AchievementCatalogItem,
) {
  if (achievement.isElite) {
    return "workspace_premium";
  }

  if (achievement.rewardType === "Avatar") {
    return "face";
  }

  if (achievement.triggerType === "CategoryCompletion") {
    return "grid_view";
  }

  if (achievement.triggerType === "CompletedCategoriesCount") {
    return "stacked_bar_chart";
  }

  return "emoji_events";
}

export function formatAchievementAwardedAt(value: string) {
  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return value;
  }

  return achievementDateFormatter.format(parsedDate);
}

export function formatAchievementNumber(value: number) {
  return new Intl.NumberFormat("pl-PL").format(value);
}
