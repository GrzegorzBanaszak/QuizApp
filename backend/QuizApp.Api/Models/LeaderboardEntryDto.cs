namespace QuizApp.Api.Models;

public class LeaderboardEntryDto
{
    public string ConnectionId { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string AvatarUrl { get; set; } = string.Empty;
    public int Score { get; set; }
}
