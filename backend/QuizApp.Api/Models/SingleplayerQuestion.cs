namespace QuizApp.Api.Models;

public class SingleplayerQuestion
{
    public int Id { get; set; }
    public int LevelId { get; set; }
    public Level Level { get; set; } = null!;
    public string Text { get; set; } = string.Empty;
    public string CorrectAnswerId { get; set; } = string.Empty;
    public ICollection<SingleplayerAnswer> Answers { get; set; } = new List<SingleplayerAnswer>();
}
