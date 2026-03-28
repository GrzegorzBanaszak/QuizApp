namespace QuizApp.Api.Models;

public class LevelQuestionDistribution
{
    public int Id { get; set; }
    public int LevelId { get; set; }
    public Level Level { get; set; } = null!;
    public QuestionDifficulty Difficulty { get; set; }
    public int Count { get; set; }
}
