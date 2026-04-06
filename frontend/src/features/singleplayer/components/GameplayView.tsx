import { useEffect, useMemo, useState } from "react";
import { useSingleplayerStore } from "../store/singleplayerStore";
import { scrollToTop } from "../utils/scrollToTop";

export const GameplayView = () => {
  const gameSession = useSingleplayerStore((state) => state.gameSession);
  const currentQuestionIndex = useSingleplayerStore(
    (state) => state.currentQuestionIndex,
  );
  const selectedAnswerId = useSingleplayerStore(
    (state) => state.selectedAnswerId,
  );
  const selectedLevelName = useSingleplayerStore(
    (state) => state.selectedLevelName,
  );
  const isGameLoading = useSingleplayerStore((state) => state.isGameLoading);
  const isSubmittingResult = useSingleplayerStore(
    (state) => state.isSubmittingResult,
  );
  const gameError = useSingleplayerStore((state) => state.gameError);
  const setSelectedAnswerId = useSingleplayerStore(
    (state) => state.setSelectedAnswerId,
  );
  const advanceQuestion = useSingleplayerStore((state) => state.advanceQuestion);
  const surrender = useSingleplayerStore((state) => state.surrender);
  const replay = useSingleplayerStore((state) => state.replay);

  const [isQuestionVisible, setIsQuestionVisible] = useState(false);
  const [areAnswersVisible, setAreAnswersVisible] = useState(false);
  const [isAdvancing, setIsAdvancing] = useState(false);

  const currentQuestion = useMemo(
    () => gameSession?.questions[currentQuestionIndex] ?? null,
    [currentQuestionIndex, gameSession],
  );

  useEffect(() => {
    if (!currentQuestion) {
      return;
    }

    setIsQuestionVisible(false);
    setAreAnswersVisible(false);

    const frame = requestAnimationFrame(() => {
      setIsQuestionVisible(true);
    });
    const timer = window.setTimeout(() => {
      setAreAnswersVisible(true);
    }, 2000);

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(timer);
    };
  }, [currentQuestion?.id]);

  useEffect(() => {
    scrollToTop();
  }, [currentQuestion?.id]);

  const totalQuestions = gameSession?.questions.length ?? 0;
  const isLastQuestion =
    currentQuestionIndex >= Math.max(0, totalQuestions - 1);

  const handleAdvance = async () => {
    if (!selectedAnswerId || isAdvancing || isSubmittingResult) {
      return;
    }

    setIsAdvancing(true);
    setAreAnswersVisible(false);
    setIsQuestionVisible(false);

    await wait(320);
    await advanceQuestion();
    setIsAdvancing(false);
  };

  if (isGameLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0c0c21] px-6 text-[#e5e3ff]">
        <div className="glass-panel w-full max-w-2xl rounded-[2rem] px-10 py-12 text-center">
          <div className="mx-auto mb-6 h-16 w-16 animate-spin rounded-full border-2 border-[#e08dff]/30 border-t-[#e08dff]" />
          <h1 className="font-headline text-3xl font-black tracking-tight text-[#f4d5ff]">
            Synchronizacja pytan
          </h1>
          <p className="mt-3 text-[#aaa8c4]">
            Przygotowuje runde dla poziomu {selectedLevelName ?? "singleplayer"}.
          </p>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0c0c21] px-6 text-[#e5e3ff]">
        <div className="glass-panel w-full max-w-2xl rounded-[2rem] px-10 py-12 text-center">
          <h1 className="font-headline text-3xl font-black tracking-tight text-[#f4d5ff]">
            Brak pytan do wyswietlenia
          </h1>
          <p className="mt-3 text-[#aaa8c4]">
            {gameError ?? "Ta sesja nie zostala poprawnie zainicjalizowana."}
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => {
                void replay();
              }}
              className="rounded-full bg-gradient-to-r from-[#e08dff] to-[#d978ff] px-8 py-4 font-bold text-[#4f006c]"
            >
              Sprobuj ponownie
            </button>
            <button
              type="button"
              onClick={surrender}
              className="rounded-full border border-white/10 px-8 py-4 font-bold text-[#e5e3ff]"
            >
              Wroc do poziomow
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#0c0c21] text-[#e5e3ff]">
      <header className="sticky top-0 z-40 border-b border-white/8 bg-[#0c0c21]/92 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-5xl items-start justify-between gap-4 px-4 py-4 sm:px-6">
          <span className="bg-gradient-to-r from-[#f4d5ff] via-[#e08dff] to-[#ff68a7] bg-clip-text font-headline text-2xl font-black tracking-tight text-transparent sm:text-3xl">
            QuizVolt
          </span>

          <div className="min-w-0 text-right">
            <div className="truncate text-xs font-black uppercase tracking-[0.22em] text-[#e08dff] sm:text-sm">
              {selectedLevelName ?? "Singleplayer"}
            </div>
            <div className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#aaa8c4] sm:text-sm">
              {`Pytanie ${currentQuestionIndex + 1} z ${totalQuestions}`}
            </div>
          </div>
        </div>
      </header>

      <main className="relative flex flex-grow flex-col items-center overflow-hidden px-4 py-6 sm:px-6 sm:py-8">
        <div className="absolute left-[-8rem] top-1/4 h-96 w-96 rounded-full bg-[#e08dff]/5 blur-[120px]" />
        <div className="absolute bottom-1/4 right-[-8rem] h-96 w-96 rounded-full bg-[#ff68a7]/5 blur-[120px]" />

        <div className="w-full max-w-4xl space-y-6 sm:space-y-8 md:space-y-10">
          <div className="overflow-hidden rounded-full bg-white/5">
            <div
              className="h-2 rounded-full bg-gradient-to-r from-[#8ff5ff] via-[#e08dff] to-[#ff68a7] transition-all duration-500"
              style={{
                width: `${((currentQuestionIndex + 1) / Math.max(1, totalQuestions)) * 100}%`,
              }}
            />
          </div>

          {gameError ? (
            <div className="rounded-[1.5rem] border border-[#ff68a7]/30 bg-[#ff68a7]/10 px-5 py-4 text-sm text-[#ffd1e0]">
              {gameError}
            </div>
          ) : null}

          <div
            className={`glass-panel group relative overflow-hidden rounded-[2rem] p-6 transition-all duration-500 sm:p-8 md:p-12 ${
              isQuestionVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-4 opacity-0"
            }`}
          >
            <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[#e08dff]/10 blur-[80px]" />
            <div className="absolute left-0 top-0 h-full w-1.5 bg-gradient-to-b from-[#8ff5ff] via-[#e08dff] to-[#ff68a7]" />

            <h1 className="font-headline text-center text-2xl font-extrabold leading-tight tracking-tight text-[#e5e3ff] sm:text-3xl md:text-5xl">
              {currentQuestion.text}
            </h1>
            <p className="mt-5 text-center text-xs uppercase tracking-[0.24em] text-[#8ff5ff]/80 sm:text-sm">
              Odpowiedzi pojawia sie po 2 sekundach
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
            {currentQuestion.answers.map((answer, index) => {
              const isSelected = selectedAnswerId === answer.id;

              return (
                <button
                  key={answer.id}
                  type="button"
                  onClick={() => setSelectedAnswerId(answer.id)}
                  disabled={!areAnswersVisible || isAdvancing || isSubmittingResult}
                  className={`group relative flex items-center gap-4 rounded-[2rem] border p-5 text-left transition-all duration-500 active:scale-95 sm:gap-6 sm:p-6 ${
                    areAnswersVisible
                      ? "translate-y-0 opacity-100"
                      : "pointer-events-none translate-y-8 opacity-0"
                  } ${
                    isSelected
                      ? "border-[#e08dff]/60 bg-[#29294a] shadow-[0_0_20px_rgba(224,141,255,0.3)]"
                      : "border-white/10 bg-[#171730] hover:border-[#e08dff]/60 hover:bg-[#29294a]"
                  }`}
                  style={{ transitionDelay: `${index * 90}ms` }}
                >
                  <span
                    className={`font-headline flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full border text-lg font-black transition-colors sm:h-12 sm:w-12 sm:text-xl ${
                      isSelected
                        ? "border-[#e08dff] bg-[#e08dff] text-[#4f006c]"
                        : "border-[#e08dff]/30 bg-[#232341] text-[#e08dff] group-hover:bg-[#e08dff] group-hover:text-[#4f006c]"
                    }`}
                  >
                    {String.fromCharCode(65 + index)}
                  </span>

                  <span
                    className={`text-base font-medium sm:text-lg md:text-xl ${
                      isSelected ? "text-[#e5e3ff]" : "text-[#aaa8c4]"
                    }`}
                  >
                    {answer.text}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex flex-col items-center gap-4 pt-2">
            {selectedAnswerId && areAnswersVisible ? (
              <button
                type="button"
                onClick={() => {
                  void handleAdvance();
                }}
                disabled={isAdvancing || isSubmittingResult}
                className="w-full max-w-sm rounded-full bg-gradient-to-r from-[#e08dff] to-[#d978ff] px-8 py-4 font-headline text-sm font-black tracking-[0.2em] text-[#4f006c] shadow-[0_0_30px_rgba(224,141,255,0.35)] transition-all hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
              >
                {isSubmittingResult
                  ? "WYSLANIE WYNIKU..."
                  : isLastQuestion
                    ? "ZAKONCZ RUN"
                    : "NASTEPNE PYTANIE"}
              </button>
            ) : null}

            <button
              type="button"
              onClick={surrender}
              className="flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-bold uppercase tracking-[0.18em] text-[#aaa8c4] transition-all duration-200 hover:bg-[#ff68a7]/10 hover:text-[#ff68a7] active:scale-95"
            >
              <span className="material-symbols-outlined text-xl">logout</span>
              Poddaj sie
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}
