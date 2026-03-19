// src/store/gameStore.ts
import { create } from "zustand";
import type { Player, Room, QuestionDto } from "../types";

interface GameState {
  // --- DANE (STAN) ---
  connectionId: string | null; // ID aktualnego połączenia SignalR
  roomsList: Room[]; // Lista dostępnych pokoi
  currentRoom: Room | null; // Pokój, w którym obecnie znajduje się gracz

  // Etap Gry
  votingTopics: string[]; // Tematy do głosowania
  winningTopic: string | null; // Zwycięski temat
  isGeneratingQuestions: boolean; // Flaga dla ekranu ładowania (AI generuje pytania)
  currentQuestion: QuestionDto | null; // Obecne pytanie

  // Runda / Zakończenie
  lastQuestionResult: any | null; // Wyniki ostatniego pytania (podświetlenie kto zgadł)
  roundSummary: any | null; // Tabela wyników po rundzie
  finalLeaderboard: any | null; // Ostateczne wyniki
  error: string | null; // Błędy z serwera
  canStartGame: boolean;
  setCanStartGame: (canStart: boolean) => void;
  // --- AKCJE ---
  setConnectionId: (id: string) => void;
  setRoomsList: (rooms: Room[]) => void;

  // Akcje w pokoju
  setCurrentRoom: (room: Room) => void;
  updatePlayersList: (players: Player[]) => void;
  setRoomNumberOfTopics: (num: number) => void;
  updatePlayerReadyStatus: (connectionId: string, isReady: boolean) => void;

  // Akcje rozgrywki
  setVotingTopics: (topics: string[]) => void;
  setWinningTopic: (topic: string) => void;
  setQuestionsGenerating: (isGenerating: boolean) => void;
  setCurrentQuestion: (question: QuestionDto) => void;
  setQuestionResult: (result: any) => void;
  setRoundEnded: (summary: any) => void;
  setGameOver: (leaderboard: any) => void;

  // Utylity
  setError: (error: string | null) => void;
  resetGame: () => void; // Powrót do Lobby po zakończeniu gry
}

export const useGameStore = create<GameState>((set) => ({
  // Inicjalne wartości
  connectionId: null,
  roomsList: [],
  currentRoom: null,
  votingTopics: [],
  winningTopic: null,
  isGeneratingQuestions: false,
  currentQuestion: null,
  lastQuestionResult: null,
  roundSummary: null,
  finalLeaderboard: null,
  error: null,

  // Implementacja akcji
  setConnectionId: (id) => set({ connectionId: id }),

  setRoomsList: (rooms) => set({ roomsList: rooms }),

  setCurrentRoom: (room) => set({ currentRoom: room }),
  canStartGame: false,
  setCanStartGame: (canStart) => set({ canStartGame: canStart }),
  updatePlayersList: (players) =>
    set((state) => {
      if (!state.currentRoom) return state;

      // Zmiana listy (tablicy) z backendu na słownik (Record), by łatwiej się do niego odnosić
      const playersRecord = players.reduce(
        (acc, player) => {
          acc[player.connectionId] = player;
          return acc;
        },
        {} as Record<string, Player>,
      );

      return {
        currentRoom: {
          ...state.currentRoom,
          players: playersRecord,
        },
      };
    }),

  setRoomNumberOfTopics: (num) =>
    set((state) => {
      if (!state.currentRoom) return state;
      return { currentRoom: { ...state.currentRoom, numberOfTopics: num } };
    }),

  updatePlayerReadyStatus: (connId, isReady) =>
    set((state) => {
      if (!state.currentRoom || !state.currentRoom.players[connId])
        return state;

      return {
        currentRoom: {
          ...state.currentRoom,
          players: {
            ...state.currentRoom.players,
            [connId]: {
              ...state.currentRoom.players[connId],
              isReady,
            },
          },
        },
      };
    }),

  setVotingTopics: (topics) =>
    set({ votingTopics: topics, winningTopic: null }),

  setWinningTopic: (topic) =>
    set({ winningTopic: topic, isGeneratingQuestions: true }),

  setQuestionsGenerating: (isGenerating) =>
    set({ isGeneratingQuestions: isGenerating }),

  setCurrentQuestion: (question) =>
    set({
      currentQuestion: question,
      isGeneratingQuestions: false,
      lastQuestionResult: null, // Resetujemy wynik z poprzedniego pytania
    }),

  setQuestionResult: (result) => set({ lastQuestionResult: result }),

  setRoundEnded: (summary) =>
    set({ roundSummary: summary, currentQuestion: null }),

  setGameOver: (leaderboard) =>
    set({ finalLeaderboard: leaderboard, currentRoom: null }),

  setError: (error) => set({ error }),

  resetGame: () =>
    set({
      currentRoom: null,
      votingTopics: [],
      winningTopic: null,
      isGeneratingQuestions: false,
      currentQuestion: null,
      lastQuestionResult: null,
      roundSummary: null,
      finalLeaderboard: null,
      error: null,
    }),
}));
