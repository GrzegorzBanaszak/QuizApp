using QuizApp.Api.Dto;
using QuizApp.Api.Services.Abstractions;

namespace QuizApp.Api.Services.Implementations;

public sealed class ProgressionService : IProgressionService
{
    private const int BaseExperiencePerLevel = 100;
    private const int AdditionalExperiencePerLevel = 50;

    public PlayerProgressDto BuildProgress(int totalExperience)
    {
        var sanitizedExperience = Math.Max(0, totalExperience);
        var level = 1;
        var experienceForCurrentLevel = 0;
        var experienceRequiredForNextLevel = GetExperienceRequiredForNextLevel(level);

        while (sanitizedExperience >= experienceForCurrentLevel + experienceRequiredForNextLevel)
        {
            experienceForCurrentLevel += experienceRequiredForNextLevel;
            level++;
            experienceRequiredForNextLevel = GetExperienceRequiredForNextLevel(level);
        }

        var experienceForNextLevel = experienceForCurrentLevel + experienceRequiredForNextLevel;

        return new PlayerProgressDto
        {
            Level = level,
            TotalExperience = sanitizedExperience,
            ExperienceForCurrentLevel = experienceForCurrentLevel,
            ExperienceForNextLevel = experienceForNextLevel,
            CurrentLevelExperience = sanitizedExperience - experienceForCurrentLevel,
            ExperienceToNextLevel = experienceForNextLevel - sanitizedExperience
        };
    }

    private static int GetExperienceRequiredForNextLevel(int level)
    {
        return BaseExperiencePerLevel + ((level - 1) * AdditionalExperiencePerLevel);
    }
}
