// src/hooks/useGameSignalR.ts
import { useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";
import { useGameStore } from "../store/gameStore";
import type { Player, Room, QuestionDto } from "../types";

// Zmień port na ten, na którym działa Twoje API lokalnie
const HUB_URL = "http://localhost:5211/gamehub";

export const useGameSignalR = () => {
  const [connection, setConnection] = useState<signalR.HubConnection | null>(
    null,
  );
  const [isConnected, setIsConnected] = useState(false);

  // Wyciągamy akcje z naszego store'a
  const store = useGameStore();

  useEffect(() => {
    // Inicjalizacja połączenia
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl(HUB_URL)
      .withAutomaticReconnect() // Automatycznie ponawia przy zerwaniu
      .build();

    setConnection(newConnection);
  }, []);

  useEffect(() => {
    if (!connection) return;

    // --- REJESTRACJA NASŁUCHIWACZY (Zdarzenia z serwera) ---

    connection.on("RoomCreated", (roomId: string) => {
      console.log("Stworzono pokój:", roomId);
      // Host zazwyczaj musi teraz wywołać joinRoom z tym ID
    });

    connection.on("ReceiveRoomsList", (rooms: Room[]) => {
      store.setRoomsList(rooms);
    });

    connection.on("PlayerJoined", (player: Player) => {
      console.log("Dołączył gracz:", player.name);
    });

    connection.on("UpdatePlayersList", (players: Player[]) => {
      store.updatePlayersList(players);
    });

    connection.on("NumberOfTopicsChanged", (numberOfTopics: number) => {
      store.setRoomNumberOfTopics(numberOfTopics);
    });

    connection.on(
      "PlayerReadyStatusChanged",
      (connectionId: string, isReady: boolean) => {
        store.updatePlayerReadyStatus(connectionId, isReady);
      },
    );

    connection.on("CanStartGame", (canStart: boolean) => {
      store.setCanStartGame(canStart);
    });

    connection.on("GameStarted", () => {
      console.log("Gra się rozpoczęła!");
    });

    connection.on("ReceiveVotingTopics", (topics: string[]) => {
      store.setVotingTopics(topics);
    });

    connection.on("VotingFinished", (winningTopic: string) => {
      store.setWinningTopic(winningTopic);
    });

    connection.on("QuestionsGenerated", () => {
      store.setQuestionsGenerating(false);
      console.log("Pytania wygenerowane przez AI!");
    });

    connection.on("ReceiveQuestion", (question: QuestionDto) => {
      store.setCurrentQuestion(question);
    });

    connection.on("QuestionResults", (results: any) => {
      store.setQuestionResult(results);
    });

    connection.on("RoundEnded", (summary: any) => {
      store.setRoundEnded(summary);
    });

    connection.on("GameOver", (leaderboard: any) => {
      store.setGameOver(leaderboard);
    });

    connection.on("Error", (errorMessage: string) => {
      store.setError(errorMessage);
      setTimeout(() => store.setError(null), 3000); // Czyścimy błąd po 3s
    });

    // --- URUCHOMIENIE POŁĄCZENIA ---
    const startConnection = async () => {
      try {
        await connection.start();
        setIsConnected(true);
        if (connection.connectionId) {
          store.setConnectionId(connection.connectionId);
        }
        // Po udanym połączeniu od razu pobieramy listę pokoi
        await connection.invoke("GetAvailableRooms");
      } catch (err) {
        console.error("Błąd połączenia SignalR:", err);
        setTimeout(startConnection, 5000); // Ponowna próba po 5 sekundach
      }
    };

    startConnection();

    // Cleanup przy odmontowaniu
    return () => {
      connection.stop();
    };
  }, [connection]);

  // --- METODY DO WYSYŁANIA ŻĄDAŃ NA SERWER ---

  const createRoom = async () => {
    await connection?.invoke("CreateRoom");
  };

  const joinRoom = async (
    roomId: string,
    playerName: string,
    avatarUrl: string,
  ) => {
    await connection?.invoke("JoinRoom", roomId, playerName, avatarUrl);
    // Opcjonalnie: ustawiamy w store "currentRoom" prowizorycznie,
    // czekając na pełne dane z UpdatePlayersList
    store.setCurrentRoom({ roomId } as Room);
  };

  const setNumberOfTopics = async (roomId: string, num: number) => {
    await connection?.invoke("SetNumberOfTopics", roomId, num);
  };

  const setReadyStatus = async (roomId: string, isReady: boolean) => {
    await connection?.invoke("SetReadyStatus", roomId, isReady);
  };

  const startGame = async (roomId: string) => {
    await connection?.invoke("StartGame", roomId);
  };

  const submitVote = async (roomId: string, topic: string) => {
    await connection?.invoke("SubmitVote", roomId, topic);
  };

  const submitAnswer = async (roomId: string, answerIndex: number) => {
    await connection?.invoke("SubmitAnswer", roomId, answerIndex);
  };

  const startNextQuestion = async (roomId: string) => {
    await connection?.invoke("StartNextQuestion", roomId);
  };

  const startNextRoundVoting = async (roomId: string) => {
    await connection?.invoke("StartNextRoundVoting", roomId);
  };

  return {
    isConnected,
    createRoom,
    joinRoom,
    setNumberOfTopics,
    setReadyStatus,
    startGame,
    submitVote,
    submitAnswer,
    startNextQuestion,
    startNextRoundVoting,
  };
};
