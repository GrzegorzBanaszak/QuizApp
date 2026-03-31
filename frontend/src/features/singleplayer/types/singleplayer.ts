export type SingleplayerScreen =
  | "home"
  | "levelSelect"
  | "gameplay"
  | "result";

export interface SingleplayerAvatar {
  id: string;
  name: string;
  image: string;
  badge: string;
}

export interface SingleplayerProfile {
  name: string;
  avatarId: string;
  level: number;
  xp: string;
}

export interface SingleplayerCategoryLevel {
  id: number;
  order: number;
  isCompleted: boolean;
  difficulty: string;
}

export interface SingleplayerCategory {
  id: number;
  name: string;
  description: string;
  totalLevels: number;
  completedLevelsCount: number;
  levels: SingleplayerCategoryLevel[];
}

export interface SingleplayerLevel {
  id: string;
  letter: string;
  title: string;
  subtitle: string;
  state: "completed" | "available" | "locked";
  accent: "primary" | "secondary" | "neutral";
  lockedMessage?: string;
}

export interface SingleplayerQuestion {
  id: string;
  prompt: string;
  answers: string[];
  correctAnswerIndex: number;
  aiLabel: string;
}

export interface SingleplayerLeaderboardEntry {
  id: string;
  name: string;
  score: string;
  avatar: string;
  title?: string;
  isCurrentPlayer?: boolean;
}

export interface SingleplayerReward {
  id: string;
  title: string;
  subtitle: string;
  icon?: string;
  image?: string;
  accent: "primary" | "secondary";
}
