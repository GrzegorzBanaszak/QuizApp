using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using QuizApp.Api.Models;

namespace QuizApp.Api.Data.Seed;

public sealed class SingleplayerQuestionSeedService
{
    private readonly AppDbContext _dbContext;
    private readonly SingleplayerQuestionSeedOptions _options;
    private readonly IWebHostEnvironment _environment;
    private readonly ILogger<SingleplayerQuestionSeedService> _logger;

    public SingleplayerQuestionSeedService(
        AppDbContext dbContext,
        IOptions<SingleplayerQuestionSeedOptions> options,
        IWebHostEnvironment environment,
        ILogger<SingleplayerQuestionSeedService> logger)
    {
        _dbContext = dbContext;
        _options = options.Value;
        _environment = environment;
        _logger = logger;
    }

    public async Task SeedAsync(CancellationToken cancellationToken = default)
    {
        var directoryPath = Path.Combine(_environment.ContentRootPath, _options.DirectoryPath);
        if (!Directory.Exists(directoryPath))
        {
            _logger.LogWarning("Singleplayer question seed directory was not found at {DirectoryPath}.", directoryPath);
            return;
        }

        var filePaths = Directory
            .EnumerateFiles(directoryPath, "*.json", SearchOption.TopDirectoryOnly)
            .OrderBy(filePath => filePath, StringComparer.OrdinalIgnoreCase)
            .ToList();

        if (filePaths.Count == 0)
        {
            _logger.LogWarning("Singleplayer question seed directory {DirectoryPath} does not contain any JSON files.", directoryPath);
            return;
        }

        var items = new List<SingleplayerQuestionSeedItem>();
        foreach (var filePath in filePaths)
        {
            var fileItems = await SeedJsonFileReader.ReadListAsync<SingleplayerQuestionSeedItem>(filePath, cancellationToken);
            if (fileItems is null || fileItems.Count == 0)
            {
                _logger.LogWarning("Singleplayer question seed file {FilePath} does not contain any questions.", filePath);
                continue;
            }

            ValidateCategoryConsistency(filePath, fileItems);
            items.AddRange(fileItems);
        }

        if (items.Count == 0)
        {
            _logger.LogWarning("Singleplayer question seed directory {DirectoryPath} does not contain any questions.", directoryPath);
            return;
        }

        ValidateDuplicates(items);

        var categoryIdsByKey = await _dbContext.Categories
            .AsNoTracking()
            .ToDictionaryAsync(item => item.Key, item => item.Id, StringComparer.OrdinalIgnoreCase, cancellationToken);

        var existingQuestions = await _dbContext.SingleplayerQuestions
            .Include(item => item.Answers)
            .ToDictionaryAsync(item => item.Key, StringComparer.OrdinalIgnoreCase, cancellationToken);

        foreach (var item in items)
        {
            Validate(item, categoryIdsByKey);

            if (!existingQuestions.TryGetValue(item.Key, out var question))
            {
                question = new SingleplayerQuestion();
                _dbContext.SingleplayerQuestions.Add(question);
            }

            question.Key = item.Key.Trim();
            question.CategoryId = categoryIdsByKey[item.CategoryKey.Trim()];
            question.Difficulty = item.Difficulty;
            question.Text = item.Text.Trim();
            question.CorrectAnswerId = item.CorrectAnswerId.Trim();

            SyncAnswers(question, item.Answers);
        }

        await _dbContext.SaveChangesAsync(cancellationToken);
    }

    private static void ValidateCategoryConsistency(string filePath, IReadOnlyList<SingleplayerQuestionSeedItem> items)
    {
        var categoryKeys = items
            .Select(item => item.CategoryKey.Trim())
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .ToList();

        if (categoryKeys.Count != 1)
        {
            throw new InvalidOperationException($"Singleplayer question seed file {filePath} must contain questions for exactly one category.");
        }

        var fileCategoryKey = Path.GetFileNameWithoutExtension(filePath);
        if (!string.Equals(fileCategoryKey, categoryKeys[0], StringComparison.OrdinalIgnoreCase))
        {
            throw new InvalidOperationException($"Singleplayer question seed file {filePath} must match category key {categoryKeys[0]}.");
        }
    }

