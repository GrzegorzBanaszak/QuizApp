import { useEffect } from "react";
import { useGameSignalR } from "./hooks/useGameSignalR";
import { useGameStore } from "./store/gameStore";
import { Menu } from "./pages/Menu.tsx";
import { Lobby } from "./pages/Lobby.tsx";
import { RoomStatus } from "./types/index.ts";
import { Voting } from "./pages/Voting.tsx";

function App() {
  const { isConnected, createRoom, joinRoom } = useGameSignalR();
  const currentRoom = useGameStore((state) => state.currentRoom);
  const currentQuestion = useGameStore((state) => state.currentQuestion);
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
  let currentView;

  if (!currentRoom) {
    currentView = <Menu createRoom={createRoom} joinRoom={joinRoom} />;
  } else if (currentRoom.status === RoomStatus.WaitingForPlayers) {
    // WaitingForPlayers
    currentView = <Lobby />;
  } else if (currentRoom.status === RoomStatus.Playing) {
    // Playing
    // Jeśli nie ma jeszcze pytania, to znaczy, że jesteśmy w fazie głosowania/generowania
    if (!currentQuestion) {
      currentView = <Voting />;
    } else {
      // Jeśli mamy pytanie, pokazujemy ekran gry (zrobimy w następnym kroku!)
      currentView = (
        <div className="p-10 text-center">
          <h2 className="text-3xl text-indigo-400 font-bold">
            Nadchodzi pytanie!
          </h2>
          <p className="text-slate-400">Pytanie: {currentQuestion.text}</p>
        </div>
      );
    }
  } else if (currentRoom.status === 2) {
    // Finished
    currentView = (
      <div className="p-10 text-center text-2xl text-green-500">
        Koniec Gry! Podium wkrótce...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-indigo-500/30 flex justify-center pt-10">
      {currentView}
    </div>
  );
}

export default App;
