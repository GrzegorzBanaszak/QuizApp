namespace QuizApp.Api.Dto;

public sealed class AchievementDto
{
    public string Code { get; init; } = string.Empty;
    public string Name { get; init; } = string.Empty;
    public string Description { get; init; } = string.Empty;
    public string IconUrl { get; init; } = string.Empty;
    public string TriggerType { get; init; } = string.Empty;
    public string ConditionDescription { get; init; } = string.Empty;
    public string RewardType { get; init; } = string.Empty;
    public string RewardDescription { get; init; } = string.Empty;
    public int? RewardExperience { get; init; }
    public int? RewardCoins { get; init; }
    public string? RewardAvatarKey { get; init; }
    public string? RewardAvatarImageUrl { get; init; }
    public bool IsUnlocked { get; init; }
    public DateTime? AwardedAt { get; init; }
}
