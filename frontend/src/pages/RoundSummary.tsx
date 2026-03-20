// src/pages/RoundSummary.tsx
import { motion } from "framer-motion";
import { Trophy, ArrowRight, Crown } from "lucide-react";
import { useGameStore } from "../store/gameStore";
import { useGameSignalR } from "../hooks/useGameSignalR";

export const RoundSummary = () => {
  const { startNextRoundVoting } = useGameSignalR();

  const currentRoom = useGameStore((state) => state.currentRoom);
  const connectionId = useGameStore((state) => state.connectionId);

  if (!currentRoom) return null;

  const isHost = currentRoom.hostConnectionId === connectionId;

  // Sortujemy graczy od największej liczby punktów do najmniejszej
  const sortedPlayers = Object.values(currentRoom.players).sort(
    (a, b) => b.score - a.score,
  );

  const handleNextRound = async () => {
    await startNextRoundVoting(currentRoom.roomId);
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-6 flex flex-col items-center mt-10">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <div className="inline-block p-4 bg-yellow-500/10 rounded-full mb-4 border border-yellow-500/20">
          <Trophy className="w-16 h-16 text-yellow-500" />
        </div>
        <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-600 mb-2">
          Podsumowanie Rundy
        </h1>
        <p className="text-slate-400 text-lg">
          Tak prezentuje się aktualna tabela wyników!
        </p>
      </motion.div>

      {/* Tabela wyników */}
      <div className="w-full bg-slate-800 rounded-3xl p-6 border border-slate-700 shadow-2xl mb-10">
        <div className="flex flex-col gap-3">
          {sortedPlayers.map((player, index) => {
            const isMe = player.connectionId === connectionId;

            // Kolory dla Top 3
            let rankColor = "text-slate-400";
            let bgRank = "bg-slate-700";
            if (index === 0) {
              rankColor = "text-yellow-400";
              bgRank = "bg-yellow-500/20 border-yellow-500/50";
            } else if (index === 1) {
              rankColor = "text-slate-300";
              bgRank = "bg-slate-300/20 border-slate-300/50";
            } else if (index === 2) {
              rankColor = "text-amber-600";
              bgRank = "bg-amber-700/20 border-amber-700/50";
            }

            return (
              <motion.div
                key={player.connectionId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.15 }} // Im niżej, tym później się pojawia
                className={`
                                    flex items-center p-4 rounded-2xl border-2 transition-all
                                    ${isMe ? "border-indigo-500 bg-indigo-900/20" : "border-transparent bg-slate-900/50"}
                                `}
              >
                {/* Miejsce */}
                <div
                  className={`w-12 h-12 flex items-center justify-center rounded-xl border ${bgRank} mr-4`}
                >
                  <span className={`text-xl font-black ${rankColor}`}>
                    #{index + 1}
                  </span>
                </div>

                {/* Avatar i Nick */}
                <img
                  src={player.avatarUrl}
                  alt={player.name}
                  className="w-12 h-12 rounded-full bg-slate-700 mr-4 border border-slate-600"
                />
                <div className="flex-1">
                  <p className="text-lg font-bold text-slate-200 flex items-center gap-2">
                    {player.name}
                    {isMe && (
                      <span className="text-xs bg-indigo-500 text-white px-2 py-0.5 rounded-full">
                        Ty
                      </span>
                    )}
                    {currentRoom.hostConnectionId === player.connectionId && (
                      <Crown className="w-4 h-4 text-yellow-500" />
                    )}
                  </p>
                </div>

                {/* Punkty */}
                <div className="text-right flex items-center gap-2">
                  <span className="text-2xl font-black text-white">
                    {player.score}
                  </span>
                  <span className="text-sm font-medium text-slate-400">
                    pkt
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Kontrolki Hosta / Oczekiwanie */}
      <div className="h-20 flex items-center justify-center">
        {isHost ? (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            onClick={handleNextRound}
            className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white px-8 py-4 rounded-2xl font-bold text-lg flex items-center gap-3 transition-transform transform hover:-translate-y-1 shadow-lg shadow-indigo-500/25"
          >
            Głosuj na kolejny temat <ArrowRight className="w-6 h-6" />
          </motion.button>
        ) : (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-slate-400 text-lg animate-pulse"
          >
            Oczekiwanie na decyzję hosta...
          </motion.p>
        )}
      </div>
    </div>
  );
};
