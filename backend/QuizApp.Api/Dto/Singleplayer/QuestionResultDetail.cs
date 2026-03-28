namespace QuizApp.Api.Dto.Singleplayer;

public sealed record QuestionResultDetail(int QuestionId, bool IsCorrect, string CorrectAnswerId);
