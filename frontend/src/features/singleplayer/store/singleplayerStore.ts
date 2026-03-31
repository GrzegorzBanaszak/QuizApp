import { create } from "zustand";
import { fetchSingleplayerGame, submitSingleplayerGame } from "../services/singleplayerApi";
import type {
  SingleplayerAnswerSelection,
  SingleplayerCategory,
  SingleplayerCategoryLevelDetails,
  SingleplayerGameSession,
  SingleplayerResultSummary,
  SingleplayerScreen,
} from "../types/singleplayer";

interface SingleplayerState {
  screen: SingleplayerScreen;
  categories: SingleplayerCategory[];
  isCategoriesLoading: boolean;
  categoriesError: string | null;
  categoryLevels: SingleplayerCategoryLevelDetails[];
  isCategoryLevelsLoading: boolean;
  categoryLevelsError: string | null;
  selectedCategoryId: number | null;
  selectedLevelId: number | null;
  selectedLevelName: string | null;
  selectedAnswerId: string | null;
  currentQuestionIndex: number;
  answerSelections: SingleplayerAnswerSelection[];
  gameSession: SingleplayerGameSession | null;
  resultSummary: SingleplayerResultSummary | null;
  isGameLoading: boolean;
  isSubmittingResult: boolean;
  gameError: string | null;
  hydrateCategories: (categories: SingleplayerCategory[]) => void;
  setCategoriesLoading: (value: boolean) => void;
  setCategoriesError: (value: string | null) => void;
  hydrateCategoryLevels: (levels: SingleplayerCategoryLevelDetails[]) => void;
  setCategoryLevelsLoading: (value: boolean) => void;
  setCategoryLevelsError: (value: string | null) => void;
  setSelectedCategoryId: (categoryId: number) => void;
  setSelectedAnswerId: (answerId: string | null) => void;
  goToLevelSelect: () => void;
  goToHome: () => void;
  startLevel: (levelId: number, levelName: string) => Promise<void>;
  advanceQuestion: () => Promise<void>;
  replay: () => Promise<void>;
  surrender: () => void;
}

const buildErrorMessage = (error: unknown, fallback: string): string =>
  error instanceof Error ? error.message : fallback;

const createGameplayResetState = () => ({
  selectedAnswerId: null,
  currentQuestionIndex: 0,
  answerSelections: [] as SingleplayerAnswerSelection[],
  gameSession: null as SingleplayerGameSession | null,
  resultSummary: null as SingleplayerResultSummary | null,
  isGameLoading: false,
  isSubmittingResult: false,
  gameError: null as string | null,
});

export const useSingleplayerStore = create<SingleplayerState>((set, get) => ({
  screen: "home",
  categories: [],
  isCategoriesLoading: false,
  categoriesError: null,
  categoryLevels: [],
  isCategoryLevelsLoading: false,
  categoryLevelsError: null,
  selectedCategoryId: null,
  selectedLevelId: null,
  selectedLevelName: null,
  selectedAnswerId: null,
  currentQuestionIndex: 0,
  answerSelections: [],
  gameSession: null,
  resultSummary: null,
  isGameLoading: false,
  isSubmittingResult: false,
  gameError: null,

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
  hydrateCategoryLevels: (categoryLevels) => set({ categoryLevels }),
  setCategoryLevelsLoading: (value) => set({ isCategoryLevelsLoading: value }),
  setCategoryLevelsError: (value) => set({ categoryLevelsError: value }),
  setSelectedCategoryId: (categoryId) => set({ selectedCategoryId: categoryId }),
  setSelectedAnswerId: (answerId) => set({ selectedAnswerId: answerId }),

  goToLevelSelect: () =>
    set({
      screen: "levelSelect",
      ...createGameplayResetState(),
    }),

  goToHome: () =>
    set({
      screen: "home",
      ...createGameplayResetState(),
      selectedLevelId: null,
      selectedLevelName: null,
    }),

  startLevel: async (levelId, levelName) => {
    set({
      screen: "gameplay",
      selectedLevelId: levelId,
      selectedLevelName: levelName,
      ...createGameplayResetState(),
      isGameLoading: true,
    });

    try {
      const gameSession = await fetchSingleplayerGame(levelId);

      set({
        gameSession,
        currentQuestionIndex: 0,
        selectedAnswerId: null,
        answerSelections: [],
        resultSummary: null,
        gameError: null,
      });
    } catch (error) {
      set({
        gameError: buildErrorMessage(
          error,
          "Nie udało się pobrać pytań dla tego poziomu.",
        ),
      });
    } finally {
      set({ isGameLoading: false });
    }
  },

  advanceQuestion: async () => {
    const {
      currentQuestionIndex,
      gameSession,
      selectedAnswerId,
      answerSelections,
    } = get();

    if (!gameSession || !selectedAnswerId) {
      return;
    }

    const currentQuestion = gameSession.questions[currentQuestionIndex];
    if (!currentQuestion) {
      return;
    }

    const updatedSelections = [
      ...answerSelections.filter(
        (selection) => selection.questionId !== currentQuestion.id,
      ),
      {
        questionId: currentQuestion.id,
        selectedAnswerId,
      },
    ];

    const isLastQuestion =
      currentQuestionIndex >= gameSession.questions.length - 1;

    if (!isLastQuestion) {
      set({
        answerSelections: updatedSelections,
        currentQuestionIndex: currentQuestionIndex + 1,
        selectedAnswerId: null,
        gameError: null,
      });
      return;
    }

    set({
      answerSelections: updatedSelections,
      isSubmittingResult: true,
      gameError: null,
    });

    try {
      const resultSummary = await submitSingleplayerGame(gameSession.levelId, {
        sessionId: gameSession.sessionId,
        playerAnswers: updatedSelections,
      });

      set({
        resultSummary,
        screen: "result",
        selectedAnswerId: null,
      });
    } catch (error) {
      set({
        gameError: buildErrorMessage(
          error,
          "Nie udało się wysłać wyniku rozgrywki.",
        ),
      });
    } finally {
      set({ isSubmittingResult: false });
    }
  },

  replay: async () => {
    const { selectedLevelId, selectedLevelName } = get();

    if (!selectedLevelId || !selectedLevelName) {
      return;
    }

    await get().startLevel(selectedLevelId, selectedLevelName);
  },

  surrender: () =>
    set({
      screen: "levelSelect",
      ...createGameplayResetState(),
    }),
}));
