// src/pages/GameOver.tsx
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Confetti from "react-confetti";
import { Trophy, Home } from "lucide-react";
import { useGameSignalR } from "../hooks/useGameSignalR";
import { useGameStore } from "../store/gameStore";
import type { Player } from "../types";

export const GameOver = () => {
  const finalLeaderboard = useGameStore((state) => state.finalLeaderboard);
  const resetGame = useGameStore((state) => state.resetGame);
  const { refreshAvailableRooms } = useGameSignalR();

  // Do obsługi rozmiaru okna dla konfetti
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () =>
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!finalLeaderboard) return null;

  // Zakładamy, że backend przesyła posortowaną tablicę graczy
  const sortedPlayers: Player[] = Array.isArray(finalLeaderboard)
    ? finalLeaderboard
    : Object.values(finalLeaderboard).sort(
        (a: any, b: any) => b.score - a.score,
      );

  const firstPlace = sortedPlayers[0];
  const secondPlace = sortedPlayers[1];
  const thirdPlace = sortedPlayers[2];
  const restOfPlayers = sortedPlayers.slice(3);

  const handleReturnToMainMenu = async () => {
    resetGame();
    await refreshAvailableRooms();
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-6 flex flex-col items-center justify-center min-h-[80vh]">
      <Confetti
        width={windowSize.width}
        height={windowSize.height}
        recycle={true}
        numberOfPieces={200}
        gravity={0.15}
      />

      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", bounce: 0.5 }}
        className="text-center mb-16 z-10"
      >
        <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600 mb-4 drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]">
          KONIEC GRY!
        </h1>
        <p className="text-2xl text-slate-300 font-bold">
          Oto ostateczne wyniki starcia z AI
        </p>
      </motion.div>

      {/* PODIUM */}
      <div className="flex items-end justify-center gap-2 sm:gap-6 w-full max-w-3xl h-64 mb-16 z-10">
        {/* 2 MIEJSCE (Srebro) */}
        {secondPlace && (
          <motion.div
            initial={{ y: 200, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, type: "spring" }}
            className="flex flex-col items-center w-1/3"
          >
            <div className="flex flex-col items-center mb-2">
              <img
                src={secondPlace.avatarUrl}
                alt="2nd"
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-slate-300 bg-slate-800"
              />
              <p className="font-bold text-slate-200 mt-2 truncate w-full text-center">
                {secondPlace.name}
              </p>
              <p className="text-slate-400 font-bold">
                {secondPlace.score} pkt
              </p>
            </div>
            <div className="w-full h-32 bg-gradient-to-t from-slate-600 to-slate-400 rounded-t-xl border-t-4 border-slate-300 shadow-[0_0_30px_rgba(148,163,184,0.3)] flex justify-center pt-4">
              <span className="text-4xl font-black text-slate-800 opacity-50">
                2
              </span>
            </div>
          </motion.div>
        )}

        {/* 1 MIEJSCE (Złoto) */}
        {firstPlace && (
          <motion.div
            initial={{ y: 300, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1, type: "spring", bounce: 0.4 }}
            className="flex flex-col items-center w-1/3 z-20"
          >
            <div className="flex flex-col items-center mb-2">
              <Trophy className="w-10 h-10 text-yellow-400 mb-2 drop-shadow-[0_0_10px_rgba(250,204,21,0.8)]" />
              <img
                src={firstPlace.avatarUrl}
                alt="1st"
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-yellow-400 bg-slate-800"
              />
              <p className="font-black text-yellow-400 mt-2 text-lg truncate w-full text-center">
                {firstPlace.name}
              </p>
              <p className="text-yellow-200 font-bold">
                {firstPlace.score} pkt
              </p>
            </div>
            <div className="w-full h-48 bg-gradient-to-t from-yellow-700 to-yellow-500 rounded-t-xl border-t-4 border-yellow-300 shadow-[0_0_40px_rgba(234,179,8,0.4)] flex justify-center pt-4">
              <span className="text-5xl font-black text-yellow-900 opacity-50">
                1
              </span>
            </div>
          </motion.div>
        )}

        {/* 3 MIEJSCE (Brąz) */}
        {thirdPlace && (
          <motion.div
            initial={{ y: 150, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="flex flex-col items-center w-1/3"
          >
            <div className="flex flex-col items-center mb-2">
              <img
                src={thirdPlace.avatarUrl}
                alt="3rd"
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-amber-700 bg-slate-800"
              />
              <p className="font-bold text-slate-200 mt-2 truncate w-full text-center">
                {thirdPlace.name}
              </p>
              <p className="text-slate-400 font-bold">{thirdPlace.score} pkt</p>
            </div>
            <div className="w-full h-24 bg-gradient-to-t from-amber-900 to-amber-700 rounded-t-xl border-t-4 border-amber-600 shadow-[0_0_30px_rgba(180,83,9,0.3)] flex justify-center pt-4">
              <span className="text-4xl font-black text-amber-950 opacity-50">
                3
              </span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Reszta graczy */}
      {restOfPlayers.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="w-full max-w-2xl bg-slate-800/80 rounded-2xl p-6 border border-slate-700 z-10 mb-8 backdrop-blur-sm"
        >
          <h3 className="text-slate-400 font-bold mb-4 uppercase tracking-wider text-sm">
            Reszta graczy
          </h3>
          <div className="flex flex-col gap-2">
            {restOfPlayers.map((player, idx) => (
              <div
                key={player.connectionId}
                className="flex items-center justify-between p-3 bg-slate-900/50 rounded-xl border border-slate-700/50"
              >
                <div className="flex items-center gap-3">
                  <span className="text-slate-500 font-bold w-6 text-center">
                    {idx + 4}.
                  </span>
                  <img
                    src={player.avatarUrl}
                    alt={player.name}
                    className="w-8 h-8 rounded-full bg-slate-700"
                  />
                  <span className="font-semibold text-slate-300">
                    {player.name}
                  </span>
                </div>
                <span className="text-slate-400 font-mono">
                  {player.score} pkt
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Przycisk powrotu */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.5 }}
        className="z-10 mt-8"
      >
        <button
          onClick={handleReturnToMainMenu}
          className="bg-slate-800 hover:bg-slate-700 text-white px-8 py-4 rounded-2xl border border-slate-600 font-bold text-lg flex items-center gap-3 transition-transform transform hover:-translate-y-1 shadow-xl"
        >
          <Home className="w-6 h-6 text-indigo-400" /> Wróć do ekranu głównego
        </button>
      </motion.div>
    </div>
  );
};
