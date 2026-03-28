namespace QuizApp.Api.Models;

public class SingleplayerGameSession
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;
    public int LevelId { get; set; }
    public Level Level { get; set; } = null!;
    public DateTime StartedAt { get; set; } = DateTime.UtcNow;
    public ICollection<SingleplayerGameSessionQuestion> Questions { get; set; } = new List<SingleplayerGameSessionQuestion>();
}
