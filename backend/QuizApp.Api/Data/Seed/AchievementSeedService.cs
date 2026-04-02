using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using QuizApp.Api.Models;

namespace QuizApp.Api.Data.Seed;

public sealed class AchievementSeedService
{
    private readonly AppDbContext _dbContext;
    private readonly AchievementSeedOptions _options;
    private readonly IWebHostEnvironment _environment;
    private readonly ILogger<AchievementSeedService> _logger;

    public AchievementSeedService(
        AppDbContext dbContext,
        IOptions<AchievementSeedOptions> options,
        IWebHostEnvironment environment,
        ILogger<AchievementSeedService> logger)
    {
        _dbContext = dbContext;
        _options = options.Value;
        _environment = environment;
        _logger = logger;
    }

    public async Task SeedAsync(CancellationToken cancellationToken = default)
    {
        var filePath = Path.Combine(_environment.ContentRootPath, _options.FilePath);
        if (!File.Exists(filePath))
        {
            _logger.LogWarning("Achievement seed file was not found at {FilePath}.", filePath);
            return;
        }

        var items = await SeedJsonFileReader.ReadListAsync<AchievementSeedItem>(filePath, cancellationToken);
        if (items is null || items.Count == 0)
        {
            _logger.LogWarning("Achievement seed file {FilePath} does not contain any achievements.", filePath);
            return;
        }

        var duplicatedCodes = items
            .GroupBy(item => item.Code, StringComparer.OrdinalIgnoreCase)
            .Where(group => group.Count() > 1)
            .Select(group => group.Key)
            .ToList();

        if (duplicatedCodes.Count > 0)
        {
            throw new InvalidOperationException($"Achievement seed contains duplicated codes: {string.Join(", ", duplicatedCodes)}");
        }

        var existingDefinitions = await _dbContext.AchievementDefinitions
            .ToDictionaryAsync(item => item.Code, StringComparer.OrdinalIgnoreCase, cancellationToken);

        foreach (var item in items)
        {
            Validate(item);

            if (!existingDefinitions.TryGetValue(item.Code, out var definition))
            {
                definition = new AchievementDefinition();
                _dbContext.AchievementDefinitions.Add(definition);
            }

            definition.Code = item.Code.Trim();
            definition.Name = item.Name.Trim();
            definition.Description = item.Description.Trim();
            definition.IconUrl = item.IconUrl.Trim();
            definition.SortOrder = item.SortOrder;
            definition.TriggerType = item.TriggerType;
            definition.RequiredLevelKey = TrimOrNull(item.RequiredLevelKey);
            definition.RequiredCategoryKey = TrimOrNull(item.RequiredCategoryKey);
            definition.RequiredCompletedCategoriesCount = item.RequiredCompletedCategoriesCount;
            definition.RewardType = item.RewardType;
            definition.RewardCoins = item.RewardCoins;
            definition.RewardAvatarKey = TrimOrNull(item.RewardAvatarKey);
        }

        await _dbContext.SaveChangesAsync(cancellationToken);
    }

    private static void Validate(AchievementSeedItem item)
    {
        if (string.IsNullOrWhiteSpace(item.Code))
        {
            throw new InvalidOperationException("Achievement code is required.");
        }

        if (string.IsNullOrWhiteSpace(item.Name))
        {
            throw new InvalidOperationException($"Achievement {item.Code} must have a name.");
        }

        if (string.IsNullOrWhiteSpace(item.Description))
        {
            throw new InvalidOperationException($"Achievement {item.Code} must have a description.");
        }

        if (string.IsNullOrWhiteSpace(item.IconUrl))
        {
            throw new InvalidOperationException($"Achievement {item.Code} must have an iconUrl.");
        }

        switch (item.TriggerType)
        {
            case AchievementTriggerType.LevelCompletion when string.IsNullOrWhiteSpace(item.RequiredLevelKey):
                throw new InvalidOperationException($"Achievement {item.Code} requires requiredLevelKey for LevelCompletion trigger.");
            case AchievementTriggerType.CategoryCompletion when string.IsNullOrWhiteSpace(item.RequiredCategoryKey):
                throw new InvalidOperationException($"Achievement {item.Code} requires requiredCategoryKey for CategoryCompletion trigger.");
            case AchievementTriggerType.CompletedCategoriesCount when item.RequiredCompletedCategoriesCount is null or <= 0:
                throw new InvalidOperationException($"Achievement {item.Code} requires a positive requiredCompletedCategoriesCount value.");
        }

        switch (item.RewardType)
        {
            case AchievementRewardType.Coins when item.RewardCoins is null or <= 0:
                throw new InvalidOperationException($"Achievement {item.Code} requires a positive rewardCoins value.");
            case AchievementRewardType.Avatar when string.IsNullOrWhiteSpace(item.RewardAvatarKey):
                throw new InvalidOperationException($"Achievement {item.Code} requires rewardAvatarKey for Avatar reward.");
        }
    }

    private static string? TrimOrNull(string? value)
    {
        return string.IsNullOrWhiteSpace(value)
            ? null
            : value.Trim();
    }
}
