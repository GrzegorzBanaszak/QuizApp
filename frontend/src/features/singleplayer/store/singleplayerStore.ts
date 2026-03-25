import { create } from "zustand";
import {
  avatars,
  categories,
  leaderboard,
  levels,
  question,
  rewards,
} from "../services/singleplayerMockData";
import type {
  SingleplayerProfile,
  SingleplayerScreen,
} from "../types/singleplayer";

interface SingleplayerState {
  screen: SingleplayerScreen;
  draftName: string;
  selectedAvatarId: string;
  selectedCategoryId: string;
  selectedLevelId: string;
  selectedAnswerIndex: number | null;
  profile: SingleplayerProfile | null;
  setDraftName: (value: string) => void;
  setSelectedAvatarId: (avatarId: string) => void;
  setSelectedCategoryId: (categoryId: string) => void;
  saveProfile: () => void;
  editProfile: () => void;
  goToLevelSelect: () => void;
  goToHome: () => void;
  startLevel: (levelId: string) => void;
  selectAnswer: (answerIndex: number) => void;
  finishQuestion: () => void;
  replay: () => void;
  surrender: () => void;
}

export const useSingleplayerStore = create<SingleplayerState>((set, get) => ({
  screen: "home",
  draftName: "",
  selectedAvatarId: avatars[0]?.id ?? "avatar-1",
  selectedCategoryId: categories[0]?.id ?? "general",
  selectedLevelId: "hard",
  selectedAnswerIndex: null,
  profile: null,

  setDraftName: (value) => set({ draftName: value }),
  setSelectedAvatarId: (avatarId) => set({ selectedAvatarId: avatarId }),
  setSelectedCategoryId: (categoryId) =>
    set({ selectedCategoryId: categoryId }),

  saveProfile: () =>
    set((state) => {
      const trimmedName = state.draftName.trim();
      if (!trimmedName) return state;

      return {
        profile: {
          name: trimmedName,
          avatarId: state.selectedAvatarId,
          level: 42,
          xp: "2.4k XP",
        },
      };
    }),

  editProfile: () =>
    set((state) => ({
      draftName: state.profile?.name ?? "",
      selectedAvatarId: state.profile?.avatarId ?? state.selectedAvatarId,
      profile: null,
      screen: "home",
    })),

  goToLevelSelect: () => {
    if (!get().profile) return;
    set({ screen: "levelSelect" });
  },

  goToHome: () => set({ screen: "home" }),

  startLevel: (levelId) =>
    set({
      selectedLevelId: levelId,
      selectedAnswerIndex: null,
      screen: "gameplay",
    }),

  selectAnswer: (answerIndex) => set({ selectedAnswerIndex: answerIndex }),

  finishQuestion: () => {
    if (get().selectedAnswerIndex === null) return;
    set({ screen: "result" });
  },

  replay: () => set({ selectedAnswerIndex: null, screen: "gameplay" }),

  surrender: () => set({ screen: "levelSelect" }),
}));

export const singleplayerMockData = {
  avatars,
  categories,
  levels,
  question,
  rewards,
  leaderboard,
};
