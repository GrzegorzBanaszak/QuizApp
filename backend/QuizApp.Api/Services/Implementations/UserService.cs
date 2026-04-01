using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using QuizApp.Api.Data;
using QuizApp.Api.Dto;
using QuizApp.Api.Models;
using QuizApp.Api.Services.Abstractions;

namespace QuizApp.Api.Services.Implementations;

public sealed class UserService : IUserService
{
    private readonly AppDbContext _dbContext;

    public UserService(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<Guid?> GetCurrentUserIdAsync(ClaimsPrincipal principal, CancellationToken cancellationToken = default)
    {
        var userIdValue =
            principal.FindFirstValue(ClaimTypes.NameIdentifier) ??
            principal.FindFirstValue(JwtRegisteredClaimNames.Sub);

        if (!Guid.TryParse(userIdValue, out var userId))
        {
            return null;
        }

        var userExists = await _dbContext.Users.AnyAsync(user => user.Id == userId, cancellationToken);
        return userExists ? userId : null;
    }

    public async Task<UserProfileDto?> GetCurrentUserProfileAsync(ClaimsPrincipal principal, CancellationToken cancellationToken = default)
    {
        var userId = await GetCurrentUserIdAsync(principal, cancellationToken);
        if (userId is null)
        {
            return null;
        }

        var user = await _dbContext.Users
            .AsNoTracking()
            .SingleOrDefaultAsync(item => item.Id == userId.Value, cancellationToken);

        return user is null ? null : ToProfileDto(user);
    }

    public async Task<UserProfileDto?> UpdateCurrentUserProfileAsync(
        ClaimsPrincipal principal,
        UpdateUserProfileRequest request,
        CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(request);

        var username = request.Username?.Trim() ?? string.Empty;
        if (string.IsNullOrWhiteSpace(username))
        {
            throw new ArgumentException("Username is required.", nameof(request));
        }

        var userId = await GetCurrentUserIdAsync(principal, cancellationToken);
        if (userId is null)
        {
            return null;
        }

        var user = await _dbContext.Users
            .SingleOrDefaultAsync(item => item.Id == userId.Value, cancellationToken);

        if (user is null)
        {
            return null;
        }

        if (!string.Equals(user.Username, username, StringComparison.Ordinal))
        {
            var isUsernameTaken = await _dbContext.Users
                .AnyAsync(item => item.Username == username && item.Id != user.Id, cancellationToken);

            if (isUsernameTaken)
            {
                throw new InvalidOperationException("Username is already taken.");
            }
        }

        user.Username = username;
        await _dbContext.SaveChangesAsync(cancellationToken);

        return ToProfileDto(user);
    }

    private static UserProfileDto ToProfileDto(User user)
    {
        return new UserProfileDto
        {
            Id = user.Id,
            Username = user.Username,
            AvatarUrl = user.AvatarUrl,
            CurrentAvatarId = user.CurrentAvatarId,
            TotalExperience = user.TotalExperience,
            Coins = user.Coins
        };
    }
}
