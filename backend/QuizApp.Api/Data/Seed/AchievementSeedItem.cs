using QuizApp.Api.Models;

namespace QuizApp.Api.Data.Seed;

public sealed class AchievementSeedItem
{
    public string Code { get; init; } = string.Empty;
    public string Name { get; init; } = string.Empty;
    public string Description { get; init; } = string.Empty;
    public string IconUrl { get; init; } = string.Empty;
    public int SortOrder { get; init; }
    public AchievementTriggerType TriggerType { get; init; }
    public string? RequiredLevelKey { get; init; }
    public string? RequiredCategoryKey { get; init; }
    public int? RequiredCompletedCategoriesCount { get; init; }
    public AchievementRewardType RewardType { get; init; }
    public int? RewardExperience { get; init; }
    public int? RewardCoins { get; init; }
    public string? RewardAvatarKey { get; init; }
}
