import { Link, useLocation } from "react-router";
import { useAuthStore } from "../features/auth/store/authStore";
import { useSingleplayerStore } from "../features/singleplayer/store/singleplayerStore";

const leftLinks = [
  { label: "Strona glowna", to: "/" },
  { label: "Solo", to: "/singleplayer" },
  { label: "Multiplayer", to: "/multiplayer" },
  { label: "Party", to: "/party" },
];

export const AppNavigation = () => {
  const location = useLocation();
  const session = useAuthStore((state) => state.session);
  const screen = useSingleplayerStore((state) => state.screen);

  if (location.pathname === "/singleplayer" && screen === "gameplay") {
    return null;
  }

  return (
    <div className="z-50">
      <nav className="sticky top-0 hidden px-3 pt-3 md:block sm:px-4">
        <div className="glass-panel mx-auto flex w-full max-w-7xl items-center justify-between gap-6 rounded-[1.5rem] px-4 py-3 shadow-[0_18px_60px_rgba(5,8,22,0.28)] sm:px-5">
          <div className="flex items-center gap-2 overflow-x-auto pr-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {leftLinks.map((link) => {
              const isActive =
                link.to === "/"
                  ? location.pathname === "/"
                  : location.pathname === link.to ||
                    location.pathname.startsWith(`${link.to}/`);

              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold transition-colors ${
                    isActive
                      ? "bg-[#e08dff]/18 text-[#f4d5ff] ring-1 ring-[#e08dff]/35"
                      : "text-[#aaa8c4] hover:bg-white/5 hover:text-[#e5e3ff]"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            <Link
              to="/avatars"
              className={`flex h-11 items-center gap-2 rounded-full px-3 transition-colors ${
                location.pathname === "/avatars"
                  ? "bg-[#8ff5ff]/15 text-[#8ff5ff]"
                  : "text-[#aaa8c4] hover:bg-white/5 hover:text-[#e5e3ff]"
              }`}
              aria-label="Awatary"
            >
              <span className="material-symbols-outlined text-xl">face</span>
              <span className="hidden text-sm font-bold sm:inline">Awatary</span>
            </Link>

            <Link
              to="/achievements"
              className={`flex h-11 items-center gap-2 rounded-full px-3 transition-colors ${
                location.pathname === "/achievements"
                  ? "bg-[#ffcf7d]/15 text-[#ffcf7d]"
                  : "text-[#aaa8c4] hover:bg-white/5 hover:text-[#e5e3ff]"
              }`}
              aria-label="Osiagniecia"
            >
              <span className="material-symbols-outlined text-xl">
                emoji_events
              </span>
              <span className="hidden text-sm font-bold sm:inline">
                Osiagniecia
              </span>
            </Link>

            {session ? (
              <Link
                to="/profile/edit"
                className="flex max-w-[14rem] items-center gap-2 rounded-full bg-[#29294a] px-3 py-1.5 text-[#e5e3ff] ring-1 ring-white/10 transition-colors hover:bg-[#323255]"
                aria-label="Profil gracza"
              >
                <div className="h-8 w-8 overflow-hidden rounded-full ring-2 ring-[#e08dff]/50">
                  <img
                    src={session.profile.avatarUrl}
                    alt={session.profile.username}
                    className="h-full w-full object-cover"
                  />
                </div>
                <span className="max-w-[8rem] truncate text-sm font-bold">
                  {session.profile.username}
                </span>
              </Link>
            ) : (
              <Link
                to="/#login"
                className="inline-flex h-11 items-center gap-2 rounded-full bg-gradient-to-r from-[#e08dff] to-[#d978ff] px-4 font-black tracking-[0.16em] text-[#4f006c] transition-transform hover:scale-105 active:scale-95"
              >
                <span className="material-symbols-outlined text-xl">login</span>
                <span className="hidden sm:inline">Zaloguj</span>
              </Link>
            )}
          </div>
        </div>
      </nav>

      <nav className="fixed bottom-0 left-0 z-50 w-full md:hidden">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-1 rounded-t-[1.5rem] bg-[#111128]/92 px-2 py-2 shadow-[0_-12px_40px_rgba(5,8,22,0.35)] backdrop-blur-xl">
          {leftLinks.map((link) => {
            const isActive =
              link.to === "/"
                ? location.pathname === "/"
                : location.pathname === link.to ||
                  location.pathname.startsWith(`${link.to}/`);

            return (
              <Link
                key={link.to}
                to={link.to}
                className={`flex min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-[1rem] px-2 py-2 text-[10px] font-bold uppercase tracking-[0.18em] transition-colors ${
                  isActive
                    ? "bg-[#e08dff]/15 text-[#f4d5ff]"
                    : "text-[#aaa8c4] active:bg-white/5 active:text-[#e5e3ff]"
                }`}
                aria-label={link.label}
              >
                <span className="material-symbols-outlined text-xl">
                  {link.to === "/"
                    ? "home"
                    : link.to === "/singleplayer"
                      ? "bolt"
                      : link.to === "/multiplayer"
                        ? "group"
                        : "tv"}
                </span>
              </Link>
            );
          })}

          <Link
            to="/avatars"
            className={`flex min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-[1rem] px-2 py-2 text-[10px] font-bold uppercase tracking-[0.18em] transition-colors ${
              location.pathname === "/avatars"
                ? "bg-[#8ff5ff]/15 text-[#8ff5ff]"
                : "text-[#aaa8c4] active:bg-white/5 active:text-[#e5e3ff]"
            }`}
            aria-label="Awatary"
          >
            <span className="material-symbols-outlined text-xl">face</span>
          </Link>

          <Link
            to="/achievements"
            className={`flex min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-[1rem] px-2 py-2 text-[10px] font-bold uppercase tracking-[0.18em] transition-colors ${
              location.pathname === "/achievements"
                ? "bg-[#ffcf7d]/15 text-[#ffcf7d]"
                : "text-[#aaa8c4] active:bg-white/5 active:text-[#e5e3ff]"
            }`}
            aria-label="Osiagniecia"
          >
            <span className="material-symbols-outlined text-xl">
              emoji_events
            </span>
          </Link>

          {session ? (
            <Link
              to="/profile/edit"
              className="flex min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-[1rem] px-2 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#e5e3ff] transition-colors active:bg-white/5"
              aria-label="Profil gracza"
            >
              <div className="h-6 w-6 overflow-hidden rounded-full ring-1 ring-[#e08dff]/50">
                <img
                  src={session.profile.avatarUrl}
                  alt={session.profile.username}
                  className="h-full w-full object-cover"
                />
              </div>
            </Link>
          ) : (
            <Link
              to="/#login"
              className="flex min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-[1rem] px-2 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#4f006c] transition-colors"
              aria-label="Zaloguj"
            >
              <span className="material-symbols-outlined text-xl">login</span>
            </Link>
          )}
        </div>
      </nav>
    </div>
  );
};
