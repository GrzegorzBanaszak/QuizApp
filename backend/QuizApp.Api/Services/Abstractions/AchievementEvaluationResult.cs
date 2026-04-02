using QuizApp.Api.Dto;

namespace QuizApp.Api.Services.Abstractions;

public sealed class AchievementEvaluationResult
{
    public int AwardedCoins { get; init; }
    public IReadOnlyList<AchievementAwardDto> UnlockedAchievements { get; init; } = [];
}
