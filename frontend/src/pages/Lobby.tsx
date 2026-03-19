// src/pages/Lobby.tsx
import { motion } from "framer-motion";
import {
  Users,
  CheckCircle2,
  Circle,
  Play,
  Settings,
  Copy,
  Crown,
} from "lucide-react";
import { useGameStore } from "../store/gameStore";
import { useGameSignalR } from "../hooks/useGameSignalR";

export const Lobby = () => {
  const { setReadyStatus, setNumberOfTopics, startGame } = useGameSignalR();

  // Wyciągamy potrzebne dane ze store'a
  const currentRoom = useGameStore((state) => state.currentRoom);
  const connectionId = useGameStore((state) => state.connectionId);
  const canStartGame = useGameStore((state) => state.canStartGame);

  if (!currentRoom || !connectionId) return null;

  // Zamieniamy słownik graczy na tablicę, żeby łatwo ją wyrenderować
  const playersList = Object.values(currentRoom.players);
  const me = currentRoom.players[connectionId];
  const isHost = currentRoom.hostConnectionId === connectionId;

  const handleCopyRoomId = () => {
    navigator.clipboard.writeText(currentRoom.roomId);
    alert("Skopiowano ID pokoju!");
  };

  const toggleReady = async () => {
    if (me) {
      await setReadyStatus(currentRoom.roomId, !me.isReady);
    }
  };

  const handleTopicsChange = async (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const num = parseInt(e.target.value);
    await setNumberOfTopics(currentRoom.roomId, num);
  };

  const handleStartGame = async () => {
    if (canStartGame) {
      await startGame(currentRoom.roomId);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-6 flex flex-col items-center">
      {/* Nagłówek pokoju */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-8 bg-slate-800 p-6 rounded-2xl w-full border border-slate-700 shadow-lg relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
        <h1 className="text-3xl font-bold text-white mb-2">Poczekalnia</h1>
        <div className="flex justify-center items-center gap-2 text-slate-300">
          <span className="bg-slate-900 px-4 py-2 rounded-lg font-mono text-xl border border-slate-700">
            {currentRoom.roomId}
          </span>
          <button
            onClick={handleCopyRoomId}
            className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
            title="Skopiuj ID pokoju"
          >
            <Copy className="w-5 h-5 text-indigo-400" />
          </button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full">
        {/* Lista graczy */}
        <div className="lg:col-span-2 bg-slate-800 rounded-2xl p-6 border border-slate-700 shadow-lg">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-slate-200">
            <Users className="text-indigo-400" /> Gracze w pokoju (
            {playersList.length})
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {playersList.map((player) => (
              <motion.div
                key={player.connectionId}
                layout
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={`flex items-center p-4 rounded-xl border ${
                  player.isReady
                    ? "bg-emerald-900/20 border-emerald-500/50"
                    : "bg-slate-900/50 border-slate-700"
                } transition-colors duration-300`}
              >
                <img
                  src={player.avatarUrl}
                  alt={player.name}
                  className="w-12 h-12 rounded-full bg-slate-700 mr-4"
                />
                <div className="flex-1">
                  <p className="font-bold text-slate-200 flex items-center gap-2">
                    {player.name}
                    {currentRoom.hostConnectionId === player.connectionId && (
                      <Crown className="w-4 h-4 text-yellow-500" />
                    )}
                  </p>
                  <p
                    className={`text-sm ${player.isReady ? "text-emerald-400" : "text-slate-500"}`}
                  >
                    {player.isReady ? "Gotowy" : "Niegotowy"}
                  </p>
                </div>
                <div>
                  {player.isReady ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                  ) : (
                    <Circle className="w-6 h-6 text-slate-600" />
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Panel Sterowania */}
        <div className="flex flex-col gap-4">
          {/* Panel dla każdego gracza */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="bg-slate-800 rounded-2xl p-6 border border-slate-700 shadow-lg flex flex-col items-center justify-center text-center"
          >
            <h3 className="text-lg font-bold text-slate-200 mb-4">
              Twój Status
            </h3>
            <button
              onClick={toggleReady}
              className={`w-full py-4 rounded-xl font-bold text-lg transition-all transform hover:-translate-y-1 ${
                me?.isReady
                  ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/25"
                  : "bg-slate-600 hover:bg-slate-500 text-white"
              }`}
            >
              {me?.isReady ? "JESTEM GOTOWY!" : "KLIKNIJ, GDY BĘDZIESZ GOTOWY"}
            </button>
          </motion.div>

          {/* Panel tylko dla Hosta */}
          {isHost && (
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-indigo-900/30 rounded-2xl p-6 border border-indigo-500/30 shadow-lg flex flex-col gap-4"
            >
              <h3 className="text-lg font-bold text-indigo-300 flex items-center gap-2">
                <Settings className="w-5 h-5" /> Ustawienia Hosta
              </h3>

              <div>
                <label className="block text-sm text-slate-400 mb-2">
                  Liczba tematów do wyboru:
                </label>
                <select
                  value={currentRoom.numberOfTopics}
                  onChange={handleTopicsChange}
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value={3}>3 tematy</option>
                  <option value={5}>5 tematów</option>
                  <option value={7}>7 tematów</option>
                </select>
              </div>

              <button
                onClick={handleStartGame}
                disabled={!canStartGame}
                className={`w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-lg transition-all ${
                  canStartGame
                    ? "bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white shadow-lg shadow-indigo-500/25 transform hover:-translate-y-1"
                    : "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700"
                }`}
              >
                <Play className="w-6 h-6" /> START GRY
              </button>
              {!canStartGame && (
                <p className="text-xs text-center text-slate-500 mt-2">
                  Wszyscy gracze muszą być gotowi.
                </p>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};
