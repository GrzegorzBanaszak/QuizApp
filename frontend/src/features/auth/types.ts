export interface UserProfileDto {
  id: string;
  username: string;
  avatarUrl: string;
  totalExperience: number;
  coins: number;
}

export interface SocialProfileResponse {
  isNewUser: boolean;
  googleId?: string | null;
  facebookId?: string | null;
  name: string;
  firstName?: string | null;
  lastName?: string | null;
  avatarUrl: string;
}

export interface AuthResponse {
  isNewUser: boolean;
  userId: string;
  profile: UserProfileDto;
}

export type GoogleVerifyResponse = AuthResponse | SocialProfileResponse;

export interface RegisterSocialRequest {
  provider: "Google" | "Facebook";
  providerToken: string;
  customUsername?: string | null;
  selectedAvatarId?: number | null;
}

export interface AuthAvatarOption {
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

export interface UpdateUserProfileRequest {
  username: string;
  avatarUrl: string;
}

export interface GoogleTokenRequest {
  token: string;
}

export interface AuthSession {
  profile: UserProfileDto;
}

export type SocialProvider = "Google" | "Facebook";

export interface PendingSocialLogin {
  provider: SocialProvider;
  profile: SocialProfileResponse;
  providerToken: string;
}
