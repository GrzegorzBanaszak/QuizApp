using QuizApp.Api.Dto;
using QuizApp.Api.Models;
using QuizApp.Api.Services.Abstractions;

namespace QuizApp.Api.Services.Implementations;

internal static class UserProfileMapper
{
    public static UserProfileDto ToDto(User user, IProgressionService progressionService, Avatar? avatar = null)
    {
        return new UserProfileDto
        {
            Id = user.Id,
            Username = user.Username,
            AvatarUrl = avatar?.ImageUrl ?? user.AvatarUrl,
            CurrentAvatarId = avatar?.Id ?? user.CurrentAvatarId,
            AuthProvider = ResolveAuthProvider(user).ToString(),
            TotalExperience = user.TotalExperience,
            Coins = user.Coins,
            Progress = progressionService.BuildProgress(user.TotalExperience)
        };
    }

    private static AuthProvider ResolveAuthProvider(User user)
    {
        if (!string.IsNullOrWhiteSpace(user.GoogleId))
        {
            return AuthProvider.Google;
        }

        if (!string.IsNullOrWhiteSpace(user.FacebookId))
        {
            return AuthProvider.Facebook;
        }

        return AuthProvider.Guest;
    }
}
