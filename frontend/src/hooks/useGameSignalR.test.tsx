import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useGameStore } from "../store/gameStore";
import { RoomStatus } from "../types";

const { fakeConnection, fakeListeners, HubConnectionBuilderMock } = vi.hoisted(
  () => {
    const fakeListeners = new Map<string, (...args: unknown[]) => void>();

    const fakeConnection = {
      state: 0,
      connectionId: "test-connection-id",
      start: vi.fn(async () => {
        fakeConnection.state = 1;
      }),
      invoke: vi.fn(async () => undefined),
      on: vi.fn((eventName: string, handler: (...args: unknown[]) => void) => {
        fakeListeners.set(eventName, handler);
        return fakeConnection;
      }),
    };

    class HubConnectionBuilderMock {
      withUrl = vi.fn().mockReturnThis();
      withAutomaticReconnect = vi.fn().mockReturnThis();
      build = vi.fn(() => fakeConnection);
    }

    return { fakeConnection, fakeListeners, HubConnectionBuilderMock };
  },
);

vi.mock("@microsoft/signalr", () => ({
  HubConnectionState: {
    Disconnected: 0,
    Connected: 1,
    Connecting: 2,
    Reconnecting: 3,
  },
  HubConnectionBuilder: HubConnectionBuilderMock,
}));

import { useGameSignalR } from "./useGameSignalR";

