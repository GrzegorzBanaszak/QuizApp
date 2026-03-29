import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { CharacterActionBar } from "../components/CharacterActionBar";
import { CharacterAvatarPicker } from "../components/CharacterAvatarPicker";
import { CharacterCreationHero } from "../components/CharacterCreationHero";
import { CharacterNameField } from "../components/CharacterNameField";
import { CharacterSystemNotice } from "../components/CharacterSystemNotice";
import { authAvatars } from "../data/authMockData";
import { loginAsGuest, registerSocial } from "../services/authApi";
import { useAuthStore } from "../store/authStore";

export const CreateCharacterPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const pendingSocialLogin = useAuthStore((state) => state.pendingSocialLogin);
  const setSession = useAuthStore((state) => state.setSession);
  const setPendingSocialLogin = useAuthStore(
    (state) => state.setPendingSocialLogin,
  );
  const setError = useAuthStore((state) => state.setError);
  const error = useAuthStore((state) => state.error);

  const isGuestRoute = searchParams.get("mode") === "guest";
  const isGuestFlow = isGuestRoute || !pendingSocialLogin;

  const [name, setName] = useState(pendingSocialLogin?.profile.name ?? "");
  const [selectedAvatarId, setSelectedAvatarId] = useState<string | null>(
    isGuestFlow ? authAvatars[0]?.id ?? null : null,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isGuestRoute) {
      setPendingSocialLogin(null);
      setError(null);
      setName("");
      setSelectedAvatarId(authAvatars[0]?.id ?? null);
      return;
    }

    if (pendingSocialLogin?.profile.name) {
      setName((currentName) => currentName || pendingSocialLogin.profile.name);
      setSelectedAvatarId(null);
    }
  }, [isGuestRoute, pendingSocialLogin, setError, setPendingSocialLogin]);

  const selectedAvatar = useMemo(
    () => authAvatars.find((avatar) => avatar.id === selectedAvatarId) ?? null,
    [selectedAvatarId],
  );

  const activeAvatarUrl =
    selectedAvatar?.image ??
    (isGuestFlow ? authAvatars[0]?.image ?? "" : pendingSocialLogin?.profile.avatarUrl ?? "");
  const activeAvatarBadge =
    selectedAvatar?.badge ??
    (isGuestFlow
      ? "GUEST"
      : pendingSocialLogin?.provider.toUpperCase() ?? "NEW");
  const activeAvatarName =
    selectedAvatar?.name ??
    (isGuestFlow ? "Konto gościa" : pendingSocialLogin?.profile.name ?? "Bezimienny gracz");
  const avatarSourceLabel = isGuestFlow
    ? "Konto gościa"
    : pendingSocialLogin
    ? `Profil z ${pendingSocialLogin.provider}`
    : "Profil źródłowy";
  const submitLabel = isGuestFlow ? "UTWÓRZ KONTO GOŚCIA" : "UTWÓRZ POSTAĆ";

  const isReady = name.trim().length > 0;

  const handleCreateCharacter = async () => {
    setError(null);
    setIsSubmitting(true);

    try {
      const response = isGuestFlow
        ? await loginAsGuest({
            customUsername: name.trim(),
            customAvatarUrl: selectedAvatar?.image ?? authAvatars[0]?.image ?? "",
          })
        : await registerSocial({
            provider: pendingSocialLogin!.provider,
            providerToken: pendingSocialLogin!.providerToken,
            customUsername: name.trim(),
            customAvatarUrl:
              selectedAvatar?.image ?? pendingSocialLogin!.profile.avatarUrl,
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

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-4xl flex-col justify-center gap-8">
        <CharacterCreationHero
          title="Stwórz nową postać"
          description={
            isGuestFlow
              ? "Stwórz konto gościa i wybierz avatar z dostępnych presetów."
              : "Zdefiniuj pseudonim i zdecyduj, czy zostawiasz zdjęcie z social media jako avatar, czy wybierasz jeden z presetów."
          }
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
                      Aktywna postać
                    </p>
                    <h2 className="mt-1 font-headline text-2xl font-black tracking-[-0.03em] text-[#f4d5ff]">
                      {name.trim() || "Bezimienny gracz"}
                    </h2>
                    <p className="mt-1 text-sm text-[#aaa8c4]">
                      To jest aktualny avatar. Zmiana presetu nadpisze zdjęcie z
                      social media.
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
                    {isGuestFlow ? "Tryb gościa" : `${authAvatars.length} presetów`}
                  </span>
                </div>
              </div>

              <CharacterNameField value={name} onChange={setName} />

              <CharacterAvatarPicker
                avatars={authAvatars}
                selectedAvatarId={selectedAvatarId}
                onSelectAvatar={setSelectedAvatarId}
                onResetToSourceAvatar={() => setSelectedAvatarId(null)}
                showResetToSourceAvatar={!isGuestFlow}
              />

              <CharacterActionBar
                isSubmitting={isSubmitting}
                isReady={isReady}
                canSubmit={isGuestFlow || Boolean(pendingSocialLogin)}
                submitLabel={submitLabel}
                onSubmit={handleCreateCharacter}
              />
            </div>
          </section>

          <CharacterSystemNotice error={error} isGuestFlow={isGuestFlow} />
        </main>
      </div>
    </div>
  );
};
