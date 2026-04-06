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
  triggerType: string;
  conditionDescription: string;
  rewardType: string;
  rewardDescription: string;
  rewardCoins?: number | null;
  rewardAvatarKey?: string | null;
  rewardAvatarImageUrl?: string | null;
  isUnlocked: boolean;
  awardedAt?: string | null;
}
