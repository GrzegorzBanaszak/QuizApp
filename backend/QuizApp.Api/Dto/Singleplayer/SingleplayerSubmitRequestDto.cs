namespace QuizApp.Api.Dto.Singleplayer;

public sealed record SingleplayerSubmitRequestDto(Guid SessionId, List<PlayerAnswerSelection> PlayerAnswers);
