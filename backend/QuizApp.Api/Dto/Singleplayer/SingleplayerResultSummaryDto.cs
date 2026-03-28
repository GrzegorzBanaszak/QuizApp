namespace QuizApp.Api.Dto.Singleplayer;

public sealed record SingleplayerResultSummaryDto(
    int TotalScore,
    int CorrectAnswersCount,
    int TotalQuestions,
    List<QuestionResultDetail> Details);
