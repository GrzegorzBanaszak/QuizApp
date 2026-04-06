import { useEffectEvent, useState, startTransition } from "react";
import { Link, useNavigate } from "react-router";
import {
  isAuthResponse,
  loginAsGuest,
  logout,
  verifyFacebookToken,
  verifyGoogleCode,
} from "../services/authApi";
import { authAvatars } from "../data/authMockData";
import { requestFacebookAccessToken } from "../services/facebookAuth";
import { requestGoogleAuthorizationCode } from "../services/googleAuth";
import { useAuthStore } from "../store/authStore";

const googleLogo = (
  <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
    <path
      fill="#EA4335"
      d="M12 10.2v3.9h5.5c-.2 1.1-1.4 3.3-5.5 3.3-3.3 0-6-2.7-6-6s2.7-6 6-6c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.8 3 14.7 2 12 2 6.5 2 2 6.5 2 12s4.5 10 10 10c5.8 0 9.7-4.1 9.7-9.8 0-.7-.1-1.2-.2-1.7H12z"
    />
    <path
      fill="#FBBC05"
      d="M3.5 7.3 6.6 9.6C7.4 7.7 9.5 6 12 6c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.8 3 14.7 2 12 2 8.2 2 4.9 4 3.5 7.3z"
    />
    <path
      fill="#34A853"
      d="M12 22c2.6 0 4.8-.9 6.4-2.4l-3-2.5c-.9.6-2 .9-3.4.9-2.6 0-4.8-1.7-5.6-4.1L3.3 16.3C4.8 19.6 8 22 12 22z"
    />
    <path
      fill="#4285F4"
      d="M21.7 12.2c0-.7-.1-1.2-.2-1.7H12v3.7h5.5c-.3 1.2-1 2.2-2.1 2.9l3 2.5c1.8-1.7 3.3-4.3 3.3-7.4z"
    />
  </svg>
);

