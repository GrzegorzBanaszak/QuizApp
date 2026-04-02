namespace QuizApp.Api.Data.Seed;

public sealed class LevelSeedItem
{
    public string Key { get; init; } = string.Empty;
    public string CategoryKey { get; init; } = string.Empty;
    public string Name { get; init; } = string.Empty;
    public int Order { get; init; }
    public List<LevelQuestionDistributionSeedItem> QuestionDistributions { get; init; } = [];
}
