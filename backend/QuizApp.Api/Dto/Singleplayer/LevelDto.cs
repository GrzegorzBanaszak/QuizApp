namespace QuizApp.Api.Dto.Singleplayer;

public sealed record LevelDto
{
    public int Id { get; init; }
    public int CategoryId { get; init; }
    public string Name { get; init; } = string.Empty;
    public List<LevelQuestionDistributionDto> QuestionDistributions { get; init; } = new();
    public int TotalQuestionCount { get; init; }
    public bool IsUnlocked { get; init; }
}
