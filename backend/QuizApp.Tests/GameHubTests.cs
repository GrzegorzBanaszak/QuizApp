using Microsoft.AspNetCore.SignalR;
using Moq;
using QuizApp.Api.Hubs;
using QuizApp.Api.Models;
using QuizApp.Api.Services;
using Xunit;

namespace QuizApp.Tests;

public class GameHubTests
{
    [Fact]
    public async Task CreateRoom_Should_CallRoomCreated_And_BroadcastRoomsList()
    {
        // Arrange
        var gameManager = new GameManager();
        var mockAiService = new Mock<IAiQuestionGenerator>();
        mockAiService
            .Setup(ai => ai.GenerateQuestionsAsync(It.IsAny<string>(), It.IsAny<int>()))
            .ReturnsAsync(new List<Question> { new Question { Text = "Testowe pytanie?" } });
        var hub = new GameHub(gameManager, mockAiService.Object);

        // 1. Mockowanie kontekstu (symulujemy ConnectionId)
        var mockContext = new Mock<HubCallerContext>();
        mockContext.Setup(c => c.ConnectionId).Returns("fake-connection-id");
        hub.Context = mockContext.Object;

        // 2. Mockowanie klientów (symulujemy odbieranie wiadomości przez front)
        var mockClients = new Mock<IHubCallerClients>();
        var mockCallerProxy = new Mock<ISingleClientProxy>();
        var mockAllProxy = new Mock<IClientProxy>();

        mockClients.Setup(c => c.Caller).Returns(mockCallerProxy.Object);
        mockClients.Setup(c => c.All).Returns(mockAllProxy.Object);
        hub.Clients = mockClients.Object;

        // Act
        await hub.CreateRoom();

        // Assert
        Assert.Single(gameManager.Rooms); // GameManager powinien mieć 1 pokój

        // Sprawdzamy, czy do Caller'a (twórcy) wysłano zdarzenie "RoomCreated" z kodem pokoju
        mockCallerProxy.Verify(
            proxy => proxy.SendCoreAsync("RoomCreated",
            It.Is<object[]>(args => args.Length == 1 && args[0] is string),
            default),
            Times.Once);

        // Sprawdzamy, czy do wszystkich wysłano odświeżoną listę pokoi "ReceiveRoomsList"
        mockAllProxy.Verify(
            proxy => proxy.SendCoreAsync("ReceiveRoomsList",
            It.IsAny<object[]>(),
            default),
            Times.Once);
    }

    // Pomocnicza metoda do tworzenia sztucznego kontekstu (różne ConnectionId dla różnych graczy)
    private HubCallerContext CreateMockContext(string connectionId)
    {
        var mockContext = new Mock<HubCallerContext>();
        mockContext.Setup(c => c.ConnectionId).Returns(connectionId);
        return mockContext.Object;
    }

    [Fact]
    public async Task FullPreGameFlow_Should_Successfully_StartGame_With_3Players()
    {
        // 1. ARRANGE - Przygotowanie środowiska i mocków
        var gameManager = new GameManager();

        var mockAiService = new Mock<IAiQuestionGenerator>();
        mockAiService
            .Setup(ai => ai.GenerateQuestionsAsync(It.IsAny<string>(), It.IsAny<int>()))
            .ReturnsAsync(new List<Question> { new Question { Text = "Testowe pytanie?" } });

        var hub = new GameHub(gameManager, mockAiService.Object);

        // Mockowanie obiektów SignalR
        var mockClients = new Mock<IHubCallerClients>();
        var mockGroupProxy = new Mock<IClientProxy>();
        var mockCallerProxy = new Mock<ISingleClientProxy>();
        var mockAllProxy = new Mock<IClientProxy>();
        var mockGroups = new Mock<IGroupManager>();

        mockClients.Setup(c => c.Group(It.IsAny<string>())).Returns(mockGroupProxy.Object);
        mockClients.Setup(c => c.Caller).Returns(mockCallerProxy.Object);
        mockClients.Setup(c => c.All).Returns(mockAllProxy.Object);

        hub.Clients = mockClients.Object;
        hub.Groups = mockGroups.Object; // Do testowania grup

        // 2. ACT - Wykonywanie scenariusza krok po kroku

        // KROK A: Host wchodzi i tworzy pokój
        hub.Context = CreateMockContext("host-conn-id");
        await hub.CreateRoom();

        // Pobieramy wygenerowany ID pokoju prosto z menedżera
        var roomId = gameManager.Rooms.Keys.First();

        // KROK B: Dołączanie 3 graczy (Host musi też dołączyć jako gracz!)
        // Host:
        await hub.JoinRoom(roomId, "HostName", "avatar1.png");

        // Gracz 2:
        hub.Context = CreateMockContext("player2-conn-id");
        await hub.JoinRoom(roomId, "Gracz2", "avatar2.png");

        // Gracz 3:
        hub.Context = CreateMockContext("player3-conn-id");
        await hub.JoinRoom(roomId, "Gracz3", "avatar3.png");

        // KROK C: Host wybiera liczbę rund/tematów (np. 5)
        hub.Context = CreateMockContext("host-conn-id");
        await hub.SetNumberOfTopics(roomId, 5);

        // KROK D: Wszyscy gracze zgłaszają gotowość
        await hub.SetReadyStatus(roomId, true); // Host jest gotowy

        hub.Context = CreateMockContext("player2-conn-id");
        await hub.SetReadyStatus(roomId, true); // Gracz 2 jest gotowy

        hub.Context = CreateMockContext("player3-conn-id");
        await hub.SetReadyStatus(roomId, true); // Gracz 3 jest gotowy

        // KROK E: Host klika START
        hub.Context = CreateMockContext("host-conn-id");
        await hub.StartGame(roomId);

        // 3. ASSERT - Sprawdzamy czy wszystko zadziałało jak powinno
        var room = gameManager.Rooms[roomId];

        // Sprawdzamy stan gry w pamięci
        Assert.Equal(3, room.Players.Count); // W pokoju musi być 3 graczy
        Assert.Equal(5, room.NumberOfTopics); // Liczba tematów to 5
        Assert.True(room.Players.Values.All(p => p.IsReady)); // Wszyscy są gotowi
        Assert.Equal(RoomStatus.Playing, room.Status); // Status pokoju musiał zmienić się na Playing

        // Sprawdzamy czy do grupy wysłano informację o zmianie liczby tematów
        mockGroupProxy.Verify(
            proxy => proxy.SendCoreAsync("NumberOfTopicsChanged",
            It.Is<object[]>(args => (int)args[0] == 5),
            default),
            Times.Once);

        // Sprawdzamy czy aplikacja ostatecznie wyemitowała start gry dla całego pokoju
        mockGroupProxy.Verify(
            proxy => proxy.SendCoreAsync("GameStarted",
            It.Is<object[]>(args => args.Length == 0),
            default),
            Times.Once);
    }
}
