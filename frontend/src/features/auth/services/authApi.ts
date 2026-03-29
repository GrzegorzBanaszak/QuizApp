import type {
  AuthResponse,
  GoogleTokenRequest,
  GoogleVerifyResponse,
  RegisterSocialRequest,
  SocialProfileResponse,
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

export async function verifyGoogleToken(
  token: string,
): Promise<GoogleVerifyResponse> {
  const payload: GoogleTokenRequest = { token };

  const response = await fetch(`${AUTH_BASE}/verify-google`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return parseJsonResponse<GoogleVerifyResponse>(response);
}

export async function registerSocial(
  request: RegisterSocialRequest,
): Promise<AuthResponse> {
  const response = await fetch(`${AUTH_BASE}/register-social`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  return parseJsonResponse<AuthResponse>(response);
}

export const isAuthResponse = (
  response: GoogleVerifyResponse,
): response is AuthResponse => "profile" in response && "token" in response;

export const isSocialProfileResponse = (
  response: GoogleVerifyResponse,
): response is SocialProfileResponse => !("profile" in response);

