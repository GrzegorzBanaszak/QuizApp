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

        var items = await SeedJsonFileReader.ReadListAsync<AvatarSeedItem>(filePath, cancellationToken);
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

        var achievementCodes = await _dbContext.AchievementDefinitions
            .AsNoTracking()
            .Select(item => item.Code)
            .ToListAsync(cancellationToken);

        var achievementCodeSet = achievementCodes.ToHashSet(StringComparer.OrdinalIgnoreCase);
        var existingAvatars = await _dbContext.Avatars.ToDictionaryAsync(item => item.Key, StringComparer.OrdinalIgnoreCase, cancellationToken);

        foreach (var item in items)
        {
            Validate(item, achievementCodeSet);

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
            avatar.RequiredAchievementCode = string.IsNullOrWhiteSpace(item.RequiredAchievementCode)
                ? null
                : item.RequiredAchievementCode.Trim();
            avatar.Price = item.Price;
        }

        await _dbContext.SaveChangesAsync(cancellationToken);

        await ValidateAchievementAvatarRewardsAsync(cancellationToken);

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

    private async Task ValidateAchievementAvatarRewardsAsync(CancellationToken cancellationToken)
    {
        var avatarKeys = await _dbContext.Avatars
            .AsNoTracking()
            .Select(item => item.Key)
            .ToListAsync(cancellationToken);

        var avatarKeySet = avatarKeys.ToHashSet(StringComparer.OrdinalIgnoreCase);
        var missingAvatarRewards = await _dbContext.AchievementDefinitions
            .AsNoTracking()
            .Where(item => item.RewardType == AchievementRewardType.Avatar && item.RewardAvatarKey != null)
            .Select(item => new { item.Code, item.RewardAvatarKey })
            .ToListAsync(cancellationToken);

        var invalidRewards = missingAvatarRewards
            .Where(item => item.RewardAvatarKey is not null && !avatarKeySet.Contains(item.RewardAvatarKey))
            .Select(item => $"{item.Code}:{item.RewardAvatarKey}")
            .ToList();

        if (invalidRewards.Count > 0)
        {
            throw new InvalidOperationException($"Achievement reward avatars are missing: {string.Join(", ", invalidRewards)}");
        }
    }

    private static void Validate(AvatarSeedItem item, IReadOnlySet<string> achievementCodes)
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

        if (item.UnlockType == AvatarUnlockType.Achievement && string.IsNullOrWhiteSpace(item.RequiredAchievementCode))
        {
            throw new InvalidOperationException($"Avatar {item.Key} requires requiredAchievementCode for Achievement unlock.");
        }

        if (item.UnlockType == AvatarUnlockType.Achievement &&
            !string.IsNullOrWhiteSpace(item.RequiredAchievementCode) &&
            !achievementCodes.Contains(item.RequiredAchievementCode.Trim()))
        {
            throw new InvalidOperationException($"Avatar {item.Key} references unknown achievement code {item.RequiredAchievementCode}.");
        }

        if (item.UnlockType == AvatarUnlockType.Purchase && item.Price <= 0)
        {
            throw new InvalidOperationException($"Avatar {item.Key} requires a positive price for Purchase unlock.");
        }
    }
}
