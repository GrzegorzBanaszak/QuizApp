import type {
  SingleplayerAnswerSelection,
  SingleplayerAchievementAward,
  SingleplayerCategory,
  SingleplayerCategoryLevelDetails,
  SingleplayerGameSession,
  SingleplayerResultSummary,
} from "../types/singleplayer";
import { buildApiUrl, resolveBackendAssetUrl } from "../../../shared/api";

function normalizeAchievementAward(
  award: SingleplayerAchievementAward,
): SingleplayerAchievementAward {
  return {
    ...award,
    iconUrl: resolveBackendAssetUrl(award.iconUrl),
    rewardAvatarImageUrl: resolveBackendAssetUrl(award.rewardAvatarImageUrl),
  };
}

function normalizeResultSummary(
  result: SingleplayerResultSummary,
): SingleplayerResultSummary {
  return {
    ...result,
    unlockedAchievements: result.unlockedAchievements.map(
      normalizeAchievementAward,
    ),
  };
}

async function parseJsonResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as
      | { message?: string }
      | null;

    throw new Error(
      body?.message ?? "Nie udało się pobrać kategorii singleplayer.",
    );
  }

  return (await response.json()) as T;
}

export async function fetchSingleplayerCategories(): Promise<
  SingleplayerCategory[]
> {
  const response = await fetch(buildApiUrl("/api/singleplayer/categories"), {
    credentials: "include",
  });

  return parseJsonResponse<SingleplayerCategory[]>(response);
}

export async function fetchSingleplayerCategoryLevels(
  categoryId: number,
): Promise<SingleplayerCategoryLevelDetails[]> {
  const response = await fetch(
    buildApiUrl(`/api/singleplayer/categories/${categoryId}/levels`),
    {
      credentials: "include",
    },
  );

  return parseJsonResponse<SingleplayerCategoryLevelDetails[]>(response);
}

export async function fetchSingleplayerGame(
  levelId: number,
): Promise<SingleplayerGameSession> {
  const response = await fetch(
    buildApiUrl(`/api/singleplayer/levels/${levelId}/questions`),
    {
      credentials: "include",
    },
  );

  return parseJsonResponse<SingleplayerGameSession>(response);
}

export async function submitSingleplayerGame(
  levelId: number,
  request: {
    sessionId: string;
    playerAnswers: SingleplayerAnswerSelection[];
  },
): Promise<SingleplayerResultSummary> {
  const response = await fetch(
    buildApiUrl(`/api/singleplayer/levels/${levelId}/submit`),
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    },
  );

  return normalizeResultSummary(
    await parseJsonResponse<SingleplayerResultSummary>(response),
  );
}
