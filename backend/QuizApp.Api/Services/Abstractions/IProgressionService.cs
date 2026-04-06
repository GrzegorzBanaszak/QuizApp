using QuizApp.Api.Dto;

namespace QuizApp.Api.Services.Abstractions;

public interface IProgressionService
{
    PlayerProgressDto BuildProgress(int totalExperience);
}
