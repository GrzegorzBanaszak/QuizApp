namespace QuizApp.Api.Models;

public class SingleplayerAnswer
{
    public string Id { get; set; } = string.Empty;
    public int QuestionId { get; set; }
    public SingleplayerQuestion Question { get; set; } = null!;
    public string Text { get; set; } = string.Empty;
}
