using QuizApp.Api.Models;
using QuizApp.Api.Services;
using Xunit;

namespace QuizApp.Tests;

public class GameManagerTests
{
    [Fact]
    public void CreateRoom_Should_AddRoomToDictionary_And_ReturnRoomId()
    {
        // Arrange (Przygotowanie)
        var gameManager = new GameManager();
        var hostConnectionId = "host-123";

        // Act (Akcja)
        var roomId = gameManager.CreateRoom(hostConnectionId);

        // Assert (Sprawdzenie)
        Assert.NotNull(roomId);
        Assert.Equal(4, roomId.Length); // Expected a 4-character room code
        Assert.Single(gameManager.Rooms); // The dictionary should contain exactly one room
        Assert.True(gameManager.Rooms.ContainsKey(roomId));
        Assert.Equal(hostConnectionId, gameManager.Rooms[roomId].HostConnectionId);
    }

    [Fact]
    public void RemovePlayerFromAnyRoom_Should_RemovePlayer_And_DeleteEmptyRoom()
    {
        // Arrange
        var gameManager = new GameManager();
        var hostConnectionId = "host-123";
        var roomId = gameManager.CreateRoom(hostConnectionId);

        // Simulate a player joining
        gameManager.Rooms[roomId].Players.TryAdd(hostConnectionId, new Player
        {
            ConnectionId = hostConnectionId
        });

        // Act
        var result = gameManager.RemovePlayerFromAnyRoom(hostConnectionId, out var leftRoomId);

        // Assert
        Assert.True(result);
        Assert.Equal(roomId, leftRoomId);
        Assert.Empty(gameManager.Rooms); // The room should be removed once empty
    }

    [Fact]
    public void TryFinalizeQuestion_Should_Use_Flatter_Point_Scale()
    {
        var gameManager = new GameManager();
        var room = new Room
        {
            RoomId = "ROOM1",
            HostConnectionId = "host-123",
            Status = RoomStatus.Playing,
            CurrentQuestionStartTime = DateTime.UtcNow.AddSeconds(-2),
            IsQuestionActive = true
        };

        room.Players.TryAdd("player-1", new Player
        {
            ConnectionId = "player-1",
            Name = "Jan",
            AvatarUrl = "avatar.png",
            Score = 0,
            IsReady = true
        });

        room.CurrentQuestions.Add(new Question
        {
            Text = "Pytanie?",
            Options = new List<string> { "A", "B", "C", "D" },
            CorrectOptionIndex = 2
        });

        room.CurrentAnswers.TryAdd("player-1", (2000, 2));
        gameManager.Rooms.TryAdd(room.RoomId, room);

        var finalized = gameManager.TryFinalizeQuestion(room, out var results);

        Assert.True(finalized);
        Assert.NotNull(results);
        Assert.Equal(320, results!.PlayerResults["player-1"].PointsEarned);
        Assert.Equal(320, results.PlayerResults["player-1"].TotalScore);
    }
}
