using QuizApp.Api.Models;

namespace QuizApp.Api.Services.Implementations;

public static class AvatarUnlockEvaluator
{
    public static bool IsUnlocked(Avatar avatar, AvatarUnlockContext context)
    {
        return avatar.UnlockType switch
        {
            AvatarUnlockType.Default => true,
            AvatarUnlockType.LevelCompletion => !string.IsNullOrWhiteSpace(avatar.RequiredLevelKey)
                && context.CompletedLevelKeys.Contains(avatar.RequiredLevelKey),
            AvatarUnlockType.Achievement => !string.IsNullOrWhiteSpace(avatar.RequiredAchievementCode)
                && context.AchievementCodes.Contains(avatar.RequiredAchievementCode),
            AvatarUnlockType.Purchase => context.OwnedAvatarIds.Contains(avatar.Id),
            _ => false
        };
    }
}
