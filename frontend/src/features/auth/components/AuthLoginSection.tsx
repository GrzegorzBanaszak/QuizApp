import { Link, useNavigate } from "react-router";
import { useAuthStore } from "../store/authStore";
import {
  isAuthResponse,
  logout,
  verifyGoogleToken,
} from "../services/authApi";
import { requestGoogleIdToken } from "../services/googleAuth";

export const AuthLoginSection = () => {
  const navigate = useNavigate();
  const session = useAuthStore((state) => state.session);
  const setSession = useAuthStore((state) => state.setSession);
  const setPendingGoogleLogin = useAuthStore(
    (state) => state.setPendingGoogleLogin,
  );
  const isGoogleLoginLoading = useAuthStore(
    (state) => state.isGoogleLoginLoading,
  );
  const setGoogleLoginLoading = useAuthStore(
    (state) => state.setGoogleLoginLoading,
  );
  const error = useAuthStore((state) => state.error);
  const setError = useAuthStore((state) => state.setError);

  const handleGoogleLogin = async () => {
    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as
      | string
      | undefined;

    if (!googleClientId) {
      setError("Brak VITE_GOOGLE_CLIENT_ID w konfiguracji frontendu.");
      return;
    }

    setError(null);
    setGoogleLoginLoading(true);

    try {
      const idToken = await requestGoogleIdToken(googleClientId);
      const response = await verifyGoogleToken(idToken);

      if (isAuthResponse(response)) {
        setSession({
          profile: response.profile,
        });
        setPendingGoogleLogin(null);
        navigate("/", { replace: true });
        return;
      }

      setPendingGoogleLogin({
        profile: response,
        providerToken: idToken,
      });
      navigate("/auth/create-character", { replace: true });
    } catch (loginError) {
      setError(
        loginError instanceof Error
          ? loginError.message
          : "Nie udało się zalogować przez Google.",
      );
    } finally {
      setGoogleLoginLoading(false);
    }
  };

  if (session) {
    return (
      <section className="mb-16 w-full max-w-4xl" aria-label="Profil użytkownika">
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
                to="/auth/create-character"
                className="rounded-full border border-[#e08dff]/30 bg-[#29294a] px-5 py-3 text-center text-sm font-bold uppercase tracking-[0.2em] text-[#e5e3ff] transition-colors hover:border-[#e08dff]/50 hover:bg-[#29294a]/80"
              >
                Zmień postać
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
                      setPendingGoogleLogin(null);
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
    <section className="mb-16 w-full max-w-4xl" aria-label="Logowanie">
      <div className="glass-panel rounded-[2rem] border border-[#46465e]/30 px-5 py-6 shadow-[0_24px_80px_rgba(5,8,22,0.45)] md:px-8 md:py-10">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isGoogleLoginLoading}
            className="flex items-center justify-center gap-3 rounded-full bg-white px-6 py-4 text-sm font-bold text-gray-900 transition-all hover:scale-[1.02] disabled:cursor-wait disabled:opacity-60"
          >
            <svg className="h-6 w-6" viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            <span>Google</span>
          </button>

          <button
            type="button"
            className="flex items-center justify-center gap-3 rounded-full bg-[#1877F2] px-6 py-4 text-sm font-bold text-white transition-all hover:scale-[1.02]"
          >
            <svg
              className="h-6 w-6 fill-current"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M24 12.073c0-6.627-5.373-12-12-12S0 5.446 0 12.073c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            <span>Facebook</span>
          </button>

          <Link
            to="/auth/create-character"
            className="flex items-center justify-center gap-3 rounded-full border-2 border-[#46465e]/30 bg-[#29294a] px-6 py-4 text-sm font-bold text-[#e5e3ff] transition-all hover:scale-[1.02] hover:border-[#e08dff]/50"
          >
            <span
              className="material-symbols-outlined text-2xl"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              person_outline
            </span>
            <span>Graj jako Gość</span>
          </Link>
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
