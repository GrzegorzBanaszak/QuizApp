namespace QuizApp.Api.Models;

public class AchievementDefinition
{
    public int Id { get; set; }
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string IconUrl { get; set; } = string.Empty;
    public int SortOrder { get; set; }
    public AchievementTriggerType TriggerType { get; set; }
    public string? RequiredLevelKey { get; set; }
    public string? RequiredCategoryKey { get; set; }
    public int? RequiredCompletedCategoriesCount { get; set; }
    public AchievementRewardType RewardType { get; set; }
    public int? RewardExperience { get; set; }
    public int? RewardCoins { get; set; }
    public string? RewardAvatarKey { get; set; }
}