    private static void SyncAnswers(SingleplayerQuestion question, IReadOnlyList<SingleplayerAnswerSeedItem> items)
    {
        var existingById = question.Answers
            .ToDictionary(item => item.Id, StringComparer.OrdinalIgnoreCase);

        foreach (var item in items)
        {
            if (!existingById.TryGetValue(item.Id, out var answer))
            {
                answer = new SingleplayerAnswer
                {
                    Id = item.Id.Trim()
                };

                question.Answers.Add(answer);
            }

            answer.Text = item.Text.Trim();
        }

        var answerIdsToKeep = items
            .Select(item => item.Id.Trim())
            .ToHashSet(StringComparer.OrdinalIgnoreCase);

        var toRemove = question.Answers
            .Where(item => !answerIdsToKeep.Contains(item.Id))
            .ToList();

        foreach (var answer in toRemove)
        {
            question.Answers.Remove(answer);
        }
    }

    private static void ValidateDuplicates(IReadOnlyList<SingleplayerQuestionSeedItem> items)
    {
        var duplicatedKeys = items
            .GroupBy(item => item.Key, StringComparer.OrdinalIgnoreCase)
            .Where(group => group.Count() > 1)
            .Select(group => group.Key)
            .ToList();

        if (duplicatedKeys.Count > 0)
        {
            throw new InvalidOperationException($"Singleplayer question seed contains duplicated keys: {string.Join(", ", duplicatedKeys)}");
        }

        var duplicatedAnswerIds = items
            .SelectMany(item => item.Answers.Select(answer => answer.Id))
            .GroupBy(item => item, StringComparer.OrdinalIgnoreCase)
            .Where(group => group.Count() > 1)
            .Select(group => group.Key)
            .ToList();

        if (duplicatedAnswerIds.Count > 0)
        {
            throw new InvalidOperationException($"Singleplayer question seed contains duplicated answer ids: {string.Join(", ", duplicatedAnswerIds)}");
        }
    }

    private static void Validate(
        SingleplayerQuestionSeedItem item,
        IReadOnlyDictionary<string, int> categoryIdsByKey)
    {
        if (string.IsNullOrWhiteSpace(item.Key))
        {
            throw new InvalidOperationException("Singleplayer question key is required.");
        }

        if (string.IsNullOrWhiteSpace(item.CategoryKey))
        {
            throw new InvalidOperationException($"Singleplayer question {item.Key} must define categoryKey.");
        }

        if (!categoryIdsByKey.ContainsKey(item.CategoryKey.Trim()))
        {
            throw new InvalidOperationException($"Singleplayer question {item.Key} references unknown categoryKey {item.CategoryKey}.");
        }

        if (string.IsNullOrWhiteSpace(item.Text))
        {
            throw new InvalidOperationException($"Singleplayer question {item.Key} must define text.");
        }

        if (string.IsNullOrWhiteSpace(item.CorrectAnswerId))
        {
            throw new InvalidOperationException($"Singleplayer question {item.Key} must define correctAnswerId.");
        }

        if (item.Answers.Count < 2)
        {
            throw new InvalidOperationException($"Singleplayer question {item.Key} must define at least two answers.");
        }

        var duplicatedAnswerIds = item.Answers
            .GroupBy(answer => answer.Id, StringComparer.OrdinalIgnoreCase)
            .Where(group => group.Count() > 1)
            .Select(group => group.Key)
            .ToList();

        if (duplicatedAnswerIds.Count > 0)
        {
            throw new InvalidOperationException($"Singleplayer question {item.Key} contains duplicated answer ids: {string.Join(", ", duplicatedAnswerIds)}");
        }

        if (item.Answers.Any(answer => string.IsNullOrWhiteSpace(answer.Id) || string.IsNullOrWhiteSpace(answer.Text)))
        {
            throw new InvalidOperationException($"Singleplayer question {item.Key} contains an invalid answer entry.");
        }

        if (!item.Answers.Any(answer => string.Equals(answer.Id, item.CorrectAnswerId, StringComparison.OrdinalIgnoreCase)))
        {
            throw new InvalidOperationException($"Singleplayer question {item.Key} correctAnswerId must match one of the answers.");
        }
    }
}
