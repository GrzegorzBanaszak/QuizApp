using QuizApp.Api.Dto.Singleplayer;

namespace QuizApp.Api.Services.Abstractions;

public interface ISingleplayerService
{
    Task<IEnumerable<CategoryDto>> GetCategoriesAsync();
    Task<IEnumerable<LevelDto>> GetLevelsByCategoryAsync(int categoryId, Guid userId);
    Task<SingleplayerGameDto> GetQuestionsForLevelAsync(int levelId, Guid userId);
    Task<SingleplayerResultSummaryDto> SubmitGameAsync(Guid userId, int levelId, SingleplayerSubmitRequestDto request);
}
