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

    // NOWE POLA DO ETAPU 3:
    public List<string> AvailableTopics { get; set; } = new(); // Tematy do wyboru w danej rundzie
    public ConcurrentDictionary<string, string> PlayerVotes { get; set; } = new(); // Kto (ConnectionId) -> na co zagłosował
    public string? SelectedTopic { get; set; } // Zwycięski temat
    public List<Question> CurrentQuestions { get; set; } = new(); // Wygenerowane pytania
    public int CurrentQuestionIndex { get; set; } = 0; // Które pytanie z rzędu aktualnie gramy
}


public enum RoomStatus
{
    WaitingForPlayers,
    Playing,
    Finished
}