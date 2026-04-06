import { Link } from "react-router";
import type { UserProfileDto } from "../../auth/types";
import type { AchievementCatalogStats } from "./achievementCatalogUtils";
import { formatAchievementNumber } from "./achievementCatalogUtils";

export const AchievementCatalogHero = ({
  profile,
  stats,
}: {
  profile: UserProfileDto;
  stats: AchievementCatalogStats;
}) => (
  <section className="relative overflow-hidden rounded-[2.25rem] bg-[linear-gradient(135deg,rgba(23,23,48,0.95)_0%,rgba(12,12,33,0.88)_55%,rgba(35,35,65,0.92)_100%)] p-6 shadow-[0_24px_80px_rgba(5,8,22,0.42)] ring-1 ring-white/8 md:p-8 lg:p-10">
    <div className="pointer-events-none absolute -left-12 top-0 h-44 w-44 rounded-full bg-[#e08dff]/12 blur-[80px]" />
    <div className="pointer-events-none absolute -right-8 top-10 h-36 w-36 rounded-full bg-[#ff68a7]/12 blur-[90px]" />

    <div className="relative flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
      <div className="max-w-4xl">
        <p className="text-xs font-black uppercase tracking-[0.34em] text-[#8ff5ff]">
          Postep kariery
        </p>
        <h1 className="mt-4 font-headline text-5xl font-black uppercase leading-none tracking-[-0.06em] text-[#f4d5ff] sm:text-6xl lg:text-8xl">
          Twoje{" "}
          <span className="bg-gradient-to-r from-[#e08dff] via-[#f1a3ff] to-[#ff68a7] bg-clip-text text-transparent">
            osiagniecia
          </span>
        </h1>
        <p className="mt-5 max-w-3xl text-sm leading-7 text-[#aaa8c4] md:text-base">
          Strona renderuje katalog z backendu `GET /api/achievements` i pokazuje
          realny progres, stany odblokowania, nagrody oraz elitarne wyroznienia
          przypisane do konta gracza.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <HeroMetric
            icon="emoji_events"
            iconClassName="text-[#e08dff]"
            label="Odblokowane"
            value={`${stats.unlocked} / ${stats.total}`}
          />
          <HeroMetric
            icon="stars"
            iconClassName="text-[#8ff5ff]"
            label="XP z osiagniec"
            value={formatAchievementNumber(stats.achievementExperience)}
          />
        </div>
      </div>

      <div className="glass-panel w-full max-w-sm rounded-[2rem] p-5 ring-1 ring-white/10">
        <div className="flex items-center gap-4">
          <div className="relative h-[4.5rem] w-[4.5rem] flex-shrink-0 overflow-hidden rounded-[1.5rem] bg-[#171730] ring-2 ring-[#e08dff]/35">
            <img
              src={profile.avatarUrl}
              alt={profile.username}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-x-3 bottom-2 h-1 rounded-full bg-gradient-to-r from-[#e08dff] to-[#ff68a7]" />
          </div>

          <div className="min-w-0">
            <p className="text-[10px] font-black uppercase tracking-[0.26em] text-[#aaa8c4]">
              Profil gracza
            </p>
            <h2 className="mt-1 truncate font-headline text-2xl font-black tracking-tight text-[#f4d5ff]">
              {profile.username}
            </h2>
            <p className="mt-1 text-sm text-[#aaa8c4]">
              Osiagniecia zsynchronizowane z profilem i postepem solo.
            </p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <ProfileMetric
            label="XP gracza"
            value={formatAchievementNumber(profile.totalExperience)}
          />
          <ProfileMetric
            label="Monety"
            value={formatAchievementNumber(profile.coins)}
          />
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            to="/singleplayer"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#e08dff] to-[#ff68a7] px-5 py-3 text-xs font-black uppercase tracking-[0.18em] text-[#4f006c] transition-transform hover:scale-[1.02] active:scale-95"
          >
            Graj dalej
            <span className="material-symbols-outlined text-base">
              play_circle
            </span>
          </Link>
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full bg-white/5 px-5 py-3 text-xs font-black uppercase tracking-[0.18em] text-[#8ff5ff] ring-1 ring-white/10 transition-colors hover:bg-white/10"
          >
            Powrot
          </Link>
        </div>
      </div>
    </div>

    <div className="relative mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
      <StatTile label="Wszystkie" value={stats.total} tone="violet" />
      <StatTile label="W toku" value={stats.inProgress} tone="pink" />
      <StatTile label="Elitarne" value={stats.elite} tone="cyan" />
      <StatTile label="Nagrody avatar" value={stats.rewardAvatars} tone="gold" />
    </div>
  </section>
);

const HeroMetric = ({
  icon,
  iconClassName,
  label,
  value,
}: {
  icon: string;
  iconClassName: string;
  label: string;
  value: string;
}) => (
  <div className="glass-panel flex items-center gap-3 rounded-[1.6rem] px-5 py-4 ring-1 ring-white/10">
    <span className={`material-symbols-outlined text-2xl ${iconClassName}`}>
      {icon}
    </span>
    <div>
      <p className="text-[10px] font-black uppercase tracking-[0.26em] text-[#aaa8c4]">
        {label}
      </p>
      <p className="mt-1 font-headline text-2xl font-black text-[#f4d5ff]">
        {value}
      </p>
    </div>
  </div>
);

const ProfileMetric = ({
  label,
  value,
}: {
  label: string;
  value: string;
}) => (
  <div className="rounded-[1.4rem] bg-black/18 px-4 py-3">
    <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#aaa8c4]">
      {label}
    </p>
    <p className="mt-2 font-headline text-2xl font-black text-[#f4d5ff]">
      {value}
    </p>
  </div>
);

const StatTile = ({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "violet" | "pink" | "cyan" | "gold";
}) => {
  const toneClasses = {
    violet:
      "bg-gradient-to-r from-[#e08dff] to-[#d978ff] text-[#4f006c] shadow-[0_10px_28px_rgba(224,141,255,0.18)]",
    pink:
      "bg-gradient-to-r from-[#ff68a7] to-[#ff8fbf] text-[#460024] shadow-[0_10px_28px_rgba(255,104,167,0.18)]",
    cyan:
      "bg-gradient-to-r from-[#8ff5ff] to-[#00deec] text-[#003f43] shadow-[0_10px_28px_rgba(143,245,255,0.18)]",
    gold:
      "bg-gradient-to-r from-[#ffcf7d] to-[#ff9f4d] text-[#4c2a00] shadow-[0_10px_28px_rgba(255,207,125,0.18)]",
  } as const;

  return (
    <div className="rounded-[1.6rem] bg-black/16 p-4 ring-1 ring-white/8">
      <span
        className={`inline-flex rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.22em] ${toneClasses[tone]}`}
      >
        {label}
      </span>
      <p className="mt-4 font-headline text-3xl font-black text-[#f4d5ff]">
        {value}
      </p>
    </div>
  );
};