describe("useGameSignalR", () => {
  const emit = (eventName: string, ...args: unknown[]) => {
    const handler = fakeListeners.get(eventName);

    if (!handler) {
      throw new Error(`Missing listener for event: ${eventName}`);
    }

    handler(...args);
  };

  beforeEach(() => {
    fakeConnection.state = 0;
    fakeConnection.start.mockClear();
    fakeConnection.invoke.mockClear();
    fakeConnection.on.mockClear();

    useGameStore.setState({
      connectionId: null,
      roomsList: [],
      currentRoom: null,
      votingTopics: [],
      winningTopic: null,
      isGeneratingQuestions: false,
      currentQuestion: null,
      isQuestionTimeExpired: false,
      lastQuestionResult: null,
      roundSummary: null,
      finalLeaderboard: null,
      error: null,
      canStartGame: false,
    });
  });

  it("sets a room shell in store and invokes JoinRoom without going through UI flow", async () => {
    const { result } = renderHook(() => useGameSignalR());

    await waitFor(() => {
      expect(fakeConnection.start).toHaveBeenCalled();
    });

    await result.current.joinRoom("ABCD", "Jan", "avatar.png");

    const room = useGameStore.getState().currentRoom;

    expect(room).not.toBeNull();
    expect(room).toMatchObject({
      roomId: "ABCD",
      hostConnectionId: "test-connection-id",
      numberOfTopics: 3,
      status: RoomStatus.WaitingForPlayers,
      players: {},
      availableTopics: [],
      playerVotes: {},
      selectedTopic: null,
      currentQuestionIndex: 0,
      playedTopics: [],
    });
    expect(fakeConnection.invoke).toHaveBeenCalledWith(
      "JoinRoom",
      "ABCD",
      "Jan",
      "avatar.png",
    );
  });

  it("creates a room shell when RoomCreated arrives", async () => {
    renderHook(() => useGameSignalR());

    await waitFor(() => {
      expect(fakeConnection.start).toHaveBeenCalled();
    });

    emit("RoomCreated", "ROOM1");

    expect(useGameStore.getState().currentRoom).toMatchObject({
      roomId: "ROOM1",
      hostConnectionId: "test-connection-id",
      numberOfTopics: 3,
      status: RoomStatus.WaitingForPlayers,
      players: {},
      availableTopics: [],
      playerVotes: {},
      selectedTopic: null,
      currentQuestionIndex: 0,
      playedTopics: [],
    });
  });

  it("merges the player list into the current room when UpdatePlayersList arrives", async () => {
    renderHook(() => useGameSignalR());

    await waitFor(() => {
      expect(fakeConnection.start).toHaveBeenCalled();
    });

    useGameStore.setState({
      connectionId: "test-connection-id",
      roomsList: [],
      currentRoom: {
        roomId: "ROOM2",
        hostConnectionId: "test-connection-id",
        numberOfTopics: 3,
        status: RoomStatus.WaitingForPlayers,
        players: {},
        availableTopics: [],
        playerVotes: {},
        selectedTopic: null,
        currentQuestionIndex: 0,
        playedTopics: [],
      },
      votingTopics: [],
      winningTopic: null,
      isGeneratingQuestions: false,
      currentQuestion: null,
      isQuestionTimeExpired: false,
      lastQuestionResult: null,
      roundSummary: null,
      finalLeaderboard: null,
      error: null,
      canStartGame: false,
    });

    emit("UpdatePlayersList", [
      {
        connectionId: "player-1",
        name: "Anna",
        avatarUrl: "avatar-1.png",
        score: 0,
        isReady: false,
      },
      {
        connectionId: "player-2",
        name: "Bartek",
        avatarUrl: "avatar-2.png",
        score: 5,
        isReady: true,
      },
    ]);

    expect(useGameStore.getState().currentRoom?.players).toEqual({
      "player-1": {
        connectionId: "player-1",
        name: "Anna",
        avatarUrl: "avatar-1.png",
        score: 0,
        isReady: false,
      },
      "player-2": {
        connectionId: "player-2",
        name: "Bartek",
        avatarUrl: "avatar-2.png",
        score: 5,
        isReady: true,
      },
    });
  });

  it("switches the room status to Playing when GameStarted arrives", async () => {
    renderHook(() => useGameSignalR());

    await waitFor(() => {
      expect(fakeConnection.start).toHaveBeenCalled();
    });

    useGameStore.setState({
      connectionId: "test-connection-id",
      roomsList: [],
      currentRoom: {
        roomId: "ROOM3",
        hostConnectionId: "test-connection-id",
        numberOfTopics: 3,
        status: RoomStatus.WaitingForPlayers,
        players: {},
        availableTopics: [],
        playerVotes: {},
        selectedTopic: null,
        currentQuestionIndex: 0,
        playedTopics: [],
      },
      votingTopics: [],
      winningTopic: null,
      isGeneratingQuestions: false,
      currentQuestion: null,
      isQuestionTimeExpired: false,
      lastQuestionResult: null,
      roundSummary: null,
      finalLeaderboard: null,
      error: null,
      canStartGame: false,
    });

    emit("GameStarted");

    expect(useGameStore.getState().currentRoom?.status).toBe(
      RoomStatus.Playing,
    );
  });

  it("sets canStartGame to true when CanStartGame arrives", async () => {
    renderHook(() => useGameSignalR());

    await waitFor(() => {
      expect(fakeConnection.start).toHaveBeenCalled();
    });

    expect(useGameStore.getState().canStartGame).toBe(false);

    emit("CanStartGame", true);

    expect(useGameStore.getState().canStartGame).toBe(true);
  });

  it("turns off question generation and starts the next question when QuestionsGenerated arrives", async () => {
    renderHook(() => useGameSignalR());

    await waitFor(() => {
      expect(fakeConnection.start).toHaveBeenCalled();
    });

    useGameStore.setState({
      connectionId: "test-connection-id",
      roomsList: [],
      currentRoom: {
        roomId: "ROOM4",
        hostConnectionId: "test-connection-id",
        numberOfTopics: 3,
        status: RoomStatus.Playing,
        players: {},
        availableTopics: [],
        playerVotes: {},
        selectedTopic: null,
        currentQuestionIndex: 0,
        playedTopics: [],
      },
      votingTopics: [],
      winningTopic: "Cinema",
      isGeneratingQuestions: true,
      currentQuestion: null,
      isQuestionTimeExpired: false,
      lastQuestionResult: null,
      roundSummary: null,
      finalLeaderboard: null,
      error: null,
      canStartGame: false,
    });

    emit("QuestionsGenerated");

    expect(useGameStore.getState().isGeneratingQuestions).toBe(false);
    expect(fakeConnection.invoke).toHaveBeenCalledWith(
      "StartNextQuestion",
      "ROOM4",
    );
  });

  it("stores question results and updates player scores when QuestionResults arrives", async () => {
    renderHook(() => useGameSignalR());

    await waitFor(() => {
      expect(fakeConnection.start).toHaveBeenCalled();
    });

    useGameStore.setState({
      connectionId: "test-connection-id",
      roomsList: [],
      currentRoom: {
        roomId: "ROOM5",
        hostConnectionId: "test-connection-id",
        numberOfTopics: 3,
        status: RoomStatus.Playing,
        players: {
          "player-1": {
            connectionId: "player-1",
            name: "Anna",
            avatarUrl: "avatar-1.png",
            score: 0,
            isReady: true,
          },
          "player-2": {
            connectionId: "player-2",
            name: "Bartek",
            avatarUrl: "avatar-2.png",
            score: 2,
            isReady: true,
          },
        },
        availableTopics: [],
        playerVotes: {},
        selectedTopic: null,
        currentQuestionIndex: 0,
        playedTopics: [],
      },
      votingTopics: [],
      winningTopic: null,
      isGeneratingQuestions: false,
      currentQuestion: null,
      isQuestionTimeExpired: false,
      lastQuestionResult: null,
      roundSummary: null,
      finalLeaderboard: null,
      error: null,
      canStartGame: false,
    });

    emit("QuestionResults", {
      playerResults: {
        "player-1": { totalScore: 4 },
        "player-2": { TotalScore: 7 },
      },
    });

    expect(useGameStore.getState().lastQuestionResult).toEqual({
      playerResults: {
        "player-1": { totalScore: 4 },
        "player-2": { TotalScore: 7 },
      },
    });
    expect(useGameStore.getState().currentRoom?.players).toEqual({
      "player-1": {
        connectionId: "player-1",
        name: "Anna",
        avatarUrl: "avatar-1.png",
        score: 4,
        isReady: true,
      },
      "player-2": {
        connectionId: "player-2",
        name: "Bartek",
        avatarUrl: "avatar-2.png",
        score: 7,
        isReady: true,
      },
    });
  });

  it("stores round summary and clears the current question when RoundEnded arrives", async () => {
    renderHook(() => useGameSignalR());

    await waitFor(() => {
      expect(fakeConnection.start).toHaveBeenCalled();
    });

    useGameStore.setState({
      connectionId: "test-connection-id",
      roomsList: [],
      currentRoom: {
        roomId: "ROOM6",
        hostConnectionId: "test-connection-id",
        numberOfTopics: 3,
        status: RoomStatus.Playing,
        players: {},
        availableTopics: [],
        playerVotes: {},
        selectedTopic: null,
        currentQuestionIndex: 0,
        playedTopics: [],
      },
      votingTopics: [],
      winningTopic: null,
      isGeneratingQuestions: false,
      currentQuestion: {
        text: "Pytanie?",
        options: ["A", "B", "C", "D"],
        questionNumber: 1,
        totalQuestions: 6,
        timeLimitSeconds: 30,
        startedAtUtc: "2026-03-21T00:00:00Z",
        endsAtUtc: "2026-03-21T00:00:30Z",
        serverNowUtc: "2026-03-21T00:00:00Z",
      },
      isQuestionTimeExpired: false,
      lastQuestionResult: null,
      roundSummary: null,
      finalLeaderboard: null,
      error: null,
      canStartGame: false,
    });

    const summary = {
      currentRound: 1,
      totalRounds: 3,
      justPlayedTopic: "Cinema",
      leaderboard: [
        { connectionId: "player-1", score: 10 },
        { connectionId: "player-2", score: 7 },
      ],
    };

    emit("RoundEnded", summary);

    expect(useGameStore.getState().roundSummary).toEqual(summary);
    expect(useGameStore.getState().currentQuestion).toBeNull();
  });
});
