using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using QuizApp.Api.Models;

namespace QuizApp.Api.Data.Seed;

public sealed class LevelSeedService
{
    private readonly AppDbContext _dbContext;
    private readonly LevelSeedOptions _options;
    private readonly IWebHostEnvironment _environment;
    private readonly ILogger<LevelSeedService> _logger;

    public LevelSeedService(
        AppDbContext dbContext,
        IOptions<LevelSeedOptions> options,
        IWebHostEnvironment environment,
        ILogger<LevelSeedService> logger)
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
            _logger.LogWarning("Level seed file was not found at {FilePath}.", filePath);
            return;
        }

        var items = await SeedJsonFileReader.ReadListAsync<LevelSeedItem>(filePath, cancellationToken);
        if (items is null || items.Count == 0)
        {
            _logger.LogWarning("Level seed file {FilePath} does not contain any levels.", filePath);
            return;
        }

        var duplicatedKeys = items
            .GroupBy(item => item.Key, StringComparer.OrdinalIgnoreCase)
            .Where(group => group.Count() > 1)
            .Select(group => group.Key)
            .ToList();

        if (duplicatedKeys.Count > 0)
        {
            throw new InvalidOperationException($"Level seed contains duplicated keys: {string.Join(", ", duplicatedKeys)}");
        }

        var duplicatedOrders = items
            .GroupBy(item => $"{item.CategoryKey.Trim()}::{item.Order}", StringComparer.OrdinalIgnoreCase)
            .Where(group => group.Count() > 1)
            .Select(group => group.Key.Replace("::", ":"))
            .ToList();

        if (duplicatedOrders.Count > 0)
        {
            throw new InvalidOperationException($"Level seed contains duplicated order values within categories: {string.Join(", ", duplicatedOrders)}");
        }

        var categoryIdsByKey = await _dbContext.Categories
            .ToDictionaryAsync(item => item.Key, item => item.Id, StringComparer.OrdinalIgnoreCase, cancellationToken);

        var existingLevels = await _dbContext.Levels
            .Include(item => item.QuestionDistributions)
            .ToDictionaryAsync(item => item.Key, StringComparer.OrdinalIgnoreCase, cancellationToken);

        foreach (var item in items)
        {
            Validate(item);

            if (!categoryIdsByKey.TryGetValue(item.CategoryKey.Trim(), out var categoryId))
            {
                throw new InvalidOperationException($"Level {item.Key} references unknown categoryKey {item.CategoryKey}.");
            }

            if (!existingLevels.TryGetValue(item.Key, out var level))
            {
                level = new Level();
                _dbContext.Levels.Add(level);
            }

            level.Key = item.Key.Trim();
            level.CategoryId = categoryId;
            level.Name = item.Name.Trim();
            level.Order = item.Order;
            level.FirstCompletionExperience = item.FirstCompletionExperience ?? ResolveDefaultFirstCompletionExperience(item.Order);
            level.ReplayExperience = item.ReplayExperience ?? ResolveDefaultReplayExperience(level.FirstCompletionExperience);

            SyncQuestionDistributions(level, item.QuestionDistributions);
        }

        await _dbContext.SaveChangesAsync(cancellationToken);
    }

    private void SyncQuestionDistributions(Level level, IReadOnlyList<LevelQuestionDistributionSeedItem> items)
    {
        var existingByDifficulty = level.QuestionDistributions
            .ToDictionary(item => item.Difficulty);

        foreach (var item in items)
        {
            if (!existingByDifficulty.TryGetValue(item.Difficulty, out var distribution))
            {
                distribution = new LevelQuestionDistribution
                {
                    Difficulty = item.Difficulty
                };

                level.QuestionDistributions.Add(distribution);
            }

            distribution.Count = item.Count;
        }

        var difficultiesToKeep = items.Select(item => item.Difficulty).ToHashSet();
        var toRemove = level.QuestionDistributions
            .Where(item => !difficultiesToKeep.Contains(item.Difficulty))
            .ToList();

        foreach (var distribution in toRemove)
        {
            level.QuestionDistributions.Remove(distribution);
        }
    }

    private static void Validate(LevelSeedItem item)
    {
        if (string.IsNullOrWhiteSpace(item.Key))
        {
            throw new InvalidOperationException("Level key is required.");
        }

        if (string.IsNullOrWhiteSpace(item.CategoryKey))
        {
            throw new InvalidOperationException($"Level {item.Key} must have categoryKey.");
        }

        if (string.IsNullOrWhiteSpace(item.Name))
        {
            throw new InvalidOperationException($"Level {item.Key} must have a name.");
        }

        if (item.Order <= 0)
        {
            throw new InvalidOperationException($"Level {item.Key} must have a positive order.");
        }

        if (item.FirstCompletionExperience is <= 0)
        {
            throw new InvalidOperationException($"Level {item.Key} must have a positive firstCompletionExperience value when provided.");
        }

        if (item.ReplayExperience is < 0)
        {
            throw new InvalidOperationException($"Level {item.Key} cannot have a negative replayExperience value.");
        }

        if (item.QuestionDistributions.Count == 0)
        {
            throw new InvalidOperationException($"Level {item.Key} must define at least one question distribution.");
        }

        var duplicatedDifficulties = item.QuestionDistributions
            .GroupBy(distribution => distribution.Difficulty)
            .Where(group => group.Count() > 1)
            .Select(group => group.Key.ToString())
            .ToList();

        if (duplicatedDifficulties.Count > 0)
        {
            throw new InvalidOperationException($"Level {item.Key} contains duplicated question difficulties: {string.Join(", ", duplicatedDifficulties)}");
        }

        if (item.QuestionDistributions.Any(distribution => distribution.Count <= 0))
        {
            throw new InvalidOperationException($"Level {item.Key} contains a non-positive question distribution count.");
        }
    }

    private static int ResolveDefaultFirstCompletionExperience(int levelOrder)
    {
        return 80 + (levelOrder * 20);
    }

    private static int ResolveDefaultReplayExperience(int firstCompletionExperience)
    {
        return Math.Max(20, firstCompletionExperience / 4);
    }
}
