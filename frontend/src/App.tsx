import { useEffect } from "react";
import { useGameSignalR } from "./hooks/useGameSignalR";
import { useGameStore } from "./store/gameStore";
import { Menu } from "./pages/Menu.tsx";

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
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-indigo-500/30 flex justify-center">
      {!currentRoom ? (
        <Menu createRoom={createRoom} joinRoom={joinRoom} />
      ) : (
        <div className="p-10 text-center">
          <h2 className="text-3xl text-green-400 font-bold mb-4">
            Jesteś w poczekalni (Lobby)!
          </h2>
          <p className="text-slate-400">ID Pokoju: {currentRoom.roomId}</p>
        </div>
      )}
    </div>
  );
}

export default App;
