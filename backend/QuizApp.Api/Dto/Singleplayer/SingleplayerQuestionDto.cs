namespace QuizApp.Api.Dto.Singleplayer;

public sealed record SingleplayerQuestionDto(int Id, string Text, List<SingleplayerAnswerDto> Answers);
