import type {
  AchievementCatalogItem,
  AvatarCatalogItem,
} from "../types";
import { buildApiUrl, resolveBackendAssetUrl } from "../../../shared/api";

function normalizeAvatarCatalogItem(item: AvatarCatalogItem): AvatarCatalogItem {
  return {
    ...item,
    imageUrl: resolveBackendAssetUrl(item.imageUrl),
  };
}

function normalizeAchievementCatalogItem(
  item: AchievementCatalogItem,
): AchievementCatalogItem {
  return {
    ...item,
    iconUrl: resolveBackendAssetUrl(item.iconUrl),
    rewardAvatarImageUrl: resolveBackendAssetUrl(item.rewardAvatarImageUrl),
  };
}

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
  const response = await fetch(buildApiUrl("/api/avatar"), {
    credentials: "include",
  });

  return (await parseJsonResponse<AvatarCatalogItem[]>(response)).map(
    normalizeAvatarCatalogItem,
  );
}

export async function fetchPublicAvatarPreview(): Promise<AvatarCatalogItem[]> {
  const response = await fetch(buildApiUrl("/api/avatar/defaults"), {
    credentials: "include",
  });

  return (await parseJsonResponse<AvatarCatalogItem[]>(response)).map(
    normalizeAvatarCatalogItem,
  );
}

export async function fetchAchievementCatalog(): Promise<
  AchievementCatalogItem[]
> {
  const response = await fetch(buildApiUrl("/api/achievements"), {
    credentials: "include",
  });

  return (await parseJsonResponse<AchievementCatalogItem[]>(response)).map(
    normalizeAchievementCatalogItem,
  );
}
