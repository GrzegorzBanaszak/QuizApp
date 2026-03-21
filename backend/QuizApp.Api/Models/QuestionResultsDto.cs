namespace QuizApp.Api.Models;

public class QuestionResultsDto
{
    public int CorrectOptionIndex { get; set; }
    public Dictionary<string, QuestionPlayerResultDto> PlayerResults { get; set; } = new();
}
