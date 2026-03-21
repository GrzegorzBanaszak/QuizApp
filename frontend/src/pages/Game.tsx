// src/pages/Game.tsx
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Timer, CheckCircle2, XCircle, ArrowRight, Trophy } from "lucide-react";
import { useGameStore } from "../store/gameStore";
import { useGameSignalR } from "../hooks/useGameSignalR";

type QuestionPlayerResultPayload = {
  pointsEarned?: number;
  PointsEarned?: number;
  totalScore?: number;
  TotalScore?: number;
};

type QuestionResultsPayload = {
  playerResults?: Record<string, QuestionPlayerResultPayload>;
  PlayerResults?: Record<string, QuestionPlayerResultPayload>;
};

export const Game = () => {
  const { submitAnswer, startNextQuestion } = useGameSignalR();
  const questionActivatedAtRef = useRef(0);

  const currentRoom = useGameStore((state) => state.currentRoom);
  const connectionId = useGameStore((state) => state.connectionId);
  const currentQuestion = useGameStore((state) => state.currentQuestion);
  const questionTimeExpired = useGameStore(
    (state) => state.isQuestionTimeExpired,
  );
  const lastQuestionResult = useGameStore((state) => state.lastQuestionResult);
  const correctOptionIndex =
    lastQuestionResult?.correctOptionIndex ??
    lastQuestionResult?.correctAnswerIndex;
  const questionResults =
    (lastQuestionResult as QuestionResultsPayload | null)?.playerResults ??
    (lastQuestionResult as QuestionResultsPayload | null)?.PlayerResults;
  const currentPlayerResult = questionResults?.[connectionId ?? ""];
  const pointsEarned =
    currentPlayerResult?.pointsEarned ??
    currentPlayerResult?.PointsEarned ??
    0;

  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [hasTimedOut, setHasTimedOut] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(0);

  const isHost = currentRoom?.hostConnectionId === connectionId;
  const leaderboard = Object.values(currentRoom?.players ?? {}).sort(
    (a, b) => b.score - a.score,
  );

  useEffect(() => {
    if (currentQuestion) {
      questionActivatedAtRef.current = Date.now();
      setSelectedAnswer(null);
      setHasTimedOut(false);

      // Prevent Enter/Space from activating a recycled focused button on a new question.
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
    }
  }, [currentQuestion]);

  useEffect(() => {
    if (!currentQuestion || !currentRoom || lastQuestionResult) return;

    const questionTimeLimit = Number(currentQuestion.timeLimitSeconds);
    const safeTimeLimit = Number.isFinite(questionTimeLimit)
      ? questionTimeLimit
      : 30;

    const endsAtMs = Date.parse(currentQuestion.endsAtUtc);
    const serverNowMs = Date.parse(currentQuestion.serverNowUtc);
    const hasValidServerTime =
      Number.isFinite(endsAtMs) && Number.isFinite(serverNowMs);
    const serverOffsetMs = hasValidServerTime ? serverNowMs - Date.now() : 0;

    const getTimeLeft = () => {
      if (hasValidServerTime) {
        const remainingMs = endsAtMs - (Date.now() + serverOffsetMs);

        if (!Number.isFinite(remainingMs)) {
          return safeTimeLimit;
        }

        return Math.max(0, Math.ceil(remainingMs / 1000));
      }

      return safeTimeLimit;
    };

    setTimeLeft(getTimeLeft());

    if (!hasValidServerTime) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          const nextTimeLeft = Math.max(0, prev - 1);

          if (nextTimeLeft <= 0) {
            setHasTimedOut(true);
          }

          return nextTimeLeft;
        });
      }, 1000);

      return () => clearInterval(timer);
    }

    const timer = setInterval(() => {
      const nextTimeLeft = getTimeLeft();
      setTimeLeft(nextTimeLeft);

      if (nextTimeLeft <= 0) {
        clearInterval(timer);
        setHasTimedOut(true);
      }
    }, 250);

    return () => clearInterval(timer);
  }, [currentQuestion, currentRoom, lastQuestionResult]);

  const handleAnswerSubmit = async (index: number) => {
    if (selectedAnswer !== null || lastQuestionResult || questionTimeExpired || !currentRoom) return;
    if (Date.now() - questionActivatedAtRef.current < 300) return;

    setSelectedAnswer(index);
    await submitAnswer(currentRoom.roomId, index);
  };

  const handleNextQuestion = async () => {
    if (!currentRoom) return;
    await startNextQuestion(currentRoom.roomId);
  };

  if (!currentQuestion || !currentRoom) return null;

  const timeLimitSeconds = Number.isFinite(currentQuestion.timeLimitSeconds)
    ? currentQuestion.timeLimitSeconds
    : 30;
  const timePercentage = (timeLeft / timeLimitSeconds) * 100;
  const isLocked =
    selectedAnswer !== null ||
    lastQuestionResult !== null ||
    hasTimedOut ||
    questionTimeExpired;

  return (
    <div className="w-full max-w-6xl mx-auto p-6 flex flex-col gap-6 mt-4">
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_280px] gap-6 items-start">
        <div className="min-w-0">
          <div className="flex justify-between items-center mb-6 bg-slate-800 p-4 rounded-2xl border border-slate-700 shadow-lg">
            <div className="text-slate-300 font-bold bg-slate-900 px-4 py-2 rounded-lg border border-slate-700">
              Pytanie {currentQuestion.questionNumber} z{" "}
              {currentQuestion.totalQuestions}
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-xl font-black text-white">
                <Trophy className="w-6 h-6 text-yellow-500" />
                {currentRoom.players[connectionId!]?.score || 0} pkt
              </div>
            </div>
          </div>

          <motion.div
            key={currentQuestion.questionNumber}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-800 rounded-3xl p-8 border border-slate-700 shadow-2xl relative overflow-hidden mb-6 text-center"
          >
            <div className="absolute top-0 left-0 w-full h-2 bg-slate-700">
              <motion.div
                className={`h-full ${timePercentage > 30 ? "bg-indigo-500" : "bg-red-500"}`}
                initial={{ width: "100%" }}
                animate={{ width: `${timePercentage}%` }}
                transition={{ duration: 1, ease: "linear" }}
              />
            </div>

            <div className="mt-4 mb-8 flex justify-center items-center gap-3">
              <Timer
                className={`w-8 h-8 ${timeLeft > 10 ? "text-indigo-400" : "text-red-500 animate-pulse"}`}
              />
              <span
                className={`text-4xl font-black ${timeLeft > 10 ? "text-slate-200" : "text-red-500"}`}
              >
                {timeLeft}s
              </span>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
              {currentQuestion.text}
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentQuestion.options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              const isResultsPhase = lastQuestionResult !== null;
              const isCorrect = isResultsPhase && correctOptionIndex === index;
              const isWrong = isResultsPhase && isSelected && !isCorrect;

              let buttonClass =
                "bg-slate-800 border-slate-600 hover:bg-slate-700 text-slate-200";

              if (isResultsPhase) {
                if (isCorrect) {
                  buttonClass =
                    "bg-emerald-600 border-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.3)] z-10";
                } else if (isWrong) {
                  buttonClass =
                    "bg-red-900/80 border-red-500 text-white opacity-90";
                } else {
                  buttonClass =
                    "bg-slate-800/50 border-slate-700 text-slate-500 opacity-50";
                }
              } else if (isSelected) {
                buttonClass =
                  "bg-indigo-600 border-indigo-400 text-white shadow-lg shadow-indigo-500/25";
              }

              return (
                <motion.button
                  key={index}
                  type="button"
                  whileHover={
                    !isLocked && !isResultsPhase
                      ? { scale: 1.02, translateY: -2 }
                      : {}
                  }
                  whileTap={
                    !isLocked && !isResultsPhase ? { scale: 0.98 } : {}
                  }
                  onClick={() => handleAnswerSubmit(index)}
                  disabled={isLocked || isResultsPhase}
                  className={`
                    relative p-6 rounded-2xl border-2 text-xl font-bold transition-all duration-300 min-h-[100px] flex items-center justify-center
                    ${buttonClass}
                  `}
                >
                  {option}

                  {isResultsPhase && isCorrect && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-3 -right-3 bg-emerald-500 rounded-full p-1 border-2 border-slate-900"
                    >
                      <CheckCircle2 className="w-6 h-6 text-white" />
                    </motion.div>
                  )}

                  {isResultsPhase && isWrong && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-3 -right-3 bg-red-500 rounded-full p-1 border-2 border-slate-900"
                    >
                      <XCircle className="w-6 h-6 text-white" />
                    </motion.div>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>

        <aside className="bg-slate-800 rounded-3xl p-5 border border-slate-700 shadow-xl sticky top-6">
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="w-5 h-5 text-yellow-500" />
            <h3 className="text-lg font-bold text-slate-100">Ranking live</h3>
          </div>

          <div className="space-y-3">
            {leaderboard.map((player, index) => {
              const isMe = player.connectionId === connectionId;

              return (
                <div
                  key={player.connectionId}
                  className={`flex items-center gap-3 rounded-2xl px-3 py-3 border ${
                    isMe
                      ? "bg-indigo-500/15 border-indigo-500/40"
                      : "bg-slate-900/60 border-slate-700"
                  }`}
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-700 text-sm font-black text-slate-100">
                    {index + 1}
                  </div>
                  <img
                    src={player.avatarUrl}
                    alt={player.name}
                    className="h-10 w-10 rounded-full bg-slate-700 object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-bold text-slate-100">
                      {player.name}
                      {isMe && (
                        <span className="ml-2 text-xs font-semibold text-indigo-300">
                          ty
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-slate-400">
                      {player.isReady ? "Gotowy" : "W grze"}
                    </p>
                  </div>
                  <div className="font-black text-white">{player.score}</div>
                </div>
              );
            })}
          </div>
        </aside>
      </div>

      <div className="mt-2 text-center h-24">
        <AnimatePresence mode="wait">
          {selectedAnswer !== null && !lastQuestionResult && timeLeft > 0 && (
            <motion.p
              key="waiting"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-indigo-400 font-medium animate-pulse text-lg"
            >
              Odpowiedź zapisana. Oczekiwanie na koniec czasu...
            </motion.p>
          )}

          {(hasTimedOut || questionTimeExpired) && !lastQuestionResult && (
            <motion.p
              key="timeout"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-amber-400 font-medium animate-pulse text-lg"
            >
              Czas minął. Oczekiwanie na wyniki...
            </motion.p>
          )}

          {lastQuestionResult && (
            <motion.div
              key="results"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-4"
            >
              <h3
                className={`text-2xl font-black ${selectedAnswer === correctOptionIndex ? "text-emerald-400" : "text-red-400"}`}
              >
                {selectedAnswer === correctOptionIndex
                  ? `Świetnie! +${pointsEarned} pkt`
                  : "Niestety, zła odpowiedź!"}
              </h3>

              {isHost && (
                <button
                  onClick={handleNextQuestion}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-transform transform hover:-translate-y-1 shadow-lg shadow-indigo-500/25"
                >
                  Następne pytanie <ArrowRight className="w-5 h-5" />
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
