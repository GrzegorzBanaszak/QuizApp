import { useMemo } from "react";
import { Link } from "react-router";
import { useSingleplayerStore } from "../store/singleplayerStore";

export const ResultView = () => {
  const selectedLevelName = useSingleplayerStore(
    (state) => state.selectedLevelName,
  );
  const answerSelections = useSingleplayerStore(
    (state) => state.answerSelections,
  );
  const gameSession = useSingleplayerStore((state) => state.gameSession);
  const resultSummary = useSingleplayerStore((state) => state.resultSummary);
  const replay = useSingleplayerStore((state) => state.replay);
  const goToLevelSelect = useSingleplayerStore(
    (state) => state.goToLevelSelect,
  );

  const details = useMemo(() => {
    if (!gameSession || !resultSummary) {
      return [];
    }

    return resultSummary.details.map((detail, index) => {
      const question = gameSession.questions.find(
        (item) => item.id === detail.questionId,
      );
      const playerSelection = answerSelections.find(
        (selection) => selection.questionId === detail.questionId,
      );
      const correctAnswer = question?.answers.find(
        (answer) => answer.id === detail.correctAnswerId,
      );
      const selectedAnswer = question?.answers.find(
        (answer) => answer.id === playerSelection?.selectedAnswerId,
      );

      return {
        id: detail.questionId,
        order: index + 1,
        prompt: question?.text ?? `Pytanie ${index + 1}`,
        isCorrect: detail.isCorrect,
        correctAnswerText: correctAnswer?.text ?? "Brak danych",
        selectedAnswerText: selectedAnswer?.text ?? "Brak odpowiedzi",
      };
    });
  }, [answerSelections, gameSession, resultSummary]);

  const unlockedAchievements = resultSummary?.unlockedAchievements ?? [];

  if (!resultSummary) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0c0c21] px-6 text-[#e5e3ff]">
        <div className="glass-panel w-full max-w-2xl rounded-[2rem] px-10 py-12 text-center">
          <h1 className="font-headline text-3xl font-black tracking-tight text-[#f4d5ff]">
            Wynik nie jest jeszcze dostepny
          </h1>
          <p className="mt-3 text-[#aaa8c4]">
            Nie udalo sie odczytac podsumowania rozgrywki.
          </p>
          <button
            type="button"
            onClick={goToLevelSelect}
            className="mt-8 rounded-full border border-white/10 px-8 py-4 font-bold text-[#e5e3ff]"
          >
            Wroc do poziomow
          </button>
        </div>
      </div>
    );
  }

  const accuracy = Math.round(
    (resultSummary.correctAnswersCount /
      Math.max(1, resultSummary.totalQuestions)) *
      100,
  );
  const rank = resolveRank(accuracy);
  const rankAccent = resolveRankAccent(accuracy);

  return (
    <div className="min-h-screen bg-[#0c0c21] pb-24 text-[#e5e3ff] md:pb-12">
      <main className="mx-auto mb-12 grid max-w-7xl grid-cols-1 gap-8 px-6 pt-12 lg:grid-cols-12">
        <section className="space-y-8 lg:col-span-7">
          <div className="relative w-full overflow-hidden rounded-[2.5rem] border border-white/10 bg-[#171730] p-8 md:p-12">
            <div className="absolute -left-10 -top-10 h-44 w-44 rounded-full bg-[#e08dff]/20 blur-[100px]" />
            <div className="absolute -bottom-12 right-0 h-48 w-48 rounded-full bg-[#8ff5ff]/10 blur-[110px]" />
            <div className="relative z-10 flex flex-col items-center gap-6 md:flex-row md:items-end md:gap-12">
              <div className="relative">
                <div className={`absolute inset-0 ${rankAccent.glowClassName} blur-3xl`} />
                <h1
                  className={`font-headline relative bg-gradient-to-b ${rankAccent.textGradient} bg-clip-text text-[8rem] font-black italic leading-none text-transparent md:text-[12rem]`}
                >
                  {rank}
                </h1>
              </div>
              <div className="mb-4 flex flex-col">
                <span className="font-headline mb-2 text-sm font-bold uppercase tracking-[0.3em] text-[#8ff5ff]">
                  Wynik zapisany
                </span>
                <h2 className="font-headline text-4xl font-black tracking-tight text-[#e5e3ff] md:text-6xl">
                  {selectedLevelName ?? "Singleplayer Run"}
                </h2>
                <p className="mt-2 max-w-lg text-[#aaa8c4]">
                  {`Skutecznosc ${accuracy}%. W tej rundzie zdobyto ${resultSummary.awardedExperience} XP za ${resultSummary.correctAnswersCount} poprawnych odpowiedzi z ${resultSummary.totalQuestions}.`}
                </p>
              </div>
            </div>
          </div>

          <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-3">
            <ResultStatCard
              label="Zdobyty EXP"
              value={String(resultSummary.awardedExperience)}
              suffix="XP"
              borderClassName="border-[#e08dff]"
            />
            <ResultStatCard
              label="Poprawne"
              value={`${resultSummary.correctAnswersCount}/${resultSummary.totalQuestions}`}
              borderClassName="border-[#8ff5ff]"
            />
            <ResultStatCard
              label="Skutecznosc"
              value={`${accuracy}%`}
              borderClassName="border-[#ffcf7d]"
            />
          </div>

          <div className="rounded-[2rem] bg-[#171730] p-6 md:p-8">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="font-headline text-2xl font-black tracking-tight">
                  Zdobyte nagrody
                </h3>
                <p className="mt-1 text-sm text-[#aaa8c4]">
                  Ten blok korzysta z danych zwroconych przez backend po
                  zakonczeniu rozgrywki.
                </p>
              </div>
              <div className="rounded-full bg-white/5 px-4 py-2 text-sm font-bold text-[#8ff5ff]">
                {resultSummary.awardedCoins} coins
              </div>
            </div>

            {unlockedAchievements.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {unlockedAchievements.map((reward) => (
                  <article
                    key={reward.code}
                    className="rounded-[1.5rem] border border-white/10 bg-black/15 p-4"
                  >
                    <div className="flex items-start gap-4">
                      <div className="h-16 w-16 overflow-hidden rounded-[1.2rem] bg-white/5 ring-1 ring-white/10">
                        {reward.rewardAvatarImageUrl ? (
                          <img
                            src={reward.rewardAvatarImageUrl}
                            alt={reward.name}
                            className="h-full w-full object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-[#8ff5ff]">
                            <span className="material-symbols-outlined text-2xl">
                              emoji_events
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="font-headline text-xl font-black tracking-tight text-[#f4d5ff]">
                            {reward.name}
                          </h4>
                          <span className="rounded-full bg-[#8ff5ff]/15 px-3 py-1 text-[10px] font-black uppercase tracking-[0.24em] text-[#8ff5ff]">
                            {reward.rewardType}
                          </span>
                        </div>
                        <p className="mt-2 text-sm text-[#aaa8c4]">
                          {reward.rewardDescription}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {reward.rewardCoins ? (
                        <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-2 text-xs font-bold text-[#ffcf7d]">
                          <span className="material-symbols-outlined text-sm">
                            monetization_on
                          </span>
                          {reward.rewardCoins} coins
                        </span>
                      ) : null}
                      {reward.rewardAvatarKey ? (
                        <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-2 text-xs font-bold text-[#8ff5ff]">
                          <span className="material-symbols-outlined text-sm">
                            face
                          </span>
                          {reward.rewardAvatarKey}
                        </span>
                      ) : null}
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="rounded-[1.5rem] bg-black/15 px-5 py-5 text-sm text-[#aaa8c4]">
                W tej rozgrywce nie odblokowano nowych nagrod.
              </div>
            )}

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/achievements"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3 font-bold text-[#e5e3ff] transition-colors hover:bg-white/10"
              >
                <span className="material-symbols-outlined text-sm">
                  emoji_events
                </span>
                Katalog achievementow
              </Link>
              <Link
                to="/avatars"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#e08dff] to-[#d978ff] px-6 py-3 font-black tracking-[0.18em] text-[#4f006c] transition-transform hover:scale-105 active:scale-95"
              >
                <span className="material-symbols-outlined text-sm">face</span>
                Katalog avatarow
              </Link>
            </div>
          </div>

          <div className="rounded-[2rem] bg-[#171730] p-6 md:p-8">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="font-headline text-2xl font-black tracking-tight">
                  Przebieg rundy
                </h3>
                <p className="mt-1 text-sm text-[#aaa8c4]">
                  Poprawna odpowiedz dla kazdego pytania pochodzi bezposrednio
                  z backendu.
                </p>
              </div>
              <span className="material-symbols-outlined text-[#8ff5ff]">
                data_check
              </span>
            </div>

            <div className="space-y-4">
              {details.map((detail) => (
                <article
                  key={detail.id}
                  className={`rounded-[1.5rem] border p-5 ${
                    detail.isCorrect
                      ? "border-emerald-400/20 bg-emerald-400/5"
                      : "border-rose-400/20 bg-rose-400/5"
                  }`}
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="mb-2 flex items-center gap-3">
                        <span className="inline-flex rounded-full bg-white/5 px-3 py-1 text-[10px] font-black uppercase tracking-[0.24em] text-[#8ff5ff]">
                          {`Pytanie ${detail.order}`}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.24em] ${
                            detail.isCorrect
                              ? "bg-emerald-400/15 text-emerald-300"
                              : "bg-rose-400/15 text-rose-300"
                          }`}
                        >
                          <span className="material-symbols-outlined text-sm">
                            {detail.isCorrect ? "check_circle" : "cancel"}
                          </span>
                          {detail.isCorrect ? "Poprawnie" : "Blednie"}
                        </span>
                      </div>
                      <h4 className="font-headline text-xl font-bold text-[#f4d5ff]">
                        {detail.prompt}
                      </h4>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-3 md:grid-cols-2">
                    <AnswerInfoCard
                      label="Twoja odpowiedz"
                      value={detail.selectedAnswerText}
                      accentClassName={
                        detail.isCorrect ? "text-emerald-300" : "text-rose-300"
                      }
                    />
                    <AnswerInfoCard
                      label="Poprawna odpowiedz"
                      value={detail.correctAnswerText}
                      accentClassName="text-[#8ff5ff]"
                    />
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="flex w-full flex-col gap-4 pt-2 sm:flex-row">
            <button
              type="button"
              onClick={() => {
                void replay();
              }}
              className="flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#e08dff] to-[#d978ff] px-8 py-4 font-bold text-[#4f006c] shadow-[0_10px_30px_rgba(224,141,255,0.3)] transition-all hover:scale-105 active:scale-95"
            >
              <span className="material-symbols-outlined">play_arrow</span>
              Zagraj jeszcze raz
            </button>
            <button
              type="button"
              onClick={goToLevelSelect}
              className="flex items-center justify-center gap-2 rounded-full border border-[#e08dff]/20 bg-[#29294a] px-8 py-4 font-bold text-[#e5e3ff] transition-all hover:bg-[#232341] active:scale-95"
            >
              <span className="material-symbols-outlined">map</span>
              Powrot do wyboru poziomu
            </button>
          </div>
        </section>

        <aside className="space-y-6 lg:col-span-5">
          <div className="rounded-[2rem] border border-white/10 bg-[#171730] p-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="font-headline text-xl font-black uppercase tracking-tight">
                  Podsumowanie API
                </h3>
                <p className="text-xs font-bold uppercase tracking-widest text-[#8ff5ff]">
                  Dane sesji singleplayer
                </p>
              </div>
              <span className="material-symbols-outlined text-[#8ff5ff]/50">
                analytics
              </span>
            </div>

            <dl className="space-y-4 text-sm text-[#aaa8c4]">
              <SummaryRow label="Poziom" value={selectedLevelName ?? "Nieznany"} />
              <SummaryRow
                label="Liczba pytan"
                value={String(resultSummary.totalQuestions)}
              />
              <SummaryRow
                label="Poprawne odpowiedzi"
                value={String(resultSummary.correctAnswersCount)}
              />
              <SummaryRow
                label="Zdobyty EXP"
                value={`${resultSummary.awardedExperience} XP`}
              />
              <SummaryRow label="Ocena" value={rank} />
            </dl>
          </div>
        </aside>
      </main>
    </div>
  );
};

const ResultStatCard = ({
  label,
  value,
  suffix,
  borderClassName,
}: {
  label: string;
  value: string;
  suffix?: string;
  borderClassName: string;
}) => (
  <div className={`rounded-[2rem] border-l-4 bg-[#171730] p-6 ${borderClassName}`}>
    <span className="text-xs font-bold uppercase tracking-widest text-[#aaa8c4]">
      {label}
    </span>
    <div className="font-headline mt-1 text-3xl font-black">
      {value} {suffix ? <span className="text-sm text-[#e08dff]">{suffix}</span> : null}
    </div>
  </div>
);

const AnswerInfoCard = ({
  label,
  value,
  accentClassName,
}: {
  label: string;
  value: string;
  accentClassName: string;
}) => (
  <div className="rounded-[1.25rem] bg-black/20 px-4 py-4">
    <div className="text-[10px] font-black uppercase tracking-[0.24em] text-[#aaa8c4]">
      {label}
    </div>
    <div className={`mt-2 text-sm font-semibold ${accentClassName}`}>{value}</div>
  </div>
);

const SummaryRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center justify-between gap-4 border-b border-white/5 pb-3">
    <dt>{label}</dt>
    <dd className="font-bold text-[#e5e3ff]">{value}</dd>
  </div>
);

function resolveRank(accuracy: number): string {
  if (accuracy >= 100) {
    return "S";
  }

  if (accuracy >= 80) {
    return "A";
  }

  if (accuracy >= 60) {
    return "B";
  }

  if (accuracy >= 40) {
    return "C";
  }

  return "D";
}

function resolveRankAccent(accuracy: number): {
  textGradient: string;
  glowClassName: string;
} {
  if (accuracy >= 80) {
    return {
      textGradient: "from-[#f4d5ff] to-[#e08dff]",
      glowClassName: "bg-[#e08dff]/30",
    };
  }

  if (accuracy >= 60) {
    return {
      textGradient: "from-[#fff1c2] to-[#ffcf7d]",
      glowClassName: "bg-[#ffcf7d]/30",
    };
  }

  return {
    textGradient: "from-[#ffd4d4] to-[#ff8d8d]",
    glowClassName: "bg-[#ff8d8d]/25",
  };
}
