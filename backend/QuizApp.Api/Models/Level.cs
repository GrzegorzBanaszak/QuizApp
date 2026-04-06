namespace QuizApp.Api.Models;

public class Level
{
    public int Id { get; set; }
    public string Key { get; set; } = string.Empty;
    public int CategoryId { get; set; }
    public Category Category { get; set; } = null!;
    public string Name { get; set; } = string.Empty;
    public int Order { get; set; }
    public int FirstCompletionExperience { get; set; }
    public int ReplayExperience { get; set; }
    public ICollection<LevelQuestionDistribution> QuestionDistributions { get; set; } = new List<LevelQuestionDistribution>();
}
