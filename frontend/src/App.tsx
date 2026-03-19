import { useEffect } from "react";
import { useGameSignalR } from "./hooks/useGameSignalR";
import { useGameStore } from "./store/gameStore";
import { Menu } from "./pages/Menu.tsx";
import { Lobby } from "./pages/Lobby.tsx";
import { RoomStatus } from "./types/index.ts";

function App() {
  const { isConnected, createRoom, joinRoom } = useGameSignalR();
  const currentRoom = useGameStore((state) => state.currentRoom);
  const error = useGameStore((state) => state.error);

  useEffect(() => {
    if (error) {
      alert(`Błąd: ${error}`);
    }
  }, [error]);

  if (!isConnected) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-900 text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 font-medium animate-pulse">
            Łączenie z serwerem gry...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-indigo-500/30 flex justify-center pt-10">
      {!currentRoom && <Menu createRoom={createRoom} joinRoom={joinRoom} />}

      {/* Jeśli jesteśmy w pokoju i gra się jeszcze nie zaczęła (status 0) */}
      {currentRoom && currentRoom.status === RoomStatus.WaitingForPlayers && (
        <Lobby />
      )}

      {/* Placeholder na czas samej gry (status 1) */}
      {currentRoom && currentRoom.status === 1 && (
        <div className="text-center p-10">
          <h2 className="text-4xl text-purple-400 font-bold mb-4 animate-bounce">
            Gra rozpoczęta!
          </h2>
          <p className="text-slate-400">Trwa ładowanie panelu głosowania...</p>
          {/* Tu niedługo wstawimy komponent z głosowaniem / pytaniami */}
        </div>
      )}
    </div>
  );
}

export default App;
