// src/App.tsx
import { useEffect } from "react";
import { useGameSignalR } from "./hooks/useGameSignalR";
import { useGameStore } from "./store/gameStore";
import { Menu } from "./pages/Menu.tsx";
// import { Lobby } from './pages/Lobby'; // Zakomentowane, stworzymy w następnym kroku

function App() {
  // Wywołanie hooka tutaj sprawia, że połączenie SignalR żyje na poziomie całej aplikacji
  const { isConnected } = useGameSignalR();
  const currentRoom = useGameStore((state) => state.currentRoom);
  const error = useGameStore((state) => state.error);

  // Nasłuchiwanie na stworzenie pokoju (mały trick, żeby host od razu do niego dołączył)
  // W normalnych warunkach to powinno być częścią GameHub'a (CreateRoom zwracający string i wywołujący JoinRoom na froncie)
  // lub obsłużone tuż po wywołaniu createRoom() w Menu.
  useEffect(() => {
    // Jeśli z jakiegoś powodu serwer zrzuci błąd, wyświetlamy go
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
      {/* Bardzo prosty routing oparty na stanie */}
      {!currentRoom ? (
        <Menu />
      ) : (
        // Jeśli currentRoom nie jest nullem, znaczy że gracz dołączył do pokoju
        <div className="p-10 text-center">
          <h2 className="text-3xl text-green-400 font-bold mb-4">
            Jesteś w poczekalni (Lobby)!
          </h2>
          <p className="text-slate-400">ID Pokoju: {currentRoom.roomId}</p>
          {/* Tutaj wkleimy komponent <Lobby /> w następnym kroku */}
        </div>
      )}
    </div>
  );
}

export default App;
