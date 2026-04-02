using QuizApp.Api.Dto;

namespace QuizApp.Api.Services.Abstractions;

public interface IAchievementService
{
    Task<IReadOnlyList<AchievementDto>> GetCatalogAsync(Guid userId, CancellationToken cancellationToken = default);
    Task<AchievementEvaluationResult> EvaluateAsync(Guid userId, CancellationToken cancellationToken = default);
}
