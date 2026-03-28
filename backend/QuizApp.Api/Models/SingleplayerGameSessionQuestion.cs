namespace QuizApp.Api.Models;

public class SingleplayerGameSessionQuestion
{
    public int Id { get; set; }
    public Guid GameSessionId { get; set; }
    public SingleplayerGameSession GameSession { get; set; } = null!;
    public int QuestionId { get; set; }
    public SingleplayerQuestion Question { get; set; } = null!;
    public int QuestionOrder { get; set; }
}
