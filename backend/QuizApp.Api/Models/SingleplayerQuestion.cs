namespace QuizApp.Api.Models;

public class SingleplayerQuestion
{
    public int Id { get; set; }
    public string Key { get; set; } = string.Empty;
    public int CategoryId { get; set; }
    public Category Category { get; set; } = null!;
    public QuestionDifficulty Difficulty { get; set; }
    public string Text { get; set; } = string.Empty;
    public string CorrectAnswerId { get; set; } = string.Empty;
    public ICollection<SingleplayerAnswer> Answers { get; set; } = new List<SingleplayerAnswer>();
}
