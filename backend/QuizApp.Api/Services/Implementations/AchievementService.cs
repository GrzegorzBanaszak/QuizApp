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

        var levelNamesByKey = (await _dbContext.Levels
                .AsNoTracking()
                .Select(item => new { item.Key, item.Name })
                .ToListAsync(cancellationToken))
            .ToDictionary(item => item.Key, item => item.Name, StringComparer.OrdinalIgnoreCase);

        var categoryNamesByKey = (await _dbContext.Categories
                .AsNoTracking()
                .Select(item => new { item.Key, item.Name })
                .ToListAsync(cancellationToken))
            .ToDictionary(item => item.Key, item => item.Name, StringComparer.OrdinalIgnoreCase);

        var avatarsByKey = await BuildAvatarLookupAsync(cancellationToken);

        return definitions
            .Select(definition => new AchievementDto
            {
                Code = definition.Code,
                Name = definition.Name,
                Description = definition.Description,
                IconUrl = definition.IconUrl,
                TriggerType = definition.TriggerType.ToString(),
                ConditionDescription = BuildConditionDescription(definition, levelNamesByKey, categoryNamesByKey),
                RewardType = definition.RewardType.ToString(),
                RewardDescription = BuildRewardDescription(definition, avatarsByKey),
                RewardCoins = definition.RewardCoins,
                RewardAvatarKey = definition.RewardAvatarKey,
                RewardAvatarImageUrl = TryGetRewardAvatarImageUrl(definition, avatarsByKey),
                IsUnlocked = awardedByCode.ContainsKey(definition.Code),
                AwardedAt = awardedByCode.GetValueOrDefault(definition.Code)
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

        if (awardedCoins > 0)
        {
            var user = await _dbContext.Users
                .SingleOrDefaultAsync(item => item.Id == userId, cancellationToken)
                ?? throw new KeyNotFoundException($"User {userId} was not found.");

            user.Coins += awardedCoins;
        }

        await _dbContext.SaveChangesAsync(cancellationToken);

        var avatarLookup = await BuildAvatarLookupAsync(cancellationToken);

        return new AchievementEvaluationResult
        {
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
            AchievementTriggerType.LevelCompletion => $"Ukończ poziom {ResolveName(definition.RequiredLevelKey, levelNamesByKey)}.",
            AchievementTriggerType.CategoryCompletion => $"Ukończ kategorię {ResolveName(definition.RequiredCategoryKey, categoryNamesByKey)}.",
            AchievementTriggerType.CompletedCategoriesCount => $"Ukończ {definition.RequiredCompletedCategoriesCount} kategorii.",
            _ => definition.Description
        };
    }

    private static string BuildRewardDescription(
        AchievementDefinition definition,
        IReadOnlyDictionary<string, AvatarRewardInfo> avatarsByKey)
    {
        return definition.RewardType switch
        {
            AchievementRewardType.Coins => $"Nagroda: {definition.RewardCoins ?? 0} monet.",
            AchievementRewardType.Avatar when definition.RewardAvatarKey is not null
                && avatarsByKey.TryGetValue(definition.RewardAvatarKey, out var avatar) =>
                $"Nagroda: avatar {avatar.Name}.",
            AchievementRewardType.Avatar when definition.RewardAvatarKey is not null =>
                $"Nagroda: avatar {definition.RewardAvatarKey}.",
            _ => string.Empty
        };
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

    private sealed record AvatarRewardInfo(string Key, string Name, string ImageUrl);
}
