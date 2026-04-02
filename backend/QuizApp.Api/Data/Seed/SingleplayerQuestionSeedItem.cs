using QuizApp.Api.Models;

namespace QuizApp.Api.Data.Seed;

public sealed class SingleplayerQuestionSeedItem
{
    public string Key { get; init; } = string.Empty;
    public string CategoryKey { get; init; } = string.Empty;
    public QuestionDifficulty Difficulty { get; init; }
    public string Text { get; init; } = string.Empty;
    public string CorrectAnswerId { get; init; } = string.Empty;
    public List<SingleplayerAnswerSeedItem> Answers { get; init; } = [];
}
