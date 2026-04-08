import type {
  AchievementCatalogItem,
  AvatarCatalogItem,
} from "../types";

async function parseJsonResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as
      | { message?: string }
      | null;

    throw new Error(body?.message ?? "Nie udało się pobrać danych katalogu.");
  }

  return (await response.json()) as T;
}

export async function fetchAvatarCatalog(): Promise<AvatarCatalogItem[]> {
  const response = await fetch("/api/avatar", {
    credentials: "include",
  });

  return parseJsonResponse<AvatarCatalogItem[]>(response);
}

export async function fetchPublicAvatarPreview(): Promise<AvatarCatalogItem[]> {
  const response = await fetch("/api/avatar/defaults", {
    credentials: "include",
  });

  return parseJsonResponse<AvatarCatalogItem[]>(response);
}

export async function fetchAchievementCatalog(): Promise<
  AchievementCatalogItem[]
> {
  const response = await fetch("/api/achievements", {
    credentials: "include",
  });

  return parseJsonResponse<AchievementCatalogItem[]>(response);
}
