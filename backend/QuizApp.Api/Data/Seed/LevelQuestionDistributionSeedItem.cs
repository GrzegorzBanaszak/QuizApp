using QuizApp.Api.Models;

namespace QuizApp.Api.Data.Seed;

public sealed class LevelQuestionDistributionSeedItem
{
    public QuestionDifficulty Difficulty { get; init; }
    public int Count { get; init; }
}
