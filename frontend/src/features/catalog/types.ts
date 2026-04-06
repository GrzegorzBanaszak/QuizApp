export interface AvatarCatalogItem {
  id: number;
  key: string;
  name: string;
  imageUrl: string;
  unlockType: string;
  unlockAchievementCode?: string | null;
  price: number;
  isUnlocked: boolean;
  canPurchase: boolean;
  isSelected: boolean;
  unlockDescription: string;
}

export interface AchievementCatalogItem {
  code: string;
  name: string;
  description: string;
  iconUrl: string;
  isElite: boolean;
  triggerType: string;
  conditionDescription: string;
  currentProgress: number;
  requiredProgress: number;
  progressPercent: number;
  progressLabel: string;
  rewardType: string;
  rewardDescription: string;
  rewardExperience?: number | null;
  rewardCoins?: number | null;
  rewardAvatarKey?: string | null;
  rewardAvatarImageUrl?: string | null;
  isUnlocked: boolean;
  awardedAt?: string | null;
}
