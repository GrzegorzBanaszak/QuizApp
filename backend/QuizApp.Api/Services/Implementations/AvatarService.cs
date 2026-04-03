using Microsoft.EntityFrameworkCore;
using QuizApp.Api.Data;
using QuizApp.Api.Dto;
using QuizApp.Api.Models;
using QuizApp.Api.Services.Abstractions;

namespace QuizApp.Api.Services.Implementations;

public sealed class AvatarService : IAvatarService
{
    private readonly AppDbContext _dbContext;

    public AvatarService(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<IReadOnlyList<AvatarDto>> GetCreateCatalogAsync(CancellationToken cancellationToken = default)
    {
        return await _dbContext.Avatars
            .AsNoTracking()
            .Where(item => item.UnlockType == AvatarUnlockType.Default)
            .OrderBy(item => item.SortOrder)
            .ThenBy(item => item.Id)
            .Select(item => new AvatarDto
            {
                Id = item.Id,
                Key = item.Key,
                Name = item.Name,
                ImageUrl = item.ImageUrl,
                UnlockType = item.UnlockType.ToString(),
                UnlockAchievementCode = item.RequiredAchievementCode,
                Price = item.Price,
                IsUnlocked = true,
                CanPurchase = false,
                IsSelected = false,
                UnlockDescription = "Dostępny od początku."
            })
            .ToListAsync(cancellationToken);
    }

    public async Task<IReadOnlyList<AvatarDto>> GetCatalogAsync(
        Guid userId,
        AvatarCatalogView view,
        CancellationToken cancellationToken = default)
    {
        var user = await _dbContext.Users
            .AsNoTracking()
            .SingleOrDefaultAsync(item => item.Id == userId, cancellationToken);

        if (user is null)
        {
            return [];
        }

        var avatars = await _dbContext.Avatars
            .AsNoTracking()
            .OrderBy(item => item.SortOrder)
            .ThenBy(item => item.Id)
            .ToListAsync(cancellationToken);

        var achievementLookup = (await _dbContext.AchievementDefinitions
                .AsNoTracking()
                .Select(item => new AchievementSummary(item.Code, item.Name))
                .ToListAsync(cancellationToken))
            .ToDictionary(item => item.Code, item => item, StringComparer.OrdinalIgnoreCase);

        var context = await BuildUnlockContextAsync(userId, cancellationToken);
        var filteredAvatars = view == AvatarCatalogView.Create
            ? avatars.Where(item => item.UnlockType == AvatarUnlockType.Default)
            : avatars;

        return filteredAvatars
            .Select(avatar =>
            {
                var isUnlocked = AvatarUnlockEvaluator.IsUnlocked(avatar, context);

                return new AvatarDto
                {
                    Id = avatar.Id,
                    Key = avatar.Key,
                    Name = avatar.Name,
                    ImageUrl = avatar.ImageUrl,
                    UnlockType = avatar.UnlockType.ToString(),
                    UnlockAchievementCode = avatar.RequiredAchievementCode,
                    Price = avatar.Price,
                    IsUnlocked = isUnlocked,
                    CanPurchase = avatar.UnlockType == AvatarUnlockType.Purchase && !isUnlocked && user.Coins >= avatar.Price,
                    IsSelected = user.CurrentAvatarId == avatar.Id,
                    UnlockDescription = BuildUnlockDescription(avatar, achievementLookup)
                };
            })
            .ToList();
    }

    public async Task<UserProfileDto?> SelectAvatarAsync(Guid userId, int avatarId, CancellationToken cancellationToken = default)
    {
        var user = await _dbContext.Users
            .Include(item => item.CurrentAvatar)
            .SingleOrDefaultAsync(item => item.Id == userId, cancellationToken);

        if (user is null)
        {
            return null;
        }

        var avatar = await _dbContext.Avatars
            .SingleOrDefaultAsync(item => item.Id == avatarId, cancellationToken);

        if (avatar is null)
        {
            throw new KeyNotFoundException($"Avatar {avatarId} was not found.");
        }

        var context = await BuildUnlockContextAsync(userId, cancellationToken);
        if (!AvatarUnlockEvaluator.IsUnlocked(avatar, context))
        {
            throw new InvalidOperationException($"Avatar {avatarId} is locked.");
        }

        user.CurrentAvatarId = avatar.Id;
        user.AvatarUrl = avatar.ImageUrl;

        await _dbContext.SaveChangesAsync(cancellationToken);

        return ToProfileDto(user, avatar);
    }

    public async Task<UserProfileDto?> PurchaseAvatarAsync(Guid userId, int avatarId, CancellationToken cancellationToken = default)
    {
        var user = await _dbContext.Users
            .Include(item => item.CurrentAvatar)
            .Include(item => item.OwnedAvatars)
            .SingleOrDefaultAsync(item => item.Id == userId, cancellationToken);

        if (user is null)
        {
            return null;
        }

        var avatar = await _dbContext.Avatars
            .SingleOrDefaultAsync(item => item.Id == avatarId, cancellationToken);

        if (avatar is null)
        {
            throw new KeyNotFoundException($"Avatar {avatarId} was not found.");
        }

        if (avatar.UnlockType != AvatarUnlockType.Purchase)
        {
            throw new InvalidOperationException($"Avatar {avatarId} cannot be purchased.");
        }

        if (user.OwnedAvatars.Any(item => item.AvatarId == avatarId))
        {
            return ToProfileDto(user, user.CurrentAvatar);
        }

        if (user.Coins < avatar.Price)
        {
            throw new InvalidOperationException($"Not enough coins to purchase avatar {avatarId}.");
        }

        user.Coins -= avatar.Price;
        user.OwnedAvatars.Add(new UserOwnedAvatar
        {
            UserId = user.Id,
            AvatarId = avatar.Id,
            UnlockedAt = DateTime.UtcNow
        });

        await _dbContext.SaveChangesAsync(cancellationToken);

        return ToProfileDto(user, user.CurrentAvatar);
    }

    public Task<Avatar?> GetDefaultAvatarAsync(CancellationToken cancellationToken = default)
    {
        return _dbContext.Avatars
            .AsNoTracking()
            .Where(item => item.UnlockType == AvatarUnlockType.Default)
            .OrderBy(item => item.SortOrder)
            .ThenBy(item => item.Id)
            .FirstOrDefaultAsync(cancellationToken);
    }

    public async Task<Avatar?> ResolveDefaultAvatarAsync(int? avatarId, CancellationToken cancellationToken = default)
    {
        if (avatarId is null)
        {
            return await GetDefaultAvatarAsync(cancellationToken);
        }

        return await _dbContext.Avatars
            .AsNoTracking()
            .Where(item => item.Id == avatarId.Value && item.UnlockType == AvatarUnlockType.Default)
            .FirstOrDefaultAsync(cancellationToken);
    }

    private async Task<AvatarUnlockContext> BuildUnlockContextAsync(Guid userId, CancellationToken cancellationToken)
    {
        var achievementCodes = (await _dbContext.UserAchievements
                .AsNoTracking()
                .Where(item => item.UserId == userId)
                .Select(item => item.Code)
                .ToListAsync(cancellationToken))
            .ToHashSet(StringComparer.OrdinalIgnoreCase);

        var ownedAvatarIds = (await _dbContext.UserOwnedAvatars
                .AsNoTracking()
                .Where(item => item.UserId == userId)
                .Select(item => item.AvatarId)
                .ToListAsync(cancellationToken))
            .ToHashSet();

        return new AvatarUnlockContext
        {
            AchievementCodes = achievementCodes,
            OwnedAvatarIds = ownedAvatarIds
        };
    }

    private static string BuildUnlockDescription(
        Avatar avatar,
        IReadOnlyDictionary<string, AchievementSummary> achievementsByCode)
    {
        return avatar.UnlockType switch
        {
            AvatarUnlockType.Default => "Dostępny od początku.",
            AvatarUnlockType.Achievement when avatar.RequiredAchievementCode is not null
                && achievementsByCode.TryGetValue(avatar.RequiredAchievementCode, out var achievement) =>
                $"Odblokuj osiągnięcie: {achievement.Name}.",
            AvatarUnlockType.Achievement when avatar.RequiredAchievementCode is not null =>
                $"Odblokuj osiągnięcie: {avatar.RequiredAchievementCode}.",
            AvatarUnlockType.Purchase => $"Kup w sklepie za {avatar.Price} monet.",
            _ => string.Empty
        };
    }

    private static UserProfileDto ToProfileDto(User user, Avatar? avatar)
    {
        return new UserProfileDto
        {
            Id = user.Id,
            Username = user.Username,
            AvatarUrl = avatar?.ImageUrl ?? user.AvatarUrl,
            CurrentAvatarId = user.CurrentAvatarId,
            TotalExperience = user.TotalExperience,
            Coins = user.Coins
        };
    }

    private sealed record AchievementSummary(string Code, string Name);
}
