// src/pages/Menu.tsx
import { useState } from "react";
import { motion } from "framer-motion";
import { Users, Plus, Gamepad2, User } from "lucide-react";
import { useGameStore } from "../store/gameStore";

type MenuProps = {
  createRoom: (playerName: string, avatarUrl: string) => Promise<void>;
  joinRoom: (
    roomId: string,
    playerName: string,
    avatarUrl: string,
  ) => Promise<void>;
};

export const Menu = ({ createRoom, joinRoom }: MenuProps) => {
  // Pobieramy listę pokoi ze store'a
  const roomsList = useGameStore((state) => state.roomsList);

  // Lokalne stany dla formularza
  const [playerName, setPlayerName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState(
    `https://api.dicebear.com/7.x/bottts/svg?seed=${Math.random()}`,
  );

  // Generowanie nowego awatara
  const generateAvatar = () => {
    setAvatarUrl(
      `https://api.dicebear.com/7.x/bottts/svg?seed=${Math.random()}`,
    );
  };

  const handleCreateRoom = async () => {
    if (!playerName) return alert("Podaj nazwę gracza!");
    await createRoom(playerName, avatarUrl);
  };

  const handleJoinRoom = async (roomId: string) => {
    if (!playerName) return alert("Podaj nazwę gracza!");
    await joinRoom(roomId, playerName, avatarUrl);
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center p-6">
      {/* Nagłówek gry */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <div className="inline-block p-4 bg-indigo-500/10 rounded-full mb-4">
          <Gamepad2 className="w-16 h-16 text-indigo-400" />
        </div>
        <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
          AI Quiz Clash
        </h1>
        <p className="text-slate-400 mt-2 text-lg">
          Zarzuć temat. AI wygeneruje pytania. Pokonaj znajomych!
        </p>
      </motion.div>

      {/* Panel Gracza */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-slate-800 p-6 rounded-2xl shadow-xl w-full max-w-md border border-slate-700 mb-8"
      >
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <User className="text-indigo-400" /> Twój Profil
        </h2>

        <div className="flex items-center gap-4 mb-4">
          <motion.img
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            src={avatarUrl}
            alt="Avatar"
            className="w-16 h-16 rounded-full bg-slate-700 cursor-pointer border-2 border-indigo-500/50"
            onClick={generateAvatar}
            title="Kliknij, aby zmienić awatar"
          />
          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Wpisz swój nick..."
            className="flex-1 bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
            maxLength={15}
          />
        </div>

        <button
          onClick={handleCreateRoom}
          className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all transform hover:-translate-y-1 shadow-lg shadow-indigo-500/25"
        >
          <Plus className="w-5 h-5" /> Stwórz nowy pokój
        </button>
      </motion.div>

      {/* Lista Pokoi */}
      <div className="w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-slate-300">
          <Users className="text-purple-400" /> Dostępne Pokoje
        </h2>

        <div className="space-y-3">
          {roomsList.length === 0 ? (
            <p className="text-slate-500 text-center py-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
              Brak aktywnych pokoi. Stwórz pierwszy!
            </p>
          ) : (
            roomsList.map((room, index) => (
              <motion.div
                key={room.roomId}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 * index }}
                className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex justify-between items-center hover:border-indigo-500/50 transition-colors"
              >
                <div>
                  <p className="font-bold text-slate-200">
                    Pokój #{room.roomId.substring(0, 4)}
                  </p>
                  <p className="text-xs text-slate-400">
                    Status: {room.status === 0 ? "Oczekuje" : "W grze"}
                  </p>
                </div>
                <button
                  onClick={() => handleJoinRoom(room.roomId)}
                  disabled={room.status !== 0} // Zablokuj dołączanie, jeśli gra już trwa
                  className="bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                >
                  Dołącz
                </button>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
