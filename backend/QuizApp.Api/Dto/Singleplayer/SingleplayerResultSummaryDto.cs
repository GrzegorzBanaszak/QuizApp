using QuizApp.Api.Dto;

namespace QuizApp.Api.Dto.Singleplayer;

public sealed record SingleplayerResultSummaryDto(
    int TotalScore,
    int CorrectAnswersCount,
    int TotalQuestions,
    List<QuestionResultDetail> Details,
    int AwardedExperience,
    int AwardedLevelExperience,
    int AwardedAchievementExperience,
    int AwardedCoins,
    bool IsFirstCompletion,
    bool LeveledUp,
    PlayerProgressDto Progress,
    List<AchievementAwardDto> UnlockedAchievements);
