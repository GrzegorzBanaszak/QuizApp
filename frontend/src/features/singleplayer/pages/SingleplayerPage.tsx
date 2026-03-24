import { useState } from "react";
import { Link } from "react-router";

const avatars = [
  {
    id: "avatar-1",
    name: "Vector Pulse",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAzn_jdtwWQZE2rzf_58n0v6nw4RpICD9ES-z1vlFnvzKgf4rUhHTbxjGE1MlNwldEybnR4o1eqZbHXxhBW77M4LiTLgsX1EQ7JB9D7dBTJbpdW47iH28_BdXTJZuhL6xZex2Il1AyZEWXL-syxHAozXDXjUiAJHs0CGn2W3i_49vbTgSZnCaZ7Jn0c6tJK--HbbV5b9EOXP_jduDeYSQz2XBvu-6YxI-tyMwmaHEvuAt7GAIfn_D8MJF8SeYncGIvz5yWP4prLtlnN",
    badge: "Rookie",
  },
  {
    id: "avatar-2",
    name: "Neon Ninja",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC7nMCXNdvgdXP8RJ6TRf53gQlOY2mIVaU9SR2D4QlLtbsp7lmHyHsQ2mqbbUvaBsJTSO44lPhBLQp9Kj99X9A4tzkjFNdkVqLuC1Lchd6glRoAwt9W_nGFhMv0JDuQJifGKkJkQBENExnkBKkWCPC2JhEsCeJLqbqITdqOiADDlkiwxiBCpRAZjem5MkGQshmBIfZG7gYPuFkV_5CEM5i-6vsgoXn5PmNfHi0uz0AOEBRVHLg8LHOS7sp6lq_3H_y6MP7e8QoPmZ_X",
    badge: "PRO",
  },
  {
    id: "avatar-3",
    name: "Data Diver",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBSE6yXo_zLP2aPXCKskANm7HA1i68JOy_Rwx2o0bUnRYfaqWrKJOvLMhxBajDBlSIQj1e1I3ltqjr4lsIb2vxArJusPzm2cIsn0CLIxq7uwytKgPhMW6uC7SYlF8UqsKp_NB4AoPlTbdzFH-nN1mhwHj5x3uaSKPUBVbYLR8MF2jbsa_Fr0CYB3pFQGWRMy9yX0WYgo_tDaSX0Mao7eZCrI3Ne4X7AOcI1Ur9OAO3RmDHB2FNnUQuWfJ9ogYOW2tSIB1t_Tu8z_yBu",
    badge: "Scout",
  },
  {
    id: "avatar-4",
    name: "Pulse Rider",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD4GMLxOfSm8UeCZ4WmhmekoZgzRr3tMIYWnwNTmWLNxLL7J0rHutBpuX3G3iZOb3Fp6sQ8ez2DwoEg2fcejfaNZB7Llys2pA0N9lGo1ec0bxopbeLty0VAiydsvzOAdmMZ9jG_k8tb4OOxv67n1wQsL0GagzdXwsQIt2jKjRZfMyvy7nV_P0x4Y73HUahl177Rq5aG7BW_BqeKyRzAVokLRg8_UQ4J3yEJn4rTKuU5gfSy4Pkb7fDt6tnkSerHtxZoKiC4lZ-J0jeI",
    badge: "Elite",
  },
  {
    id: "avatar-5",
    name: "Static Ghost",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCF1TxvdaA_E3oLMka1Mc78dRsn5DgDIxS2od3lLmLUasdKb0lcLOjI9IevJJyYe6mwUoxGTDae8F2ZCIYk1knCJelZaVaosInAhuVVK9Qr-CCqXvRkaTew_v5qUQBihXFfjzkYpISYn45GJnjw4IXDgQZfrfdIWLdBe9r8bOoP2RW6SbFGHNHSjYR3-VDEH5-qSAdf8RXnAJEXsaMsTEP6vp59IX5Kb7-0LQ_hYOBu1gGXdaKetCSU5l1RUW5jFHAbhdeqBMyPDUNQ",
    badge: "Mythic",
  },
];

const categories = [
  {
    title: "Popkultura",
    icon: "movie_filter",
    description: "Filmy, seriale i trendy z całego świata.",
    difficulty: "Łatwy",
    accent: "bg-[#e08dff]",
    iconTone: "text-[#e08dff]",
    iconSurface: "bg-[#e08dff]/10",
    difficultyTone: "bg-emerald-500/10 text-emerald-400 ring-emerald-500/30",
  },
  {
    title: "Historia",
    icon: "history_edu",
    description: "Wielkie bitwy, władcy i epokowe wydarzenia.",
    difficulty: "Średni",
    accent: "bg-[#ff68a7]",
    iconTone: "text-[#ff68a7]",
    iconSurface: "bg-[#ff68a7]/10",
    difficultyTone: "bg-yellow-500/10 text-yellow-400 ring-yellow-500/30",
  },
  {
    title: "Nauka",
    icon: "science",
    description: "Od fizyki kwantowej po biologię morską.",
    difficulty: "Trudny",
    accent: "bg-[#8ff5ff]",
    iconTone: "text-[#8ff5ff]",
    iconSurface: "bg-[#8ff5ff]/10",
    difficultyTone: "bg-orange-500/10 text-orange-400 ring-orange-500/30",
  },
  {
    title: "Gry",
    icon: "sports_esports",
    description: "Klasyki arcade i nowoczesne hity AAA.",
    difficulty: "Legendarny",
    accent: "bg-[#bc00fb]",
    iconTone: "text-[#bc00fb]",
    iconSurface: "bg-[#bc00fb]/10",
    difficultyTone: "bg-red-500/10 text-red-400 ring-red-500/40",
  },
];

