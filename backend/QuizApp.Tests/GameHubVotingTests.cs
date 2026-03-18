using Microsoft.AspNetCore.SignalR;
using Moq;
using QuizApp.Api.Hubs;
using QuizApp.Api.Models;
using QuizApp.Api.Services;
using Xunit;

namespace QuizApp.Tests;

public class GameHubVotingTests
{
    // Pomocnicza metoda do tworzenia kontekstu
    private HubCallerContext CreateMockContext(string connectionId)
    {
        var mockContext = new Mock<HubCallerContext>();
        mockContext.Setup(c => c.ConnectionId).Returns(connectionId);
        return mockContext.Object;
    }

    [Fact]
    public async Task SubmitVote_Should_ProcessResults_And_CallAi_When_AllPlayersVoted()
    {
        // 1. ARRANGE
        var gameManager = new GameManager();

        // Mockujemy nasz nowy serwis AI - każemy mu zwrócić jedno sztuczne pytanie
        var mockAiService = new Mock<IAiQuestionGenerator>();
        mockAiService
            .Setup(ai => ai.GenerateQuestionsAsync(It.IsAny<string>(), It.IsAny<int>()))
            .ReturnsAsync(new List<Question> { new Question { Text = "Testowe pytanie?" } });

        var hub = new GameHub(gameManager, mockAiService.Object);

        // Mockowanie SignalR (Grupy i Klienci)
        var mockClients = new Mock<IHubCallerClients>();
        var mockGroupProxy = new Mock<IClientProxy>();
        mockClients.Setup(c => c.Group(It.IsAny<string>())).Returns(mockGroupProxy.Object);
        hub.Clients = mockClients.Object;

        // Ręczne przygotowanie pokoju, żeby ominąć cały proces dołączania z Etapu 2
        var roomId = "VOTE";
        var room = new Room
        {
            RoomId = roomId,
            HostConnectionId = "player1",
            AvailableTopics = new List<string> { "Kino", "Historia", "Gry" }
        };
        room.Players.TryAdd("player1", new Player { ConnectionId = "player1" });
        room.Players.TryAdd("player2", new Player { ConnectionId = "player2" });
        gameManager.Rooms.TryAdd(roomId, room);


        // 2. ACT
        // Gracz 1 głosuje na "Kino"
        hub.Context = CreateMockContext("player1");
        await hub.SubmitVote(roomId, "Kino");

        // Gracz 2 głosuje na "Kino" (po tym głosie powinno nastąpić podliczenie, bo zagłosowali wszyscy)
        hub.Context = CreateMockContext("player2");
        await hub.SubmitVote(roomId, "Kino");


        // 3. ASSERT
        // Sprawdzamy stan gry
        Assert.Equal("Kino", room.SelectedTopic); // Zwycięskim tematem powinno być Kino
        Assert.Single(room.CurrentQuestions); // W pokoju powinno znaleźć się wygenerowane pytanie

        // Sprawdzamy, czy informacja o oddanym głosie poszła do frontendu (2 razy - dla p1 i p2)
        mockGroupProxy.Verify(
            proxy => proxy.SendCoreAsync("PlayerVoted",
            It.IsAny<object[]>(),
            default),
            Times.Exactly(2));

        // Sprawdzamy, czy wyemitowano koniec głosowania ze zwycięskim tematem "Kino"
        mockGroupProxy.Verify(
            proxy => proxy.SendCoreAsync("VotingFinished",
            It.Is<object[]>(args => (string)args[0] == "Kino"),
            default),
            Times.Once);

        // Sprawdzamy, czy NASZ SERWIS AI ZOSTAŁ WYWOŁANY DOKŁADNIE RAZ dla tematu "Kino"
        mockAiService.Verify(
            ai => ai.GenerateQuestionsAsync("Kino", 6),
            Times.Once);

        // Sprawdzamy, czy powiadomiono graczy o tym, że pytania są gotowe
        mockGroupProxy.Verify(
            proxy => proxy.SendCoreAsync("QuestionsGenerated",
            It.IsAny<object[]>(),
            default),
            Times.Once);
    }
}