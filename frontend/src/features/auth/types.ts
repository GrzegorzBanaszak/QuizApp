export interface PlayerProgressDto {
  level: number;
  totalExperience: number;
  experienceForCurrentLevel: number;
  experienceForNextLevel: number;
  currentLevelExperience: number;
  experienceToNextLevel: number;
}

export interface UserProfileDto {
  id: string;
  username: string;
  avatarUrl: string;
  authProvider?: "Guest" | "Google" | "Facebook";
  totalExperience: number;
  coins: number;
  progress?: PlayerProgressDto;
}

export interface SocialProfileResponse {
  isNewUser: boolean;
  googleId?: string | null;
  facebookId?: string | null;
  providerToken?: string | null;
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

export interface GoogleLoginRequest {
  code?: string | null;
  redirectUri?: string | null;
  token?: string | null;
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
