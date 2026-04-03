using QuizApp.Api.Dto;
using QuizApp.Api.Models;

namespace QuizApp.Api.Services.Abstractions;

public interface IAvatarService
{
    Task<IReadOnlyList<AvatarDto>> GetCreateCatalogAsync(CancellationToken cancellationToken = default);
    Task<IReadOnlyList<AvatarDto>> GetCatalogAsync(Guid userId, AvatarCatalogView view, CancellationToken cancellationToken = default);
    Task<UserProfileDto?> SelectAvatarAsync(Guid userId, int avatarId, CancellationToken cancellationToken = default);
    Task<UserProfileDto?> PurchaseAvatarAsync(Guid userId, int avatarId, CancellationToken cancellationToken = default);
    Task<Avatar?> GetDefaultAvatarAsync(CancellationToken cancellationToken = default);
    Task<Avatar?> ResolveDefaultAvatarAsync(int? avatarId, CancellationToken cancellationToken = default);
}
