import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useGameStore } from "../store/gameStore";
import { RoomStatus } from "../types";

const hookMocks = vi.hoisted(() => ({
  setReadyStatus: vi.fn(),
  setNumberOfTopics: vi.fn(),
  startGame: vi.fn(),
}));

vi.mock("../hooks/useGameSignalR", () => ({
  useGameSignalR: () => hookMocks,
}));

import { Lobby } from "./Lobby";

describe("Lobby", () => {
  beforeEach(() => {
    hookMocks.setReadyStatus.mockClear();
    hookMocks.setNumberOfTopics.mockClear();
    hookMocks.startGame.mockClear();

    useGameStore.setState({
      connectionId: "host-1",
      roomsList: [],
      currentRoom: {
        roomId: "ROOM1",
        hostConnectionId: "host-1",
        numberOfTopics: 3,
        status: RoomStatus.WaitingForPlayers,
        players: {
          "host-1": {
            connectionId: "host-1",
            name: "Host",
            avatarUrl: "host.png",
            score: 0,
            isReady: false,
          },
          "player-2": {
            connectionId: "player-2",
            name: "Guest",
            avatarUrl: "guest.png",
            score: 0,
            isReady: false,
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
  });

  it("keeps the host start button disabled until canStartGame becomes true", () => {
    const { rerender } = render(<Lobby />);

    const startButton = screen.getByRole("button", { name: /start gry/i });
    expect(startButton).toBeDisabled();

    useGameStore.setState({ canStartGame: true });
    rerender(<Lobby />);

    expect(screen.getByRole("button", { name: /start gry/i })).toBeEnabled();
  });
});
