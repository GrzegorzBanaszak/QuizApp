namespace QuizApp.Api.Models;

public class SingleplayerResult
{
    public int Id { get; set; }
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;
    public Guid GameSessionId { get; set; }
    public SingleplayerGameSession GameSession { get; set; } = null!;
    public int LevelId { get; set; }
    public Level Level { get; set; } = null!;
    public int Score { get; set; }
    public int CorrectAnswers { get; set; }
    public int TotalQuestions { get; set; }
    public DateTime PlayedAt { get; set; } = DateTime.UtcNow;
}
