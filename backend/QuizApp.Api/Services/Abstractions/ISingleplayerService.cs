using QuizApp.Api.Dto.Singleplayer;

namespace QuizApp.Api.Services.Abstractions;

public interface ISingleplayerService
{
    Task<IEnumerable<CategoryDto>> GetCategoriesAsync();
    Task<IEnumerable<LevelDto>> GetLevelsByCategoryAsync(int categoryId, Guid userId);
    Task<IEnumerable<SingleplayerQuestionDto>> GetQuestionsForLevelAsync(int levelId);
    Task<SingleplayerResultSummaryDto> SubmitGameAsync(Guid userId, SingleplayerSubmitRequestDto request);
}
