namespace QuizApp.Api.Dto;

public sealed class AvatarDto
{
    public int Id { get; init; }
    public string Key { get; init; } = string.Empty;
    public string Name { get; init; } = string.Empty;
    public string ImageUrl { get; init; } = string.Empty;
    public string UnlockType { get; init; } = string.Empty;
    public string? RequiredLevelKey { get; init; }
    public string? RequiredAchievementCode { get; init; }
    public int Price { get; init; }
    public bool IsUnlocked { get; init; }
    public bool CanPurchase { get; init; }
    public bool IsSelected { get; init; }
}
