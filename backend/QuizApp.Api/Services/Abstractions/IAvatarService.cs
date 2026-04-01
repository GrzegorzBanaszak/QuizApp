using QuizApp.Api.Dto;
using QuizApp.Api.Models;

namespace QuizApp.Api.Services.Abstractions;

public interface IAvatarService
{
    Task<IReadOnlyList<AvatarDto>> GetCatalogAsync(Guid userId, CancellationToken cancellationToken = default);
    Task<UserProfileDto?> SelectAvatarAsync(Guid userId, int avatarId, CancellationToken cancellationToken = default);
    Task<UserProfileDto?> PurchaseAvatarAsync(Guid userId, int avatarId, CancellationToken cancellationToken = default);
    Task<Avatar?> GetDefaultAvatarAsync(CancellationToken cancellationToken = default);
}
