import { create } from "zustand";
import {
  leaderboard,
  levels,
  question,
  rewards,
} from "../services/singleplayerMockData";
import type {
  SingleplayerCategory,
  SingleplayerScreen,
} from "../types/singleplayer";

interface SingleplayerState {
  screen: SingleplayerScreen;
  categories: SingleplayerCategory[];
  isCategoriesLoading: boolean;
  categoriesError: string | null;
  selectedCategoryId: number | null;
  selectedLevelId: string;
  selectedAnswerIndex: number | null;
  hydrateCategories: (categories: SingleplayerCategory[]) => void;
  setCategoriesLoading: (value: boolean) => void;
  setCategoriesError: (value: string | null) => void;
  setSelectedCategoryId: (categoryId: number) => void;
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
  categories: [],
  isCategoriesLoading: false,
  categoriesError: null,
  selectedCategoryId: null,
  selectedLevelId:
    levels.find((level) => level.state === "available")?.id ??
    levels[0]?.id ??
    "hard",
  selectedAnswerIndex: null,

  hydrateCategories: (categories) =>
    set((state) => {
      const hasSelectedCategory = categories.some(
        (category) => category.id === state.selectedCategoryId,
      );

      return {
        categories,
        selectedCategoryId: hasSelectedCategory
          ? state.selectedCategoryId
          : categories[0]?.id ?? null,
      };
    }),
  setCategoriesLoading: (value) => set({ isCategoriesLoading: value }),
  setCategoriesError: (value) => set({ categoriesError: value }),
  setSelectedCategoryId: (categoryId) => set({ selectedCategoryId: categoryId }),

  goToLevelSelect: () => {
    if (!get().selectedCategoryId) return;
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
  levels,
  question,
  rewards,
  leaderboard,
};
