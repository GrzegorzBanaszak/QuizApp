namespace QuizApp.Api.Services.Implementations;

public sealed class AvatarUnlockContext
{
    public required HashSet<string> CompletedLevelKeys { get; init; }
    public required HashSet<string> AchievementCodes { get; init; }
    public required HashSet<int> OwnedAvatarIds { get; init; }
}
