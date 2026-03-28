namespace QuizApp.Api.Dto.Singleplayer;

public sealed record SingleplayerGameDto(
    Guid SessionId,
    int LevelId,
    List<SingleplayerQuestionDto> Questions);
