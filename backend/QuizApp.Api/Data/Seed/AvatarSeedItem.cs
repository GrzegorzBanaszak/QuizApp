using QuizApp.Api.Models;

namespace QuizApp.Api.Data.Seed;

public sealed class AvatarSeedItem
{
    public string Key { get; init; } = string.Empty;
    public string Name { get; init; } = string.Empty;
    public string ImageUrl { get; init; } = string.Empty;
    public int SortOrder { get; init; }
    public AvatarUnlockType UnlockType { get; init; }
    public string? RequiredAchievementCode { get; init; }
    public int Price { get; init; }
}
