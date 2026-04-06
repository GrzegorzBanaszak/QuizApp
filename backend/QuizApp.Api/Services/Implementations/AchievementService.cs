using Microsoft.EntityFrameworkCore;
using QuizApp.Api.Data;
using QuizApp.Api.Dto;
using QuizApp.Api.Models;
using QuizApp.Api.Services.Abstractions;

namespace QuizApp.Api.Services.Implementations;

public sealed class AchievementService : IAchievementService
{
    private readonly AppDbContext _dbContext;

    public AchievementService(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<IReadOnlyList<AchievementDto>> GetCatalogAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        var definitions = await _dbContext.AchievementDefinitions
            .AsNoTracking()
            .OrderBy(item => item.SortOrder)
            .ThenBy(item => item.Id)
            .ToListAsync(cancellationToken);

        if (definitions.Count == 0)
        {
            return [];
        }

        var awardedByCode = (await _dbContext.UserAchievements
                .AsNoTracking()
                .Where(item => item.UserId == userId)
                .ToListAsync(cancellationToken))
            .ToDictionary(item => item.Code, item => item.AwardedAt, StringComparer.OrdinalIgnoreCase);

        var levelSummaries = await _dbContext.Levels
            .AsNoTracking()
            .Select(item => new LevelSummary(
                item.Key,
                item.Name,
                item.Category.Key,
                item.Category.Name,
                item.Order))
            .ToListAsync(cancellationToken);

        var levelByKey = levelSummaries
            .ToDictionary(item => item.Key, item => item, StringComparer.OrdinalIgnoreCase);

        var levelNamesByKey = levelSummaries
            .ToDictionary(item => item.Key, item => item.Name, StringComparer.OrdinalIgnoreCase);

        var levelsByCategoryKey = levelSummaries
            .GroupBy(item => item.CategoryKey, StringComparer.OrdinalIgnoreCase)
            .ToDictionary(
                group => group.Key,
                group => (IReadOnlyList<LevelSummary>)group
                    .OrderBy(level => level.Order)
                    .ThenBy(level => level.Key, StringComparer.OrdinalIgnoreCase)
                    .ToList(),
                StringComparer.OrdinalIgnoreCase);

        var categoryNamesByKey = levelsByCategoryKey
            .ToDictionary(
                pair => pair.Key,
                pair => pair.Value.First().CategoryName,
                StringComparer.OrdinalIgnoreCase);

        var completedLevelKeys = (await _dbContext.SingleplayerResults
                .AsNoTracking()
                .Where(item => item.UserId == userId)
                .Select(item => item.Level.Key)
                .Distinct()
                .ToListAsync(cancellationToken))
            .ToHashSet(StringComparer.OrdinalIgnoreCase);

        var completedLevelsByCategoryKey = levelSummaries
            .Where(item => completedLevelKeys.Contains(item.Key))
            .GroupBy(item => item.CategoryKey, StringComparer.OrdinalIgnoreCase)
            .ToDictionary(
                group => group.Key,
                group => group.Select(level => level.Key)
                    .Distinct(StringComparer.OrdinalIgnoreCase)
                    .Count(),
                StringComparer.OrdinalIgnoreCase);

        var completedCategoryKeys = levelsByCategoryKey
            .Where(pair => pair.Value.Count > 0
                && pair.Value.All(level => completedLevelKeys.Contains(level.Key)))
            .Select(pair => pair.Key)
            .ToHashSet(StringComparer.OrdinalIgnoreCase);

        var avatarsByKey = await BuildAvatarLookupAsync(cancellationToken);

        return definitions
            .Select(definition =>
            {
                var isUnlocked = awardedByCode.ContainsKey(definition.Code);
                var progress = BuildProgress(
                    definition,
                    levelByKey,
                    levelsByCategoryKey,
                    completedLevelKeys,
                    completedLevelsByCategoryKey,
                    completedCategoryKeys,
                    isUnlocked);

                return new AchievementDto
                {
                    Code = definition.Code,
                    Name = definition.Name,
                    Description = definition.Description,
                    IconUrl = definition.IconUrl,
                    IsElite = IsElite(definition),
                    TriggerType = definition.TriggerType.ToString(),
                    ConditionDescription = BuildConditionDescription(definition, levelNamesByKey, categoryNamesByKey),
                    CurrentProgress = progress.Current,
                    RequiredProgress = progress.Required,
                    ProgressPercent = progress.Percent,
                    ProgressLabel = progress.Label,
                    RewardType = definition.RewardType.ToString(),
                    RewardDescription = BuildRewardDescription(definition, avatarsByKey),
                    RewardExperience = definition.RewardExperience,
                    RewardCoins = definition.RewardCoins,
                    RewardAvatarKey = definition.RewardAvatarKey,
                    RewardAvatarImageUrl = TryGetRewardAvatarImageUrl(definition, avatarsByKey),
                    IsUnlocked = isUnlocked,
                    AwardedAt = awardedByCode.GetValueOrDefault(definition.Code)
                };
            })
            .ToList();
    }

