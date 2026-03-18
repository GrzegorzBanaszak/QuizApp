using Microsoft.AspNetCore.SignalR;
using Moq;
using QuizApp.Api.Hubs;
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
        var hub = new GameHub(gameManager);

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
}