export const SingleplayerPage = () => {
  const [draftName, setDraftName] = useState("");
  const [selectedAvatarId, setSelectedAvatarId] = useState("avatar-1");
  const [profile, setProfile] = useState<{
    name: string;
    avatarId: string;
    level: number;
    xp: string;
  } | null>(null);

  const selectedAvatar =
    avatars.find((avatar) => avatar.id === (profile?.avatarId ?? selectedAvatarId)) ??
    avatars[0];

  const handleSaveProfile = () => {
    const trimmedName = draftName.trim();
    if (!trimmedName) return;

    setProfile({
      name: trimmedName,
      avatarId: selectedAvatarId,
      level: 42,
      xp: "2.4k XP",
    });
  };

  const handleEditProfile = () => {
    setDraftName(profile?.name ?? "");
    setSelectedAvatarId(profile?.avatarId ?? selectedAvatarId);
    setProfile(null);
  };

  const subtitle = profile
    ? `Witaj ponownie, ${profile.name}. Wybierz wyzwanie na dziś.`
    : "Przygotuj się do rozgrywki, bohaterze.";

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#0c0c21] text-[#e5e3ff]">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[-10%] top-[-10%] h-[50%] w-[50%] rounded-full bg-[#e08dff]/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[50%] w-[50%] rounded-full bg-[#ff68a7]/10 blur-[120px]" />
      </div>

      <main className="mx-auto min-h-screen max-w-5xl px-6 pb-40 pt-12">
        <section className="mb-20">
          <div className="mb-10">
            <h1 className="font-headline bg-gradient-to-r from-[#e08dff] via-[#d978ff] to-[#ff68a7] bg-clip-text text-4xl font-black tracking-[-0.04em] text-transparent md:text-5xl">
              SINGLEPLAYER LOBBY
            </h1>
            <p className="mt-2 text-lg text-[#aaa8c4]">{subtitle}</p>
          </div>

          {profile ? (
            <div className="glass-panel rounded-[2rem] p-12 shadow-[0_0_30px_rgba(224,141,255,0.18)]">
              <div className="flex flex-col items-center justify-center">
                <div className="relative mb-6">
                  <div className="h-40 w-40 overflow-hidden rounded-full ring-4 ring-[#e08dff] shadow-[0_0_30px_rgba(138,43,226,0.8)]">
                    <img
                      src={selectedAvatar.image}
                      alt={selectedAvatar.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="absolute bottom-0 right-4 rounded-full bg-[#ff68a7] px-3 py-1 text-xs font-black tracking-tight text-[#460024] shadow-lg">
                    {selectedAvatar.badge}
                  </div>
                </div>

                <div className="text-center">
                  <h2 className="font-headline mb-2 text-5xl font-black tracking-[-0.04em] text-[#e5e3ff]">
                    {profile.name}
                  </h2>
                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <span className="inline-flex items-center rounded-full bg-[#e08dff]/20 px-4 py-1.5 text-sm font-bold uppercase tracking-widest text-[#e08dff] ring-1 ring-[#e08dff]/40">
                      Level {profile.level}
                    </span>
                    <div className="flex items-center gap-1 text-[#8ff5ff]">
                      <span className="material-symbols-outlined text-sm">
                        bolt
                      </span>
                      <span className="text-xs font-black uppercase tracking-widest">
                        {profile.xp}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleEditProfile}
                  className="mt-8 rounded-full bg-white/6 px-6 py-3 text-sm font-bold uppercase tracking-[0.2em] text-[#e5e3ff] ring-1 ring-white/10 transition-all hover:bg-white/10"
                >
                  Zmień postać
                </button>
              </div>
            </div>
          ) : (
            <div className="glass-panel grid grid-cols-1 items-center gap-10 rounded-[2rem] p-8 shadow-[0_0_30px_rgba(224,141,255,0.18)] lg:grid-cols-12">
              <div className="lg:col-span-5">
                <label
                  htmlFor="nickname"
                  className="mb-3 block px-1 text-sm font-bold uppercase tracking-widest text-[#e08dff]"
                >
                  Twój Nick
                </label>
                <div className="group relative">
                  <input
                    id="nickname"
                    type="text"
                    value={draftName}
                    maxLength={20}
                    onChange={(event) => setDraftName(event.target.value)}
                    placeholder="Wpisz swoje imię..."
                    className="w-full rounded-[2rem] bg-black/30 px-6 py-4 text-xl font-bold text-[#e5e3ff] outline-none ring-1 ring-white/10 transition-all placeholder:text-[#74738d] focus:ring-2 focus:ring-[#e08dff]"
                  />
                  <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#e08dff] opacity-50">
                    <span className="material-symbols-outlined">edit</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7">
                <label className="mb-4 block px-1 text-sm font-bold uppercase tracking-widest text-[#ff68a7]">
                  Wybierz Awatar
                </label>
                <div className="flex flex-wrap gap-4">
                  {avatars.map((avatar) => {
                    const isActive = avatar.id === selectedAvatarId;

                    return (
                      <button
                        key={avatar.id}
                        type="button"
                        onClick={() => setSelectedAvatarId(avatar.id)}
                        className="group relative cursor-pointer"
                      >
                        <div
                          className={`h-16 w-16 overflow-hidden rounded-full transition-all group-hover:scale-105 ${
                            isActive
                              ? "opacity-100 ring-2 ring-[#e08dff] shadow-[0_0_15px_rgba(224,141,255,0.5)]"
                              : "opacity-45 ring-1 ring-white/15 hover:opacity-100 hover:ring-[#e08dff]"
                          }`}
                        >
                          <img
                            src={avatar.image}
                            alt={avatar.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      </button>
                    );
                  })}

                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#232341] text-[#74738d] ring-1 ring-white/10 transition-colors hover:text-[#e08dff]">
                    <span className="material-symbols-outlined">add</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-12">
                <button
                  type="button"
                  onClick={handleSaveProfile}
                  disabled={!draftName.trim()}
                  className="rounded-full bg-gradient-to-r from-[#e08dff] to-[#d978ff] px-8 py-4 font-headline text-sm font-black tracking-[0.2em] text-[#4f006c] shadow-[0_0_30px_rgba(224,141,255,0.35)] transition-all hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  ZAPISZ POSTAĆ
                </button>
              </div>
            </div>
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

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => (
              <button
                key={category.title}
                type="button"
                className="group relative overflow-hidden rounded-[2rem] bg-[#171730] p-6 text-left transition-all hover:-translate-y-2 hover:bg-[#29294a]"
              >
                <div className={`absolute left-0 top-0 h-full w-1 ${category.accent}`} />
                <div className="flex h-full flex-col">
                  <div
                    className={`mb-6 flex h-12 w-12 items-center justify-center rounded-[1.25rem] ${category.iconSurface} ${category.iconTone} transition-transform group-hover:scale-110`}
                  >
                    <span className="material-symbols-outlined text-3xl">
                      {category.icon}
                    </span>
                  </div>
                  <h3 className="font-headline mb-2 text-xl font-bold">
                    {category.title}
                  </h3>
                  <p className="mb-6 text-sm leading-relaxed text-[#aaa8c4]">
                    {category.description}
                  </p>
                  <div className="mt-auto">
                    <span
                      className={`inline-flex rounded-[1.5rem] px-3 py-1 text-[10px] font-black uppercase tracking-widest ring-1 ${category.difficultyTone}`}
                    >
                      {category.difficulty}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>

        <div className="mt-16 flex justify-center">
          <button
            type="button"
            className="group relative overflow-hidden rounded-full bg-gradient-to-r from-[#e08dff] to-[#d978ff] px-12 py-5 shadow-[0_0_40px_rgba(224,141,255,0.4)] transition-all hover:scale-105 active:scale-95"
          >
            <span className="relative z-10 flex items-center gap-3 font-headline text-xl font-black tracking-tight text-[#4f006c]">
              ROZPOCZNIJ GRĘ
              <span className="material-symbols-outlined transition-transform group-hover:translate-x-2">
                bolt
              </span>
            </span>
            <div className="absolute inset-0 translate-y-full bg-white/20 transition-transform group-hover:translate-y-0" />
          </button>
        </div>
      </main>

      <nav className="fixed bottom-0 left-0 z-50 flex w-full justify-center px-6 pb-8">
        <div className="flex items-center gap-8 rounded-full bg-[#111128]/80 px-6 py-4 shadow-[0_-4px_40px_rgba(224,141,255,0.08)] ring-1 ring-white/10 backdrop-blur-xl">
          <Link
            to="/"
            className="group flex items-center justify-center rounded-full bg-purple-900/30 px-8 py-3 text-purple-200 ring-1 ring-purple-500/20 transition-all duration-300 hover:bg-purple-800/20 hover:text-purple-100 active:scale-90"
          >
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-xl">
                arrow_back
              </span>
              <span className="text-sm font-bold tracking-tight">Powrót</span>
            </div>
          </Link>
          <div className="h-6 w-px bg-white/10" />
          <span className="hidden text-xs font-bold uppercase tracking-[0.2em] text-[#aaa8c4] sm:block">
            Wróć do trybów
          </span>
        </div>
      </nav>
    </div>
  );
};
