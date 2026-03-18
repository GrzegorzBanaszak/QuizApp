using System.Collections.Concurrent;

namespace QuizApp.Api.Models;

public class Room
{
    public string RoomId { get; set; } = string.Empty;
    public string HostConnectionId { get; set; } = string.Empty;
    public int NumberOfTopics { get; set; } = 3;
    public RoomStatus Status { get; set; } = RoomStatus.WaitingForPlayers;

    // ConcurrentDictionary jest bezpieczny w środowisku wielowątkowym (jakim jest serwer webowy)
    public ConcurrentDictionary<string, Player> Players { get; set; } = new();
}


public enum RoomStatus
{
    WaitingForPlayers,
    Playing,
    Finished
}