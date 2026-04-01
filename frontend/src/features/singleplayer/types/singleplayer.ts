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

export interface SingleplayerLevelDistribution {
  difficulty: string;
  count: number;
}

export interface SingleplayerGameAnswer {
  id: string;
  text: string;
}

export interface SingleplayerGameQuestion {
  id: number;
  text: string;
  answers: SingleplayerGameAnswer[];
}

export interface SingleplayerGameSession {
  sessionId: string;
  levelId: number;
  questions: SingleplayerGameQuestion[];
}

export interface SingleplayerAnswerSelection {
  questionId: number;
  selectedAnswerId: string;
}

export interface SingleplayerQuestionResultDetail {
  questionId: number;
  isCorrect: boolean;
  correctAnswerId: string;
}

export interface SingleplayerResultSummary {
  totalScore: number;
  correctAnswersCount: number;
  totalQuestions: number;
  details: SingleplayerQuestionResultDetail[];
}

export interface SingleplayerCategoryLevelDetails {
  id: number;
  categoryId: number;
  name: string;
  questionDistributions: SingleplayerLevelDistribution[];
  totalQuestionCount: number;
  isUnlocked: boolean;
  isCompleted: boolean;
  grade: string | null;
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
