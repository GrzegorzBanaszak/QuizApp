namespace QuizApp.Api.Dto.Singleplayer;

public sealed record SingleplayerSubmitRequestDto(int LevelId, List<PlayerAnswerSelection> PlayerAnswers);
