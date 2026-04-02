using System.Security.Claims;
using QuizApp.Api.Dto;

namespace QuizApp.Api.Services.Abstractions;

public interface IUserService
{
    Task<Guid?> GetCurrentUserIdAsync(ClaimsPrincipal principal, CancellationToken cancellationToken = default);
    Task<UserProfileDto?> GetCurrentUserProfileAsync(ClaimsPrincipal principal, CancellationToken cancellationToken = default);
    Task<UserProfileDto?> UpdateCurrentUserProfileAsync(
        ClaimsPrincipal principal,
        UpdateUserProfileRequest request,
        CancellationToken cancellationToken = default);
}
