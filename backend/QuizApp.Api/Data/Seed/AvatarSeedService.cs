using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using QuizApp.Api.Models;

namespace QuizApp.Api.Data.Seed;

public sealed class AvatarSeedService
{
    private readonly AppDbContext _dbContext;
    private readonly AvatarSeedOptions _options;
    private readonly IWebHostEnvironment _environment;
    private readonly ILogger<AvatarSeedService> _logger;

    public AvatarSeedService(
        AppDbContext dbContext,
        IOptions<AvatarSeedOptions> options,
        IWebHostEnvironment environment,
        ILogger<AvatarSeedService> logger)
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
            _logger.LogWarning("Avatar seed file was not found at {FilePath}.", filePath);
            return;
        }

        var json = await File.ReadAllTextAsync(filePath, cancellationToken);
        var items = JsonSerializer.Deserialize<List<AvatarSeedItem>>(json, new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        });

        if (items is null || items.Count == 0)
        {
            _logger.LogWarning("Avatar seed file {FilePath} does not contain any avatars.", filePath);
            return;
        }

        var duplicatedKeys = items
            .GroupBy(item => item.Key, StringComparer.OrdinalIgnoreCase)
            .Where(group => group.Count() > 1)
            .Select(group => group.Key)
            .ToList();

        if (duplicatedKeys.Count > 0)
        {
            throw new InvalidOperationException($"Avatar seed contains duplicated keys: {string.Join(", ", duplicatedKeys)}");
        }

        var existingAvatars = await _dbContext.Avatars.ToDictionaryAsync(item => item.Key, StringComparer.OrdinalIgnoreCase, cancellationToken);

        foreach (var item in items)
        {
            Validate(item);

            if (!existingAvatars.TryGetValue(item.Key, out var avatar))
            {
                avatar = new Avatar();
                _dbContext.Avatars.Add(avatar);
            }

            avatar.Key = item.Key.Trim();
            avatar.Name = item.Name.Trim();
            avatar.ImageUrl = item.ImageUrl.Trim();
            avatar.SortOrder = item.SortOrder;
            avatar.UnlockType = item.UnlockType;
            avatar.RequiredLevelKey = string.IsNullOrWhiteSpace(item.RequiredLevelKey)
                ? null
                : item.RequiredLevelKey.Trim();
            avatar.RequiredAchievementCode = string.IsNullOrWhiteSpace(item.RequiredAchievementCode)
                ? null
                : item.RequiredAchievementCode.Trim();
            avatar.Price = item.Price;
        }

        await _dbContext.SaveChangesAsync(cancellationToken);

        var defaultAvatar = await _dbContext.Avatars
            .OrderBy(item => item.SortOrder)
            .ThenBy(item => item.Id)
            .FirstOrDefaultAsync(item => item.UnlockType == AvatarUnlockType.Default, cancellationToken);

        if (defaultAvatar is null)
        {
            throw new InvalidOperationException("Avatar seed must contain at least one default avatar.");
        }

        var avatarsByImageUrl = await _dbContext.Avatars
            .AsNoTracking()
            .Where(item => !string.IsNullOrWhiteSpace(item.ImageUrl))
            .ToDictionaryAsync(item => item.ImageUrl, StringComparer.OrdinalIgnoreCase, cancellationToken);

        var usersWithoutAvatar = await _dbContext.Users
            .Where(item => item.CurrentAvatarId == null)
            .ToListAsync(cancellationToken);

        foreach (var user in usersWithoutAvatar)
        {
            if (!string.IsNullOrWhiteSpace(user.AvatarUrl) && avatarsByImageUrl.TryGetValue(user.AvatarUrl, out var matchingAvatar))
            {
                user.CurrentAvatarId = matchingAvatar.Id;
                user.AvatarUrl = matchingAvatar.ImageUrl;
                continue;
            }

            user.CurrentAvatarId = defaultAvatar.Id;
            user.AvatarUrl = defaultAvatar.ImageUrl;
        }

        if (usersWithoutAvatar.Count > 0)
        {
            await _dbContext.SaveChangesAsync(cancellationToken);
        }
    }

    private static void Validate(AvatarSeedItem item)
    {
        if (string.IsNullOrWhiteSpace(item.Key))
        {
            throw new InvalidOperationException("Avatar seed item key is required.");
        }

        if (string.IsNullOrWhiteSpace(item.Name))
        {
            throw new InvalidOperationException($"Avatar {item.Key} must have a name.");
        }

        if (string.IsNullOrWhiteSpace(item.ImageUrl))
        {
            throw new InvalidOperationException($"Avatar {item.Key} must have an imageUrl.");
        }

        if (item.Price < 0)
        {
            throw new InvalidOperationException($"Avatar {item.Key} cannot have a negative price.");
        }

        if (item.UnlockType == AvatarUnlockType.LevelCompletion && string.IsNullOrWhiteSpace(item.RequiredLevelKey))
        {
            throw new InvalidOperationException($"Avatar {item.Key} requires requiredLevelKey for LevelCompletion unlock.");
        }

        if (item.UnlockType == AvatarUnlockType.Achievement && string.IsNullOrWhiteSpace(item.RequiredAchievementCode))
        {
            throw new InvalidOperationException($"Avatar {item.Key} requires requiredAchievementCode for Achievement unlock.");
        }

        if (item.UnlockType == AvatarUnlockType.Purchase && item.Price <= 0)
        {
            throw new InvalidOperationException($"Avatar {item.Key} requires a positive price for Purchase unlock.");
        }
    }
}