const facebookLogo = (
  <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M24 12.073c0-6.627-5.373-12-12-12S0 5.446 0 12.073c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

export const AuthLoginSection = () => {
  const navigate = useNavigate();
  const session = useAuthStore((state) => state.session);
  const setSession = useAuthStore((state) => state.setSession);
  const setPendingSocialLogin = useAuthStore(
    (state) => state.setPendingSocialLogin,
  );
  const isFacebookLoginLoading = useAuthStore(
    (state) => state.isFacebookLoginLoading,
  );
  const setFacebookLoginLoading = useAuthStore(
    (state) => state.setFacebookLoginLoading,
  );
  const error = useAuthStore((state) => state.error);
  const setError = useAuthStore((state) => state.setError);
  const [isGuestLoginLoading, setGuestLoginLoading] = useState(false);
  const [isGoogleLoginLoading, setGoogleLoginLoading] = useState(false);
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  const clearDraftAuth = () => {
    setError(null);
  };

  const handleGoogleLogin = useEffectEvent(async () => {
    if (!googleClientId) {
      setError("Brak VITE_GOOGLE_CLIENT_ID w konfiguracji frontendu.");
      return;
    }

    setError(null);
    setGoogleLoginLoading(true);

    try {
      const code = await requestGoogleAuthorizationCode(googleClientId);
      const response = await verifyGoogleCode({
        code,
        redirectUri: window.location.origin,
      });

      if (isAuthResponse(response)) {
        startTransition(() => {
          setSession({
            profile: response.profile,
          });
          navigate("/", { replace: true });
        });
        return;
      }

      startTransition(() => {
        const providerToken = response.providerToken;

        if (!providerToken) {
          throw new Error("Brak tymczasowego tokena logowania Google.");
        }

        setPendingSocialLogin({
          provider: "Google",
          providerToken,
          profile: response,
        });
        navigate("/auth/create-character", { replace: true });
      });
    } catch (loginError) {
      setError(
        loginError instanceof Error
          ? loginError.message
          : "Nie udało się zalogować przez Google.",
      );
    } finally {
      setGoogleLoginLoading(false);
    }
  });

  const handleFacebookLogin = async () => {
    const facebookAppId = import.meta.env.VITE_FACEBOOK_APP_ID;

    if (!facebookAppId) {
      setError("Brak VITE_FACEBOOK_APP_ID w konfiguracji frontendu.");
      return;
    }

    setError(null);
    setFacebookLoginLoading(true);

    try {
      const accessToken = await requestFacebookAccessToken(facebookAppId);
      const response = await verifyFacebookToken(accessToken);

      if (isAuthResponse(response)) {
        setSession({
          profile: response.profile,
        });
        navigate("/", { replace: true });
        return;
      }

      setPendingSocialLogin({
        provider: "Facebook",
        providerToken: accessToken,
        profile: response,
      });
      navigate("/auth/create-character", { replace: true });
    } catch (loginError) {
      setError(
        loginError instanceof Error
          ? loginError.message
          : "Nie udało się zalogować przez Facebook.",
      );
    } finally {
      setFacebookLoginLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    setError(null);
    setGuestLoginLoading(true);

    try {
      const response = await loginAsGuest({
        customAvatarUrl: authAvatars[0]?.image ?? "",
      });

      setSession({
        profile: response.profile,
      });
      navigate("/", { replace: true });
    } catch (loginError) {
      setError(
        loginError instanceof Error
          ? loginError.message
          : "Nie udało się zalogować jako gość.",
      );
    } finally {
      setGuestLoginLoading(false);
    }
  };

  if (session) {
    return (
      <section className="w-full max-w-4xl" aria-label="Profil użytkownika">
        <div className="glass-panel rounded-[2rem] border border-[#46465e]/30 px-5 py-6 md:px-8 md:py-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 overflow-hidden rounded-full ring-2 ring-[#e08dff]">
                <img
                  src={session.profile.avatarUrl}
                  alt={session.profile.username}
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#8ff5ff]">
                  Zalogowano
                </p>
                <h2 className="mt-1 font-headline text-3xl font-black tracking-[-0.04em] text-[#f4d5ff]">
                  {session.profile.username}
                </h2>
                <div className="mt-2 flex flex-wrap gap-3 text-sm text-[#aaa8c4]">
                  <span>{session.profile.totalExperience} XP</span>
                  <span>{session.profile.coins} coins</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                to="/profile/edit"
                className="rounded-full border border-[#e08dff]/30 bg-[#29294a] px-5 py-3 text-center text-sm font-bold uppercase tracking-[0.2em] text-[#e5e3ff] transition-colors hover:border-[#e08dff]/50 hover:bg-[#29294a]/80"
              >
                Edytuj profil
              </Link>
              <button
                type="button"
                onClick={() => {
                  void logout()
                    .catch(() => {
                      setError("Nie udało się wylogować.");
                    })
                    .finally(() => {
                      setSession(null);
                      clearDraftAuth();
                    });
                }}
                className="rounded-full bg-[#ff68a7]/15 px-5 py-3 text-sm font-bold uppercase tracking-[0.2em] text-[#ff68a7] transition-colors hover:bg-[#ff68a7]/25"
              >
                Wyloguj
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full max-w-4xl" aria-label="Logowanie">
      <div className="glass-panel rounded-[2rem] border border-[#46465e]/30 px-5 py-6 shadow-[0_24px_80px_rgba(5,8,22,0.45)] md:px-8 md:py-10">
        <div className="mb-6 text-center">
          <p className="text-xs font-black uppercase tracking-[0.32em] text-[#8ff5ff]">
            Wybierz sposób logowania
          </p>
          <h2 className="mt-3 font-headline text-3xl font-black tracking-tight text-[#f4d5ff]">
            Wejdź do QuizVolt
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-[#aaa8c4]">
            Zaloguj się przez konto społecznościowe albo wejdź jako gość, żeby
            od razu zacząć grę.
          </p>
        </div>

        <div className="space-y-4">
          <button
            type="button"
            onClick={() => {
              void handleGoogleLogin();
            }}
            disabled={isGoogleLoginLoading}
            className="glow-button group flex w-full items-center justify-between rounded-full border border-[#46465e]/40 bg-[#171730]/85 px-5 py-4 text-left transition-all hover:border-[#e08dff]/40 hover:bg-[#232341] disabled:cursor-wait disabled:opacity-60"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#f4d5ff] text-[#4f006c] shadow-[0_0_20px_rgba(224,141,255,0.25)]">
                {googleLogo}
              </div>
              <div>
                <p className="font-bold text-[#e5e3ff]">Zaloguj przez Google</p>
                <p className="text-xs text-[#aaa8c4]">Szybka synchronizacja postępów</p>
              </div>
            </div>
            <span className="material-symbols-outlined text-[#aaa8c4] transition-transform group-hover:translate-x-1">
              chevron_right
            </span>
          </button>

          <button
            type="button"
            onClick={handleFacebookLogin}
            disabled={isFacebookLoginLoading}
            className="glow-button group flex w-full items-center justify-between rounded-full border border-[#46465e]/40 bg-[#171730]/85 px-5 py-4 text-left transition-all hover:border-[#8ff5ff]/40 hover:bg-[#232341] disabled:cursor-wait disabled:opacity-60"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#1877F2] text-white shadow-[0_0_20px_rgba(24,119,242,0.25)]">
                {facebookLogo}
              </div>
              <div>
                <p className="font-bold text-[#e5e3ff]">Zaloguj przez Facebook</p>
                <p className="text-xs text-[#aaa8c4]">Dostęp do konta społecznościowego</p>
              </div>
            </div>
            <span className="material-symbols-outlined text-[#aaa8c4] transition-transform group-hover:translate-x-1">
              chevron_right
            </span>
          </button>

          <div className="flex items-center gap-4 py-2">
            <div className="h-px flex-1 bg-[#46465e]/40" />
            <span className="text-[10px] font-black uppercase tracking-[0.32em] text-[#74738d]">
              Lub
            </span>
            <div className="h-px flex-1 bg-[#46465e]/40" />
          </div>

          <button
            type="button"
            onClick={handleGuestLogin}
            disabled={isGuestLoginLoading}
            className="glow-button flex w-full items-center justify-center gap-3 rounded-full border-2 border-[#46465e]/30 bg-gradient-to-r from-[#e08dff] to-[#ff68a7] px-6 py-4 text-sm font-bold text-[#4f006c] transition-all hover:scale-[1.01] hover:border-[#e08dff]/50 disabled:cursor-wait disabled:opacity-60"
          >
            <span className="material-symbols-outlined text-2xl">person</span>
            <span>Graj jako Gość</span>
          </button>
        </div>

        {error ? (
          <p className="mt-4 text-center text-sm text-[#ff6e84]">{error}</p>
        ) : null}

        <p className="mt-6 text-center text-[11px] uppercase tracking-[0.28em] text-[#aaa8c4] md:text-xs">
          Synchronizuj swoje wyniki na wszystkich urządzeniach
        </p>
      </div>
    </section>
  );
};
