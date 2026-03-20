// src/pages/Voting.tsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BrainCircuit, CheckCircle2, Sparkles } from "lucide-react";
import { useGameStore } from "../store/gameStore";
import { useGameSignalR } from "../hooks/useGameSignalR";

export const Voting = () => {
  const { submitVote } = useGameSignalR();

  // Pobieramy stany z naszego store'a
  const currentRoom = useGameStore((state) => state.currentRoom);
  const votingTopics = useGameStore((state) => state.votingTopics);
  const winningTopic = useGameStore((state) => state.winningTopic);
  const isGeneratingQuestions = useGameStore(
    (state) => state.isGeneratingQuestions,
  );

  // Lokalny stan, żeby wiedzieć, co kliknął ten konkretny gracz
  const [myVote, setMyVote] = useState<string | null>(null);

  const handleVote = async (topic: string) => {
    if (!currentRoom || myVote) return; // Zapobiega podwójnemu głosowaniu
    setMyVote(topic);
    await submitVote(currentRoom.roomId, topic);
  };

  if (!currentRoom) return null;

  // Widok 1: Oczekiwanie na tematy z serwera (ułamek sekundy po starcie gry)
  if (votingTopics.length === 0 && !winningTopic) {
    return (
      <div className="flex flex-col items-center justify-center p-10 mt-20">
        <BrainCircuit className="w-16 h-16 text-indigo-500 animate-pulse mb-4" />
        <h2 className="text-2xl font-bold text-slate-200">
          Przygotowuję tematy...
        </h2>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6 flex flex-col items-center mt-10">
      <AnimatePresence mode="wait">
        {/* WIDOK GŁOSOWANIA */}
        {!winningTopic ? (
          <motion.div
            key="voting-phase"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="w-full"
          >
            <div className="text-center mb-10">
              <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 mb-4">
                Głosowanie na temat
              </h1>
              <p className="text-slate-400 text-lg">
                {myVote
                  ? "Oczekiwanie na resztę graczy..."
                  : "Wybierz kategorię, z której AI wygeneruje pytania!"}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {votingTopics.map((topic, index) => {
                const isSelected = myVote === topic;
                const isDimmed = myVote && !isSelected;

                return (
                  <motion.div
                    key={topic}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={!myVote ? { scale: 1.05, translateY: -5 } : {}}
                    whileTap={!myVote ? { scale: 0.95 } : {}}
                    onClick={() => handleVote(topic)}
                    className={`
                                            relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 min-h-[160px] flex flex-col items-center justify-center text-center
                                            ${
                                              isSelected
                                                ? "bg-indigo-600/20 border-indigo-500 shadow-[0_0_30px_rgba(99,102,241,0.3)]"
                                                : isDimmed
                                                  ? "bg-slate-800/50 border-slate-700/50 opacity-50 cursor-not-allowed"
                                                  : "bg-slate-800 border-slate-700 hover:border-indigo-400 hover:shadow-lg"
                                            }
                                        `}
                  >
                    <h3
                      className={`text-2xl font-bold ${isSelected ? "text-indigo-300" : "text-slate-200"}`}
                    >
                      {topic}
                    </h3>

                    {/* Znacznik oddanego głosu */}
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-3 -right-3 bg-indigo-500 rounded-full p-1"
                      >
                        <CheckCircle2 className="w-6 h-6 text-white" />
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        ) : (
          /* WIDOK ZWYCIĘSKIEGO TEMATU I GENEROWANIA PYTAŃ */
          <motion.div
            key="generating-phase"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-2xl bg-slate-800 p-10 rounded-3xl border border-slate-700 shadow-2xl text-center relative overflow-hidden"
          >
            {/* Animowane tło */}
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 animate-pulse"></div>

            <div className="relative z-10 flex flex-col items-center">
              <h2 className="text-xl text-slate-400 mb-2">Zwycięski temat:</h2>
              <h1 className="text-5xl font-black text-white mb-8 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-pink-400">
                {winningTopic}
              </h1>

              {isGeneratingQuestions && (
                <div className="flex flex-col items-center">
                  <div className="relative mb-6">
                    {/* Pulsujący mózg AI */}
                    <motion.div
                      animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 5, -5, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="p-4 bg-slate-900 rounded-full border-2 border-indigo-500/50 shadow-[0_0_30px_rgba(99,102,241,0.5)]"
                    >
                      <Sparkles className="w-12 h-12 text-indigo-400 absolute -top-2 -right-2 animate-ping" />
                      <BrainCircuit className="w-16 h-16 text-purple-400" />
                    </motion.div>
                  </div>
                  <p className="text-xl font-semibold text-slate-300 animate-pulse">
                    Sztuczna Inteligencja układa pytania...
                  </p>
                  <p className="text-sm text-slate-500 mt-2">
                    To potrwa tylko chwilę (oby!).
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