    public async Task<AchievementEvaluationResult> EvaluateAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        var definitions = await _dbContext.AchievementDefinitions
            .AsNoTracking()
            .OrderBy(item => item.SortOrder)
            .ThenBy(item => item.Id)
            .ToListAsync(cancellationToken);

        if (definitions.Count == 0)
        {
            return new AchievementEvaluationResult();
        }

        var existingCodes = (await _dbContext.UserAchievements
                .AsNoTracking()
                .Where(item => item.UserId == userId)
                .Select(item => item.Code)
                .ToListAsync(cancellationToken))
            .ToHashSet(StringComparer.OrdinalIgnoreCase);

        var completedLevelKeys = (await _dbContext.SingleplayerResults
                .AsNoTracking()
                .Where(item => item.UserId == userId)
                .Select(item => item.Level.Key)
                .Distinct()
                .ToListAsync(cancellationToken))
            .ToHashSet(StringComparer.OrdinalIgnoreCase);

        var completedCategoryKeys = await BuildCompletedCategoryKeysAsync(completedLevelKeys, cancellationToken);

        var unlockedDefinitions = definitions
            .Where(definition => !existingCodes.Contains(definition.Code))
            .Where(definition => IsSatisfied(definition, completedLevelKeys, completedCategoryKeys))
            .ToList();

        if (unlockedDefinitions.Count == 0)
        {
            return new AchievementEvaluationResult();
        }

        var awardedAt = DateTime.UtcNow;
        foreach (var definition in unlockedDefinitions)
        {
            _dbContext.UserAchievements.Add(new UserAchievement
            {
                UserId = userId,
                Code = definition.Code,
                AwardedAt = awardedAt
            });
        }

        var awardedCoins = unlockedDefinitions
            .Where(item => item.RewardType == AchievementRewardType.Coins)
            .Sum(item => item.RewardCoins ?? 0);

        var awardedExperience = unlockedDefinitions.Sum(item => item.RewardExperience ?? 0);

        if (awardedCoins > 0 || awardedExperience > 0)
        {
            var user = await _dbContext.Users
                .SingleOrDefaultAsync(item => item.Id == userId, cancellationToken)
                ?? throw new KeyNotFoundException($"User {userId} was not found.");

            user.Coins += awardedCoins;
            user.TotalExperience += awardedExperience;
        }

        await _dbContext.SaveChangesAsync(cancellationToken);

        var avatarLookup = await BuildAvatarLookupAsync(cancellationToken);

