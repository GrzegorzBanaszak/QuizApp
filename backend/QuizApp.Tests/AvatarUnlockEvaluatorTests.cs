using QuizApp.Api.Models;
using QuizApp.Api.Services.Implementations;

namespace QuizApp.Tests;

public sealed class AvatarUnlockEvaluatorTests
{
    [Fact]
    public void DefaultAvatar_IsAlwaysUnlocked()
    {
        var avatar = new Avatar
        {
            UnlockType = AvatarUnlockType.Default
        };

        var context = CreateContext();

        Assert.True(AvatarUnlockEvaluator.IsUnlocked(avatar, context));
    }

    [Fact]
    public void LevelAvatar_IsUnlockedWhenRequiredLevelWasCompleted()
    {
        var avatar = new Avatar
        {
            UnlockType = AvatarUnlockType.LevelCompletion,
            RequiredLevelKey = "level-7"
        };

        var context = CreateContext(completedLevelKeys: ["level-3", "level-7"]);

        Assert.True(AvatarUnlockEvaluator.IsUnlocked(avatar, context));
    }

    [Fact]
    public void AchievementAvatar_IsLockedWithoutMatchingAchievement()
    {
        var avatar = new Avatar
        {
            UnlockType = AvatarUnlockType.Achievement,
            RequiredAchievementCode = "perfect-streak-10"
        };

        var context = CreateContext(achievementCodes: ["first-win"]);

        Assert.False(AvatarUnlockEvaluator.IsUnlocked(avatar, context));
    }

    [Fact]
    public void PurchaseAvatar_IsUnlockedOnlyWhenOwned()
    {
        var avatar = new Avatar
        {
            Id = 14,
            UnlockType = AvatarUnlockType.Purchase
        };

        var lockedContext = CreateContext();
        var unlockedContext = CreateContext(ownedAvatarIds: [14]);

        Assert.False(AvatarUnlockEvaluator.IsUnlocked(avatar, lockedContext));
        Assert.True(AvatarUnlockEvaluator.IsUnlocked(avatar, unlockedContext));
    }

    private static AvatarUnlockContext CreateContext(
        IEnumerable<string>? completedLevelKeys = null,
        IEnumerable<string>? achievementCodes = null,
        IEnumerable<int>? ownedAvatarIds = null)
    {
        return new AvatarUnlockContext
        {
            CompletedLevelKeys = completedLevelKeys?.ToHashSet(StringComparer.OrdinalIgnoreCase) ?? [],
            AchievementCodes = achievementCodes?.ToHashSet(StringComparer.OrdinalIgnoreCase) ?? [],
            OwnedAvatarIds = ownedAvatarIds?.ToHashSet() ?? []
        };
    }
}
