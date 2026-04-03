import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router";
import { CharacterActionBar } from "../components/CharacterActionBar";
import { CharacterAvatarPicker } from "../components/CharacterAvatarPicker";
import { CharacterCreationHero } from "../components/CharacterCreationHero";
import { CharacterNameField } from "../components/CharacterNameField";
import { CharacterSystemNotice } from "../components/CharacterSystemNotice";
import {
  fetchCreateCharacterAvatars,
  registerSocial,
} from "../services/authApi";
import { useAuthStore } from "../store/authStore";
import type { AuthAvatarOption } from "../types";

export const CreateCharacterPage = () => {
  const navigate = useNavigate();
  const pendingSocialLogin = useAuthStore((state) => state.pendingSocialLogin);
  const isAuthInitialized = useAuthStore((state) => state.isAuthInitialized);
  const setSession = useAuthStore((state) => state.setSession);
  const setPendingSocialLogin = useAuthStore(
    (state) => state.setPendingSocialLogin,
  );
  const setError = useAuthStore((state) => state.setError);
  const error = useAuthStore((state) => state.error);

  const [name, setName] = useState("");
  const [availableAvatars, setAvailableAvatars] = useState<AuthAvatarOption[]>(
    [],
  );
  const [selectedAvatarId, setSelectedAvatarId] = useState<number | null>(null);
  const [isLoadingAvatars, setIsLoadingAvatars] = useState(true);
  const [avatarLoadError, setAvatarLoadError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isCancelled = false;

    const loadAvatars = async () => {
      setIsLoadingAvatars(true);
      setAvatarLoadError(null);

      try {
        const avatars = await fetchCreateCharacterAvatars();

        if (!isCancelled) {
          setAvailableAvatars(avatars);
        }
      } catch (loadError) {
        if (!isCancelled) {
          setAvailableAvatars([]);
          setAvatarLoadError(
            loadError instanceof Error
              ? loadError.message
              : "Nie udało się pobrać avatarów startowych.",
          );
        }
      } finally {
        if (!isCancelled) {
          setIsLoadingAvatars(false);
        }
      }
    };

    void loadAvatars();

    return () => {
      isCancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!pendingSocialLogin) {
      return;
    }

    setName(pendingSocialLogin.profile.name);
  }, [pendingSocialLogin]);

  useEffect(() => {
    if (availableAvatars.length === 0) {
      setSelectedAvatarId(null);
      return;
    }

    setSelectedAvatarId((currentValue) => {
      if (
        currentValue !== null &&
        availableAvatars.some((avatar) => avatar.id === currentValue)
      ) {
        return currentValue;
      }

      return availableAvatars[0]?.id ?? null;
    });
  }, [availableAvatars]);

  if (!isAuthInitialized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0c0c21] text-[#e5e3ff]">
        <div className="glass-panel rounded-[2rem] px-8 py-6 text-center">
          <p className="font-headline text-lg font-bold">Ładowanie profilu...</p>
        </div>
      </div>
    );
  }

  if (!pendingSocialLogin) {
    return <Navigate to="/" replace />;
  }

  const selectedAvatar =
    availableAvatars.find((avatar) => avatar.id === selectedAvatarId) ?? null;

  const activeAvatarUrl =
    selectedAvatar?.imageUrl ?? pendingSocialLogin.profile.avatarUrl;
  const activeAvatarBadge = selectedAvatar?.unlockType ?? "SOCIAL";
  const activeAvatarName = selectedAvatar?.name ?? pendingSocialLogin.profile.name;
  const avatarSourceLabel = selectedAvatar
    ? selectedAvatar.name
    : "Avatar z konta społecznościowego";
  const submitLabel = "UTWÓRZ POSTAĆ";
  const loadingLabel = "TWORZENIE...";
  const isReady = name.trim().length > 0;

  const handleCreateProfile = async () => {
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await registerSocial({
        provider: pendingSocialLogin.provider,
        providerToken: pendingSocialLogin.providerToken,
        customUsername: name.trim(),
        selectedAvatarId,
      });

      setSession({ profile: response.profile });
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

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-4xl flex-col justify-center gap-8">
        <CharacterCreationHero
          eyebrow="Pierwsze logowanie"
          title="Utwórz postać"
          description="To jest pierwszy krok po logowaniu przez Google lub Facebook. Wybierz nazwę i avatar, a dopiero potem zapisz profil."
        />

        <main className="flex flex-col gap-6">
          <section className="glass-panel rounded-[2rem] p-6 sm:p-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center gap-5 rounded-[2rem] bg-[#171730]/60 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="h-20 w-20 overflow-hidden rounded-full bg-[#232341] ring-4 ring-[#e08dff] shadow-[0_0_24px_rgba(224,141,255,0.35)]">
                      <img
                        src={activeAvatarUrl}
                        alt={activeAvatarName}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="absolute -bottom-1 -right-1 rounded-full bg-[#ff68a7] px-2 py-1 text-[10px] font-black tracking-tight text-[#460024] shadow-lg">
                      {activeAvatarBadge}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#8ff5ff]">
                      Nowy profil
                    </p>
                    <h2 className="mt-1 font-headline text-2xl font-black tracking-[-0.03em] text-[#f4d5ff]">
                      {name.trim() || "Bezimienny gracz"}
                    </h2>
                    <p className="mt-1 text-sm text-[#aaa8c4]">
                      To jest avatar startowy. Możesz go zmienić przed utworzeniem
                      postaci.
                    </p>
                    <div className="mt-3 inline-flex rounded-full bg-[#8ff5ff]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#8ff5ff]">
                      {avatarSourceLabel}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 rounded-full bg-[#8ff5ff]/10 px-3 py-2 text-[#8ff5ff]">
                  <span className="material-symbols-outlined text-base">
                    bolt
                  </span>
                  <span className="text-xs font-black uppercase tracking-[0.2em]">
                    {availableAvatars.length} presetów
                  </span>
                </div>
              </div>

              <CharacterNameField value={name} onChange={setName} />

              {isLoadingAvatars ? (
                <div className="rounded-[1.5rem] border border-white/10 bg-[#171730]/60 px-4 py-6 text-sm text-[#aaa8c4]">
                  Ładowanie dostępnych avatarów...
                </div>
              ) : (
                <CharacterAvatarPicker
                  avatars={availableAvatars}
                  selectedAvatarId={selectedAvatarId}
                  onSelectAvatar={(avatarId) =>
                    setSelectedAvatarId(
                      typeof avatarId === "number" ? avatarId : null,
                    )
                  }
                  onResetToSourceAvatar={() => setSelectedAvatarId(null)}
                  showResetToSourceAvatar={Boolean(selectedAvatarId)}
                />
              )}

              <CharacterActionBar
                isSubmitting={isSubmitting}
                isReady={isReady}
                canSubmit={Boolean(pendingSocialLogin) && availableAvatars.length > 0}
                submitLabel={submitLabel}
                loadingLabel={loadingLabel}
                onSubmit={handleCreateProfile}
              />
            </div>
          </section>

          <CharacterSystemNotice
            title="Tworzenie postaci"
            description="Dopiero po zapisaniu tego formularza konto społecznościowe zostanie zamienione na pełny profil użytkownika."
            error={error ?? avatarLoadError}
          />
        </main>
      </div>
    </div>
  );
};
