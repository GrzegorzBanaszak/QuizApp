// src/types/index.ts

export const RoomStatus = {
  WaitingForPlayers: 0,
  Playing: 1,
  Finished: 2,
} as const;

export type RoomStatus = (typeof RoomStatus)[keyof typeof RoomStatus];

export interface Player {
  connectionId: string;
  name: string;
  avatarUrl: string;
  score: number;
  isReady: boolean;
}

export interface Room {
  roomId: string;
  hostConnectionId: string;
  numberOfTopics: number;
  status: RoomStatus;
  // W C# masz ConcurrentDictionary<string, Player>, SignalR zserializuje to zazwyczaj jako obiekt/słownik
  players: Record<string, Player>;
  availableTopics: string[];
  playerVotes: Record<string, string>;
  selectedTopic: string | null;
  currentQuestionIndex: number;
  playedTopics: string[];
  // properties związane z logiką pytań często trzymamy oddzielnie w store dla wygody
}

export interface QuestionDto {
  text: string;
  options: string[];
  questionNumber: number;
  totalQuestions: number;
  timeLimitSeconds: number;
}

// Dodatkowe typy pomocnicze dla wyników
export interface QuestionResult {
  correctAnswerIndex: number;
  playerScores: Record<string, number>;
  // W zależności od tego co dokładnie wysyłasz w "object results" w GameHub
}
