import { CategoryGrid } from "./CategoryGrid";
import { ProfileSetupPanel } from "./ProfileSetupPanel";
import { ProfileSummaryPanel } from "./ProfileSummaryPanel";
import { singleplayerMockData, useSingleplayerStore } from "../store/singleplayerStore";

export const SingleplayerHomeView = () => {
  const draftName = useSingleplayerStore((state) => state.draftName);
  const selectedAvatarId = useSingleplayerStore((state) => state.selectedAvatarId);
  const selectedCategoryId = useSingleplayerStore(
    (state) => state.selectedCategoryId,
  );
  const profile = useSingleplayerStore((state) => state.profile);
  const setDraftName = useSingleplayerStore((state) => state.setDraftName);
  const setSelectedAvatarId = useSingleplayerStore(
    (state) => state.setSelectedAvatarId,
  );
  const setSelectedCategoryId = useSingleplayerStore(
    (state) => state.setSelectedCategoryId,
  );
  const saveProfile = useSingleplayerStore((state) => state.saveProfile);
  const editProfile = useSingleplayerStore((state) => state.editProfile);
  const goToLevelSelect = useSingleplayerStore((state) => state.goToLevelSelect);

  const selectedAvatar =
    singleplayerMockData.avatars.find(
      (avatar) => avatar.id === (profile?.avatarId ?? selectedAvatarId),
    ) ?? singleplayerMockData.avatars[0];
  const subtitle = profile
    ? `Witaj ponownie, ${profile.name}. Wybierz wyzwanie na dziś.`
    : "Przygotuj się do rozgrywki, bohaterze.";

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-6 pb-40 pt-12">
      <section className="mb-20">
        <div className="mb-10">
          <h1 className="font-headline bg-gradient-to-r from-[#e08dff] via-[#d978ff] to-[#ff68a7] bg-clip-text text-4xl font-black tracking-[-0.04em] text-transparent md:text-5xl">
            SINGLEPLAYER LOBBY
          </h1>
          <p className="mt-2 text-lg text-[#aaa8c4]">{subtitle}</p>
        </div>

        {profile ? (
          <ProfileSummaryPanel
            avatar={selectedAvatar}
            profile={profile}
            onEdit={editProfile}
          />
        ) : (
          <ProfileSetupPanel
            draftName={draftName}
            avatars={singleplayerMockData.avatars}
            selectedAvatarId={selectedAvatarId}
            onDraftNameChange={setDraftName}
            onSelectAvatar={setSelectedAvatarId}
            onSave={saveProfile}
          />
        )}
      </section>

      <section>
        <div className="mb-8 flex items-center justify-between">
          <h2 className="font-headline text-3xl font-bold tracking-tight">
            Kategorie Quizu
          </h2>
          <div className="hidden items-center gap-2 text-[#8ff5ff] md:flex">
            <span className="material-symbols-outlined text-base">group</span>
            <span className="text-sm font-bold uppercase tracking-widest">
              124 graczy online
            </span>
          </div>
        </div>

        <CategoryGrid
          categories={singleplayerMockData.categories}
          selectedCategoryId={selectedCategoryId}
          onSelect={setSelectedCategoryId}
        />
      </section>

      <div className="mt-16 flex justify-center">
        <button
          type="button"
          onClick={goToLevelSelect}
          disabled={!profile}
          className="group relative overflow-hidden rounded-full bg-gradient-to-r from-[#e08dff] to-[#d978ff] px-12 py-5 shadow-[0_0_40px_rgba(224,141,255,0.4)] transition-all hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span className="relative z-10 flex items-center gap-3 font-headline text-xl font-black tracking-tight text-[#4f006c]">
            WYBIERZ POZIOM
            <span className="material-symbols-outlined transition-transform group-hover:translate-x-2">
              bolt
            </span>
          </span>
          <div className="absolute inset-0 translate-y-full bg-white/20 transition-transform group-hover:translate-y-0" />
        </button>
      </div>
    </main>
  );
};
