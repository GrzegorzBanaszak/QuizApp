using QuizApp.Api.Services.Implementations;

namespace QuizApp.Tests;

public sealed class ProgressionServiceTests
{
    private readonly ProgressionService _service = new();

    [Fact]
    public void BuildProgress_ForNewPlayer_StartsAtLevelOne()
    {
        var progress = _service.BuildProgress(0);

        Assert.Equal(1, progress.Level);
        Assert.Equal(0, progress.TotalExperience);
        Assert.Equal(0, progress.ExperienceForCurrentLevel);
        Assert.Equal(100, progress.ExperienceForNextLevel);
        Assert.Equal(0, progress.CurrentLevelExperience);
        Assert.Equal(100, progress.ExperienceToNextLevel);
    }

    [Fact]
    public void BuildProgress_AtLevelBoundary_AdvancesToNextLevel()
    {
        var progress = _service.BuildProgress(100);

        Assert.Equal(2, progress.Level);
        Assert.Equal(100, progress.ExperienceForCurrentLevel);
        Assert.Equal(250, progress.ExperienceForNextLevel);
        Assert.Equal(0, progress.CurrentLevelExperience);
        Assert.Equal(150, progress.ExperienceToNextLevel);
    }

    [Fact]
    public void BuildProgress_ForHigherExperience_ComputesCurrentLevelWindow()
    {
        var progress = _service.BuildProgress(620);

        Assert.Equal(5, progress.Level);
        Assert.Equal(500, progress.ExperienceForCurrentLevel);
        Assert.Equal(800, progress.ExperienceForNextLevel);
        Assert.Equal(120, progress.CurrentLevelExperience);
        Assert.Equal(180, progress.ExperienceToNextLevel);
    }
}
