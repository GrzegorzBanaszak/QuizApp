import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";
import { authAvatars } from "../data/authMockData";
import { registerSocial } from "../services/authApi";
import { useAuthStore } from "../store/authStore";

export const CreateCharacterPage = () => {
  const navigate = useNavigate();
  const pendingSocialLogin = useAuthStore((state) => state.pendingSocialLogin);
  const setSession = useAuthStore((state) => state.setSession);
  const setPendingSocialLogin = useAuthStore(
    (state) => state.setPendingSocialLogin,
  );
  const setError = useAuthStore((state) => state.setError);
  const error = useAuthStore((state) => state.error);

  const [name, setName] = useState(pendingSocialLogin?.profile.name ?? "");
  const [selectedAvatarId, setSelectedAvatarId] = useState(authAvatars[0]?.id ?? "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (pendingSocialLogin?.profile.name) {
      setName((currentName) => currentName || pendingSocialLogin.profile.name);
    }
  }, [pendingSocialLogin]);

  const selectedAvatar = useMemo(
    () =>
      authAvatars.find((avatar) => avatar.id === selectedAvatarId) ??
      authAvatars[0],
    [selectedAvatarId],
  );

  const isReady = name.trim().length > 0;

  const handleCreateCharacter = async () => {
    if (!pendingSocialLogin) {
      setError("Najpierw zaloguj się przez Google lub Facebook, aby utworzyć postać.");
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const response = await registerSocial({
        provider: pendingSocialLogin.provider,
        providerToken: pendingSocialLogin.providerToken,
        customUsername: name.trim(),
        customAvatarUrl:
          selectedAvatar?.image ?? pendingSocialLogin.profile.avatarUrl,
      });

      setSession({
        profile: response.profile,
      });
      setPendingSocialLogin(null);
      navigate("/", { replace: true });
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Nie udało się utworzyć postaci.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0c0c21] px-4 py-6 text-[#e5e3ff] sm:px-6 lg:px-8 lg:py-10">
      <div className="pointer-events-none fixed left-[-10%] top-[-10%] h-[40vw] w-[40vw] max-h-[28rem] max-w-[28rem] rounded-full bg-[#e08dff]/12 blur-[120px]" />
      <div className="pointer-events-none fixed bottom-[-10%] right-[-10%] h-[40vw] w-[40vw] max-h-[28rem] max-w-[28rem] rounded-full bg-[#ff68a7]/12 blur-[120px]" />

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-6xl flex-col justify-center gap-8">
        <header className="mx-auto w-full max-w-3xl text-center">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.35em] text-[#8ff5ff]">
            Auth / Character Setup
          </p>
          <h1 className="bg-gradient-to-r from-[#e08dff] via-[#d978ff] to-[#ff68a7] bg-clip-text font-headline text-4xl font-black tracking-[-0.04em] text-transparent sm:text-5xl lg:text-6xl">
            Stwórz nową postać
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-[#aaa8c4] sm:text-lg">
            Zdefiniuj pseudonim i awatar, aby wejść do gry jako nowy gracz albo
            wrócić do istniejącego konta później.
          </p>
        </header>

        <main className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <section className="glass-panel lg:col-span-8 rounded-[2rem] p-6 sm:p-8">
            <div className="flex flex-col gap-6">
              {pendingSocialLogin ? (
                <div className="flex flex-col items-center gap-5 rounded-[2rem] bg-[#171730]/60 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="h-20 w-20 overflow-hidden rounded-full bg-[#232341] ring-4 ring-[#8ff5ff] shadow-[0_0_24px_rgba(143,245,255,0.28)]">
                        <img
                          src={pendingSocialLogin.profile.avatarUrl}
                          alt={pendingSocialLogin.profile.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="absolute -bottom-1 -right-1 rounded-full bg-[#8ff5ff] px-2 py-1 text-[10px] font-black tracking-tight text-[#003f43] shadow-lg">
                        {pendingSocialLogin.provider.toUpperCase()}
                      </div>
                    </div>

                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#8ff5ff]">
                        Profil z {pendingSocialLogin.provider}
                      </p>
                      <h2 className="mt-1 font-headline text-2xl font-black tracking-[-0.03em] text-[#f4d5ff]">
                        {pendingSocialLogin.profile.name}
                      </h2>
                      <p className="mt-1 text-sm text-[#aaa8c4]">
                        Wybierz nazwę postaci i docelowy awatar do gry.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 rounded-full bg-[#8ff5ff]/10 px-3 py-2 text-[#8ff5ff]">
                    <span className="material-symbols-outlined text-base">
                      link
                    </span>
                    <span className="text-xs font-black uppercase tracking-[0.2em]">
                      {pendingSocialLogin.providerToken.slice(0, 8)}...
                    </span>
                  </div>
                </div>
              ) : null}

              <div className="flex flex-col items-center gap-5 rounded-[2rem] bg-[#171730]/60 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="h-20 w-20 overflow-hidden rounded-full bg-[#232341] ring-4 ring-[#e08dff] shadow-[0_0_24px_rgba(224,141,255,0.35)]">
                      <img
                        src={selectedAvatar?.image}
                        alt={selectedAvatar?.name ?? "Awatar"}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="absolute -bottom-1 -right-1 rounded-full bg-[#ff68a7] px-2 py-1 text-[10px] font-black tracking-tight text-[#460024] shadow-lg">
                      {selectedAvatar?.badge ?? "NEW"}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#8ff5ff]">
                      Aktywna postać
                    </p>
                    <h2 className="mt-1 font-headline text-2xl font-black tracking-[-0.03em] text-[#f4d5ff]">
                      {name.trim() || "Bezimienny gracz"}
                    </h2>
                    <p className="mt-1 text-sm text-[#aaa8c4]">
                      Ta nazwa będzie widoczna w lobby i wynikach.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 rounded-full bg-[#8ff5ff]/10 px-3 py-2 text-[#8ff5ff]">
                  <span className="material-symbols-outlined text-base">
                    bolt
                  </span>
                  <span className="text-xs font-black uppercase tracking-[0.2em]">
                    8 awatarów
                  </span>
                </div>
              </div>

              <div className="grid gap-4">
                <label
                  htmlFor="nickname"
                  className="px-1 text-sm font-bold uppercase tracking-[0.25em] text-[#e08dff]"
                >
                  Nazwa użytkownika
                </label>
                <div className="neon-border-focus flex items-stretch rounded-[1.5rem] bg-[#0a0a18] ring-1 ring-[#46465e]/30 transition-shadow">
                  <input
                    id="nickname"
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    maxLength={20}
                    placeholder="Wpisz swój pseudonim..."
                    className="h-14 w-full rounded-[1.5rem] border-0 bg-transparent px-5 text-base font-semibold text-[#e5e3ff] outline-none placeholder:text-[#74738d]"
                  />
                  <div className="flex items-center justify-center px-4 text-[#e08dff]">
                    <span className="material-symbols-outlined">edit</span>
                  </div>
                </div>
              </div>

              <div className="grid gap-4">
                <div className="flex items-center justify-between gap-3">
                  <label className="px-1 text-sm font-bold uppercase tracking-[0.25em] text-[#ff68a7]">
                    Wybierz awatar
                  </label>
                  <span className="rounded-md bg-[#8ff5ff]/10 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.25em] text-[#8ff5ff]">
                    {authAvatars.length} dostępnych
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {authAvatars.map((avatar) => {
                    const isActive = avatar.id === selectedAvatarId;

                    return (
                      <button
                        key={avatar.id}
                        type="button"
                        onClick={() => setSelectedAvatarId(avatar.id)}
                        className={`group relative aspect-square overflow-hidden rounded-[1.5rem] bg-[#232341] transition-all duration-300 ${
                          isActive
                            ? "ring-2 ring-[#e08dff] shadow-[0_0_24px_rgba(224,141,255,0.32)]"
                            : "ring-1 ring-white/10 hover:-translate-y-1 hover:ring-[#e08dff]/50"
                        }`}
                      >
                        <img
                          src={avatar.image}
                          alt={avatar.name}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c21]/70 via-transparent to-transparent" />
                        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between gap-2">
                          <span className="max-w-[70%] truncate text-left text-[11px] font-bold uppercase tracking-[0.2em] text-[#e5e3ff]">
                            {avatar.name}
                          </span>
                          <span className="rounded-md bg-[#0c0c21]/80 px-1.5 py-0.5 text-[9px] font-black uppercase tracking-[0.18em] text-[#8ff5ff]">
                            {avatar.badge}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={handleCreateCharacter}
                  disabled={!isReady || isSubmitting || !pendingSocialLogin}
                  className="rounded-full bg-gradient-to-r from-[#e08dff] to-[#d978ff] px-8 py-4 font-headline text-sm font-black tracking-[0.2em] text-[#4f006c] shadow-[0_0_30px_rgba(224,141,255,0.35)] transition-all hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSubmitting ? "TWORZENIE..." : "UTWÓRZ POSTAĆ"}
                </button>
                <Link
                  to="/"
                  className="rounded-full border border-white/10 px-8 py-4 text-center text-sm font-bold uppercase tracking-[0.2em] text-[#e5e3ff] transition-colors hover:bg-white/5"
                >
                  Powrót
                </Link>
              </div>
            </div>
          </section>

          <aside className="lg:col-span-4 flex flex-col gap-6">
            <section className="glass-panel rounded-[2rem] p-6 sm:p-8">
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#8ff5ff]">
                Ponowne logowanie
              </p>
              <h2 className="mt-3 font-headline text-3xl font-black tracking-[-0.04em] text-[#f4d5ff]">
                Masz już konto?
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-[#aaa8c4]">
                Wróć do zapisanego profilu i kontynuuj tam, gdzie skończyłeś.
              </p>

              <div className="mt-6 grid gap-3">
                <button
                  type="button"
                  className="flex items-center justify-center gap-3 rounded-full bg-white px-5 py-4 text-sm font-bold text-gray-900 transition-all hover:scale-[1.01]"
                >
                  <span className="material-symbols-outlined text-xl">mail</span>
                  Google
                </button>
                <button
                  type="button"
                  className="flex items-center justify-center gap-3 rounded-full bg-[#1877F2] px-5 py-4 text-sm font-bold text-white transition-all hover:scale-[1.01]"
                >
                  <span className="material-symbols-outlined text-xl">public</span>
                  Facebook
                </button>
                <Link
                  to="/"
                  className="flex items-center justify-center gap-3 rounded-full border border-[#46465e]/30 bg-[#29294a] px-5 py-4 text-sm font-bold text-[#e5e3ff] transition-all hover:border-[#e08dff]/50 hover:bg-[#29294a]/80"
                >
                  <span className="material-symbols-outlined text-xl">
                    arrow_back
                  </span>
                  Wybierz tryb
                </Link>
              </div>
            </section>

            <section className="glass-panel rounded-[2rem] p-6 sm:p-8">
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#ff68a7]">
                Podgląd
              </p>
              <div className="mt-4 flex items-center gap-4">
                <div className="h-16 w-16 overflow-hidden rounded-full ring-2 ring-[#e08dff]">
                  <img
                    src={selectedAvatar?.image}
                    alt={selectedAvatar?.name ?? "Awatar"}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-headline text-xl font-black text-[#e5e3ff]">
                    {name.trim() || "Bezimienny gracz"}
                  </h3>
                  <p className="text-sm text-[#aaa8c4]">
                    {selectedAvatar?.name ?? "Wybrany awatar"}
                  </p>
                </div>
              </div>
              <div className="mt-6 rounded-[1.5rem] bg-[#111128] p-4 text-sm leading-relaxed text-[#aaa8c4]">
                Postać zostanie użyta jako punkt wejścia do gry solo, a później
                podpięta do pełnego systemu logowania.
              </div>
              {error ? (
                <div className="mt-4 rounded-[1.5rem] bg-[#ff6e84]/10 p-4 text-sm text-[#ffb2b9]">
                  {error}
                </div>
              ) : null}
            </section>
          </aside>
        </main>

        <footer className="flex flex-col items-center gap-4 pb-4 pt-2 text-center">
          <Link
            to="/"
            className="flex items-center gap-2 text-[#aaa8c4] transition-colors hover:text-[#e08dff]"
          >
            <span className="material-symbols-outlined text-base">
              arrow_back
            </span>
            <span className="text-xs font-bold uppercase tracking-[0.25em]">
              Powrót do menu
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#8ff5ff] shadow-[0_0_12px_rgba(143,245,255,0.6)]" />
            <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#8ff5ff]">
              System online
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
};
