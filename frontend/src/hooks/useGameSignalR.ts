import { useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";
import { useGameStore } from "../store/gameStore";
import type { Player, Room, QuestionDto } from "../types";

const HUB_URL = "http://localhost:5211/gamehub";

let sharedConnection: signalR.HubConnection | null = null;
let sharedStartPromise: Promise<void> | null = null;
let listenersRegistered = false;

const getConnection = () => {
  if (!sharedConnection) {
    sharedConnection = new signalR.HubConnectionBuilder()
      .withUrl(HUB_URL)
      .withAutomaticReconnect()
      .build();
  }

  return sharedConnection;
};

const registerListeners = (connection: signalR.HubConnection) => {
  if (listenersRegistered) return;
  listenersRegistered = true;

  connection.on("RoomCreated", (roomId: string) => {
    console.log("Stworzono pokój:", roomId);
    const store = useGameStore.getState();
    if (!store.currentRoom) {
      store.setCurrentRoom({ roomId } as Room);
    }
  });

  connection.on("ReceiveRoomsList", (rooms: Room[]) => {
    useGameStore.getState().setRoomsList(rooms);
  });

  connection.on("PlayerJoined", (player: Player) => {
    console.log("Dołączył gracz:", player.name);
  });

  connection.on("UpdatePlayersList", (players: Player[]) => {
    useGameStore.getState().updatePlayersList(players);
  });

  connection.on("NumberOfTopicsChanged", (numberOfTopics: number) => {
    useGameStore.getState().setRoomNumberOfTopics(numberOfTopics);
  });

  connection.on(
    "PlayerReadyStatusChanged",
    (connectionId: string, isReady: boolean) => {
      useGameStore.getState().updatePlayerReadyStatus(connectionId, isReady);
    },
  );

  connection.on("CanStartGame", (canStart: boolean) => {
    useGameStore.getState().setCanStartGame(canStart);
  });

  connection.on("GameStarted", () => {
    console.log("Gra się rozpoczęła!");
  });

  connection.on("ReceiveVotingTopics", (topics: string[]) => {
    useGameStore.getState().setVotingTopics(topics);
  });

  connection.on("VotingFinished", (winningTopic: string) => {
    useGameStore.getState().setWinningTopic(winningTopic);
  });

  connection.on("QuestionsGenerated", () => {
    useGameStore.getState().setQuestionsGenerating(false);
    console.log("Pytania wygenerowane przez AI!");
  });

  connection.on("ReceiveQuestion", (question: QuestionDto) => {
    useGameStore.getState().setCurrentQuestion(question);
  });

  connection.on("QuestionResults", (results: any) => {
    useGameStore.getState().setQuestionResult(results);
  });

  connection.on("RoundEnded", (summary: any) => {
    useGameStore.getState().setRoundEnded(summary);
  });

  connection.on("GameOver", (leaderboard: any) => {
    useGameStore.getState().setGameOver(leaderboard);
  });

  connection.on("Error", (errorMessage: string) => {
    const store = useGameStore.getState();
    store.setError(errorMessage);
    setTimeout(() => store.setError(null), 3000);
  });
};

const startConnection = async () => {
  const connection = getConnection();

  if (connection.state === signalR.HubConnectionState.Connected) {
    return;
  }

  if (!sharedStartPromise) {
    sharedStartPromise = connection.start().finally(() => {
      sharedStartPromise = null;
    });
  }

  await sharedStartPromise;
  const store = useGameStore.getState();
  if (connection.connectionId) {
    store.setConnectionId(connection.connectionId);
  }
  await connection.invoke("GetAvailableRooms");
};

export const useGameSignalR = () => {
  const [connection, setConnection] = useState<signalR.HubConnection | null>(
    null,
  );
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const currentConnection = getConnection();
    setConnection(currentConnection);
    registerListeners(currentConnection);

    const connect = async () => {
      try {
        await startConnection();
        setIsConnected(true);
      } catch (err) {
        console.error("Błąd połączenia SignalR:", err);
        setTimeout(connect, 5000);
      }
    };

    connect();
  }, []);

  const invoke = async (method: string, ...args: unknown[]) => {
    const conn = connection ?? sharedConnection;
    if (!conn) return;
    await conn.invoke(method, ...args);
  };

  const createRoom = async (playerName: string, avatarUrl: string) => {
    await invoke("CreateRoom", playerName, avatarUrl);
  };

  const joinRoom = async (
    roomId: string,
    playerName: string,
    avatarUrl: string,
  ) => {
    await invoke("JoinRoom", roomId, playerName, avatarUrl);
    useGameStore.getState().setCurrentRoom({ roomId } as Room);
  };

  const setNumberOfTopics = async (roomId: string, num: number) => {
    await invoke("SetNumberOfTopics", roomId, num);
  };

  const setReadyStatus = async (roomId: string, isReady: boolean) => {
    await invoke("SetReadyStatus", roomId, isReady);
  };

  const startGame = async (roomId: string) => {
    await invoke("StartGame", roomId);
  };

  const submitVote = async (roomId: string, topic: string) => {
    await invoke("SubmitVote", roomId, topic);
  };

  const submitAnswer = async (roomId: string, answerIndex: number) => {
    await invoke("SubmitAnswer", roomId, answerIndex);
  };

  const startNextQuestion = async (roomId: string) => {
    await invoke("StartNextQuestion", roomId);
  };

  const startNextRoundVoting = async (roomId: string) => {
    await invoke("StartNextRoundVoting", roomId);
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
