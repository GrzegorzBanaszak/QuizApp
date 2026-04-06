namespace QuizApp.Api.Dto;

public sealed class AchievementAwardDto
{
    public string Code { get; init; } = string.Empty;
    public string Name { get; init; } = string.Empty;
    public string Description { get; init; } = string.Empty;
    public string IconUrl { get; init; } = string.Empty;
    public string RewardType { get; init; } = string.Empty;
    public string RewardDescription { get; init; } = string.Empty;
    public int? RewardExperience { get; init; }
    public int? RewardCoins { get; init; }
    public string? RewardAvatarKey { get; init; }
    public string? RewardAvatarImageUrl { get; init; }
}
