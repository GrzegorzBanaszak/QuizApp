namespace QuizApp.Api.Models;

public class RoundSummaryDto
{
    public List<LeaderboardEntryDto> Leaderboard { get; set; } = new();
    public int CurrentRound { get; set; }
    public int TotalRounds { get; set; }
    public string? JustPlayedTopic { get; set; }
    public bool IsFinished { get; set; }
}
