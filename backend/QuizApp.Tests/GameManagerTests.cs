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
        Assert.Equal(4, roomId.Length); // Zakładaliśmy 4-znakowy kod
        Assert.Single(gameManager.Rooms); // W słowniku powinien być dokładnie 1 pokój
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

        // Symulujemy dołączenie gracza
        gameManager.Rooms[roomId].Players.TryAdd(hostConnectionId, new Api.Models.Player
        {
            ConnectionId = hostConnectionId
        });

        // Act
        var result = gameManager.RemovePlayerFromAnyRoom(hostConnectionId, out var leftRoomId);

        // Assert
        Assert.True(result);
        Assert.Equal(roomId, leftRoomId);
        Assert.Empty(gameManager.Rooms); // Pokój powinien zostać usunięty, bo był pusty po wyjściu gracza
    }
}