        return new AchievementEvaluationResult
        {
            AwardedExperience = awardedExperience,
            AwardedCoins = awardedCoins,
            UnlockedAchievements = unlockedDefinitions
                .Select(definition => new AchievementAwardDto
                {
                    Code = definition.Code,
                    Name = definition.Name,
                    Description = definition.Description,
                    IconUrl = definition.IconUrl,
                    RewardType = definition.RewardType.ToString(),
                    RewardDescription = BuildRewardDescription(definition, avatarLookup),
                    RewardExperience = definition.RewardExperience,
                    RewardCoins = definition.RewardCoins,
                    RewardAvatarKey = definition.RewardAvatarKey,
                    RewardAvatarImageUrl = TryGetRewardAvatarImageUrl(definition, avatarLookup)
                })
                .ToList()
        };
    }

    private async Task<HashSet<string>> BuildCompletedCategoryKeysAsync(
        IReadOnlySet<string> completedLevelKeys,
        CancellationToken cancellationToken)
    {
        var categoryLevels = await _dbContext.Categories
            .AsNoTracking()
            .Include(item => item.Levels)
            .Select(item => new
            {
                item.Key,
                LevelKeys = item.Levels.Select(level => level.Key).ToList()
            })
            .ToListAsync(cancellationToken);

        return categoryLevels
            .Where(item => item.LevelKeys.Count > 0 && item.LevelKeys.All(levelKey => completedLevelKeys.Contains(levelKey)))
            .Select(item => item.Key)
            .ToHashSet(StringComparer.OrdinalIgnoreCase);
    }

    private async Task<Dictionary<string, AvatarRewardInfo>> BuildAvatarLookupAsync(CancellationToken cancellationToken)
    {
        return (await _dbContext.Avatars
                .AsNoTracking()
                .Select(item => new AvatarRewardInfo(item.Key, item.Name, item.ImageUrl))
                .ToListAsync(cancellationToken))
            .ToDictionary(item => item.Key, item => item, StringComparer.OrdinalIgnoreCase);
    }

    private static bool IsSatisfied(
        AchievementDefinition definition,
        IReadOnlySet<string> completedLevelKeys,
        IReadOnlySet<string> completedCategoryKeys)
    {
        return definition.TriggerType switch
        {
            AchievementTriggerType.LevelCompletion => definition.RequiredLevelKey is not null
                && completedLevelKeys.Contains(definition.RequiredLevelKey),
            AchievementTriggerType.CategoryCompletion => definition.RequiredCategoryKey is not null
                && completedCategoryKeys.Contains(definition.RequiredCategoryKey),
            AchievementTriggerType.CompletedCategoriesCount => definition.RequiredCompletedCategoriesCount is not null
                && completedCategoryKeys.Count >= definition.RequiredCompletedCategoriesCount.Value,
            _ => false
        };
    }

    private static string BuildConditionDescription(
        AchievementDefinition definition,
        IReadOnlyDictionary<string, string> levelNamesByKey,
        IReadOnlyDictionary<string, string> categoryNamesByKey)
    {
        return definition.TriggerType switch
        {
            AchievementTriggerType.LevelCompletion => $"Ukoncz poziom {ResolveName(definition.RequiredLevelKey, levelNamesByKey)}.",
            AchievementTriggerType.CategoryCompletion => $"Ukoncz kategorie {ResolveName(definition.RequiredCategoryKey, categoryNamesByKey)}.",
            AchievementTriggerType.CompletedCategoriesCount => $"Ukoncz {definition.RequiredCompletedCategoriesCount} kategorii.",
            _ => definition.Description
        };
    }

    private static AchievementProgress BuildProgress(
        AchievementDefinition definition,
        IReadOnlyDictionary<string, LevelSummary> levelByKey,
        IReadOnlyDictionary<string, IReadOnlyList<LevelSummary>> levelsByCategoryKey,
        IReadOnlySet<string> completedLevelKeys,
        IReadOnlyDictionary<string, int> completedLevelsByCategoryKey,
        IReadOnlySet<string> completedCategoryKeys,
        bool isUnlocked)
    {
        switch (definition.TriggerType)
        {
            case AchievementTriggerType.LevelCompletion when definition.RequiredLevelKey is not null:
            {
                if (!levelByKey.TryGetValue(definition.RequiredLevelKey, out var requiredLevel))
                {
                    return CreateProgress(isUnlocked ? 1 : 0, 1);
                }

                if (!levelsByCategoryKey.TryGetValue(requiredLevel.CategoryKey, out var categoryLevels))
                {
                    return CreateProgress(isUnlocked || completedLevelKeys.Contains(requiredLevel.Key) ? 1 : 0, 1);
                }

                var requiredCount = Math.Max(categoryLevels.Count(level => level.Order <= requiredLevel.Order), 1);
                var currentCount = isUnlocked || completedLevelKeys.Contains(requiredLevel.Key)
                    ? requiredCount
                    : categoryLevels.Count(level =>
                        level.Order <= requiredLevel.Order && completedLevelKeys.Contains(level.Key));

                return CreateProgress(currentCount, requiredCount);
            }

            case AchievementTriggerType.CategoryCompletion when definition.RequiredCategoryKey is not null:
            {
                if (!levelsByCategoryKey.TryGetValue(definition.RequiredCategoryKey, out var categoryLevels))
                {
                    return CreateProgress(isUnlocked ? 1 : 0, 1);
                }

                var requiredCount = Math.Max(categoryLevels.Count, 1);
                completedLevelsByCategoryKey.TryGetValue(definition.RequiredCategoryKey, out var completedCount);

                var currentCount = isUnlocked || completedCategoryKeys.Contains(definition.RequiredCategoryKey)
                    ? requiredCount
                    : completedCount;

                return CreateProgress(currentCount, requiredCount);
            }

            case AchievementTriggerType.CompletedCategoriesCount when definition.RequiredCompletedCategoriesCount is > 0:
            {
                var requiredCount = definition.RequiredCompletedCategoriesCount.Value;
                var currentCount = isUnlocked ? requiredCount : completedCategoryKeys.Count;
                return CreateProgress(currentCount, requiredCount);
            }

            default:
                return CreateProgress(isUnlocked ? 1 : 0, 1);
        }
    }

    private static AchievementProgress CreateProgress(int current, int required)
    {
        var safeRequired = Math.Max(required, 1);
        var safeCurrent = Math.Clamp(current, 0, safeRequired);
        var percent = (int)Math.Round((double)safeCurrent * 100 / safeRequired, MidpointRounding.AwayFromZero);

        return new AchievementProgress(safeCurrent, safeRequired, percent, $"{safeCurrent}/{safeRequired}");
    }

    private static string BuildRewardDescription(
        AchievementDefinition definition,
        IReadOnlyDictionary<string, AvatarRewardInfo> avatarsByKey)
    {
        var rewardParts = new List<string>();

        if (definition.RewardExperience is > 0)
        {
            rewardParts.Add($"{definition.RewardExperience.Value} XP");
        }

        switch (definition.RewardType)
        {
            case AchievementRewardType.Coins:
                rewardParts.Add($"{definition.RewardCoins ?? 0} monet");
                break;
            case AchievementRewardType.Avatar when definition.RewardAvatarKey is not null
                && avatarsByKey.TryGetValue(definition.RewardAvatarKey, out var avatar):
                rewardParts.Add(IsIconName(avatar.Name) ? avatar.Name : $"avatar {avatar.Name}");
                break;
            case AchievementRewardType.Avatar when definition.RewardAvatarKey is not null:
                rewardParts.Add($"avatar {definition.RewardAvatarKey}");
                break;
        }

        return rewardParts.Count == 0
            ? string.Empty
            : $"Nagroda: {string.Join(", ", rewardParts)}.";
    }

    private static string? TryGetRewardAvatarImageUrl(
        AchievementDefinition definition,
        IReadOnlyDictionary<string, AvatarRewardInfo> avatarsByKey)
    {
        if (definition.RewardAvatarKey is null || !avatarsByKey.TryGetValue(definition.RewardAvatarKey, out var avatar))
        {
            return null;
        }

        return avatar.ImageUrl;
    }

    private static string ResolveName(string? key, IReadOnlyDictionary<string, string> valuesByKey)
    {
        if (key is null)
        {
            return string.Empty;
        }

        return valuesByKey.TryGetValue(key, out var value)
            ? value
            : key;
    }

    private static bool IsElite(AchievementDefinition definition)
    {
        return definition.Code.EndsWith("-elite", StringComparison.OrdinalIgnoreCase);
    }

    private static bool IsIconName(string value)
    {
        return value.Contains("icon", StringComparison.OrdinalIgnoreCase)
            || value.Contains("ikona", StringComparison.OrdinalIgnoreCase);
    }

    private sealed record AvatarRewardInfo(string Key, string Name, string ImageUrl);
    private sealed record LevelSummary(string Key, string Name, string CategoryKey, string CategoryName, int Order);
    private sealed record AchievementProgress(int Current, int Required, int Percent, string Label);
}
