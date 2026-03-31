import type {
  SingleplayerCategory,
  SingleplayerCategoryLevelDetails,
} from "../types/singleplayer";

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
  const response = await fetch("/api/singleplayer/categories", {
    credentials: "include",
  });

  return parseJsonResponse<SingleplayerCategory[]>(response);
}

export async function fetchSingleplayerCategoryLevels(
  categoryId: number,
): Promise<SingleplayerCategoryLevelDetails[]> {
  const response = await fetch(
    `/api/singleplayer/categories/${categoryId}/levels`,
    {
      credentials: "include",
    },
  );

  return parseJsonResponse<SingleplayerCategoryLevelDetails[]>(response);
}
