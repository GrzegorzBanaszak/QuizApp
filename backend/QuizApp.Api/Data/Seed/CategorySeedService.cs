using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using QuizApp.Api.Models;

namespace QuizApp.Api.Data.Seed;

public sealed class CategorySeedService
{
    private readonly AppDbContext _dbContext;
    private readonly CategorySeedOptions _options;
    private readonly IWebHostEnvironment _environment;
    private readonly ILogger<CategorySeedService> _logger;

    public CategorySeedService(
        AppDbContext dbContext,
        IOptions<CategorySeedOptions> options,
        IWebHostEnvironment environment,
        ILogger<CategorySeedService> logger)
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
            _logger.LogWarning("Category seed file was not found at {FilePath}.", filePath);
            return;
        }

        var items = await SeedJsonFileReader.ReadListAsync<CategorySeedItem>(filePath, cancellationToken);
        if (items is null || items.Count == 0)
        {
            _logger.LogWarning("Category seed file {FilePath} does not contain any categories.", filePath);
            return;
        }

        var duplicatedKeys = items
            .GroupBy(item => item.Key, StringComparer.OrdinalIgnoreCase)
            .Where(group => group.Count() > 1)
            .Select(group => group.Key)
            .ToList();

        if (duplicatedKeys.Count > 0)
        {
            throw new InvalidOperationException($"Category seed contains duplicated keys: {string.Join(", ", duplicatedKeys)}");
        }

        var duplicatedNames = items
            .GroupBy(item => item.Name, StringComparer.OrdinalIgnoreCase)
            .Where(group => group.Count() > 1)
            .Select(group => group.Key)
            .ToList();

        if (duplicatedNames.Count > 0)
        {
            throw new InvalidOperationException($"Category seed contains duplicated names: {string.Join(", ", duplicatedNames)}");
        }

        var existingCategories = await _dbContext.Categories
            .ToDictionaryAsync(item => item.Key, StringComparer.OrdinalIgnoreCase, cancellationToken);

        foreach (var item in items)
        {
            Validate(item);

            if (!existingCategories.TryGetValue(item.Key, out var category))
            {
                category = new Category();
                _dbContext.Categories.Add(category);
            }

            category.Key = item.Key.Trim();
            category.Name = item.Name.Trim();
            category.Description = item.Description.Trim();
        }

        await _dbContext.SaveChangesAsync(cancellationToken);
    }

    private static void Validate(CategorySeedItem item)
    {
        if (string.IsNullOrWhiteSpace(item.Key))
        {
            throw new InvalidOperationException("Category key is required.");
        }

        if (string.IsNullOrWhiteSpace(item.Name))
        {
            throw new InvalidOperationException($"Category {item.Key} must have a name.");
        }

        if (string.IsNullOrWhiteSpace(item.Description))
        {
            throw new InvalidOperationException($"Category {item.Key} must have a description.");
        }
    }
}
