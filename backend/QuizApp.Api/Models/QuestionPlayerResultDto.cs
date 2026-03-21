namespace QuizApp.Api.Models;

public class QuestionPlayerResultDto
{
    public bool IsCorrect { get; set; }
    public int PointsEarned { get; set; }
    public int TotalScore { get; set; }
}
