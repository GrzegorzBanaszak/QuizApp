import type {
  AuthAvatarOption,
  AuthResponse,
  GoogleLoginRequest,
  GoogleVerifyResponse,
  PendingSocialLogin,
  RegisterSocialRequest,
  SocialProfileResponse,
  UpdateUserProfileRequest,
} from "../types";

const AUTH_BASE = "/api/auth";

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

  return parseJsonResponse<GoogleVerifyResponse>(response);
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

  return parseJsonResponse<GoogleVerifyResponse>(response);
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

  return parseJsonResponse<AuthResponse>(response);
}

export async function fetchCreateCharacterAvatars(): Promise<AuthAvatarOption[]> {
  const response = await fetch("/api/avatar/defaults", {
    credentials: "include",
  });

  return parseJsonResponse<AuthAvatarOption[]>(response);
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

  return parseJsonResponse<AuthResponse>(response);
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
  const response = await fetch("/api/user/me", {
    credentials: "include",
  });

  return parseJsonResponse<AuthResponse["profile"]>(response);
}

export async function updateCurrentUserProfile(
  request: UpdateUserProfileRequest,
): Promise<AuthResponse["profile"]> {
  const response = await fetch("/api/user/me", {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  return parseJsonResponse<AuthResponse["profile"]>(response);
}

export const isAuthResponse = (
  response: GoogleVerifyResponse,
): response is AuthResponse => "profile" in response && "userId" in response;

export const isSocialProfileResponse = (
  response: GoogleVerifyResponse,
): response is SocialProfileResponse => !("profile" in response);

export type { PendingSocialLogin };
