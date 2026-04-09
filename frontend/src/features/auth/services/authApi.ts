import type {
  AuthResponse,
  GoogleLoginRequest,
  GoogleVerifyResponse,
  PendingSocialLogin,
  RegisterSocialRequest,
  SocialProfileResponse,
  UpdateUserProfileRequest,
} from "../types";
import type { AvatarCatalogItem } from "../../catalog/types";
import { buildApiUrl, resolveBackendAssetUrl } from "../../../shared/api";

const AUTH_BASE = buildApiUrl("/api/auth");

function normalizeProfile<T extends { avatarUrl: string }>(profile: T): T {
  return {
    ...profile,
    avatarUrl: resolveBackendAssetUrl(profile.avatarUrl),
  };
}

function normalizeAuthResponse(response: AuthResponse): AuthResponse {
  return {
    ...response,
    profile: normalizeProfile(response.profile),
  };
}

function normalizeSocialProfileResponse(
  response: SocialProfileResponse,
): SocialProfileResponse {
  return normalizeProfile(response);
}

function normalizeAvatarCatalogItem(item: AvatarCatalogItem): AvatarCatalogItem {
  return {
    ...item,
    imageUrl: resolveBackendAssetUrl(item.imageUrl),
  };
}

async function parseJsonResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as
      | { message?: string }
      | null;
    throw new Error(body?.message ?? "Nie udało się wykonać operacji auth.");
  }

  return (await response.json()) as T;
}

export async function verifyGoogleCode(
  request: GoogleLoginRequest,
): Promise<GoogleVerifyResponse> {
  const response = await fetch(`${AUTH_BASE}/verify-google`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "X-Requested-With": "XMLHttpRequest",
    },
    body: JSON.stringify(request),
  });

  const payload = await parseJsonResponse<GoogleVerifyResponse>(response);
  return isAuthResponse(payload)
    ? normalizeAuthResponse(payload)
    : normalizeSocialProfileResponse(payload);
}

export async function verifyGoogleToken(
  token: string,
): Promise<GoogleVerifyResponse> {
  return verifyGoogleCode({ token });
}

export async function verifyFacebookToken(
  token: string,
): Promise<GoogleVerifyResponse> {
  const response = await fetch(`${AUTH_BASE}/verify-facebook`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token }),
  });

  const payload = await parseJsonResponse<GoogleVerifyResponse>(response);
  return isAuthResponse(payload)
    ? normalizeAuthResponse(payload)
    : normalizeSocialProfileResponse(payload);
}

export async function registerSocial(
  request: RegisterSocialRequest,
): Promise<AuthResponse> {
  const response = await fetch(`${AUTH_BASE}/register-social`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  return normalizeAuthResponse(await parseJsonResponse<AuthResponse>(response));
}

export async function fetchCreateCharacterAvatars(): Promise<AvatarCatalogItem[]> {
  const response = await fetch(buildApiUrl("/api/avatar/defaults"), {
    credentials: "include",
  });

  return (await parseJsonResponse<AvatarCatalogItem[]>(response)).map(
    normalizeAvatarCatalogItem,
  );
}

export async function loginAsGuest(
  request: {
    customUsername?: string | null;
    customAvatarUrl?: string | null;
  },
): Promise<AuthResponse> {
  const response = await fetch(`${AUTH_BASE}/guest`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  return normalizeAuthResponse(await parseJsonResponse<AuthResponse>(response));
}

export async function logout(): Promise<void> {
  const response = await fetch(`${AUTH_BASE}/logout`, {
    method: "POST",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Nie udało się wylogować.");
  }
}

export async function fetchCurrentUser(): Promise<AuthResponse["profile"]> {
  const response = await fetch(buildApiUrl("/api/user/me"), {
    credentials: "include",
  });

  return normalizeProfile(
    await parseJsonResponse<AuthResponse["profile"]>(response),
  );
}

export async function updateCurrentUserProfile(
  request: UpdateUserProfileRequest,
): Promise<AuthResponse["profile"]> {
  const response = await fetch(buildApiUrl("/api/user/me"), {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  return normalizeProfile(
    await parseJsonResponse<AuthResponse["profile"]>(response),
  );
}

export const isAuthResponse = (
  response: GoogleVerifyResponse,
): response is AuthResponse => "profile" in response && "userId" in response;

export const isSocialProfileResponse = (
  response: GoogleVerifyResponse,
): response is SocialProfileResponse => !("profile" in response);

export type { PendingSocialLogin };
