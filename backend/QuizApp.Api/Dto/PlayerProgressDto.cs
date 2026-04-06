namespace QuizApp.Api.Dto;

public sealed class PlayerProgressDto
{
    public int Level { get; init; }
    public int TotalExperience { get; init; }
    public int ExperienceForCurrentLevel { get; init; }
    public int ExperienceForNextLevel { get; init; }
    public int CurrentLevelExperience { get; init; }
    public int ExperienceToNextLevel { get; init; }
}
