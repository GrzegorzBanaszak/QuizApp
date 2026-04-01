namespace QuizApp.Api.Dto.Singleplayer;

public sealed record CategoryDto(
    int Id,
    string Name,
    string Description,
    int TotalLevels,
    int CompletedLevelsCount,
    List<CategoryLevelProgressDto> Levels);
