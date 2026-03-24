import { useEffect } from "react";
import { useGameSignalR } from "../hooks/useGameSignalR";
import { useGameStore } from "../store/gameStore";
import { Menu } from "../pages/Menu";
import { Lobby } from "../pages/Lobby";
import { RoomStatus } from "../types";
import { Voting } from "../pages/Voting";
import { Game } from "../pages/Game";
import { RoundSummary } from "../pages/RoundSummary";
import { GameOver } from "../pages/GameOver";

export const LegacyMultiplayerApp = () => {
  const { isConnected, createRoom, joinRoom } = useGameSignalR();
  const currentRoom = useGameStore((state) => state.currentRoom);
  const currentQuestion = useGameStore((state) => state.currentQuestion);
  const roundSummary = useGameStore((state) => state.roundSummary);
  const finalLeaderboard = useGameStore((state) => state.finalLeaderboard);
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
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
          <p className="animate-pulse font-medium text-slate-400">
            Łączenie z serwerem gry...
          </p>
        </div>
      </div>
    );
  }

  let currentView;

  if (finalLeaderboard) {
    currentView = <GameOver />;
  } else if (!currentRoom) {
    currentView = <Menu createRoom={createRoom} joinRoom={joinRoom} />;
  } else if (currentRoom.status === RoomStatus.WaitingForPlayers) {
    currentView = <Lobby />;
  } else if (currentRoom.status === RoomStatus.Playing) {
    if (roundSummary) {
      currentView = <RoundSummary />;
    } else if (!currentQuestion) {
      currentView = <Voting />;
    } else {
      currentView = <Game />;
    }
  } else if (currentRoom.status === RoomStatus.Finished) {
    currentView = <GameOver />;
  }

  return (
    <div className="flex min-h-screen justify-center bg-slate-900 pt-10 font-sans text-slate-100 selection:bg-indigo-500/30">
      {currentView}
    </div>
  );
};
