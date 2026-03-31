namespace QuizApp.Api.Dto.Singleplayer;

public sealed record CategoryLevelProgressDto(
    int Id,
    int Order,
    bool IsCompleted,
    string Difficulty);
