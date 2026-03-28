using Microsoft.EntityFrameworkCore;
using QuizApp.Api.Data;
using QuizApp.Api.Dto.Singleplayer;
using QuizApp.Api.Models;
using QuizApp.Api.Services.Abstractions;

namespace QuizApp.Api.Services.Implementations;

public sealed class SingleplayerService : ISingleplayerService
{
    private readonly AppDbContext _context;

    public SingleplayerService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<CategoryDto>> GetCategoriesAsync()
    {
        return await _context.Categories
            .AsNoTracking()
            .OrderBy(category => category.Name)
            .Select(category => new CategoryDto(category.Id, category.Name, category.Description))
            .ToListAsync();
    }

    public async Task<IEnumerable<LevelDto>> GetLevelsByCategoryAsync(int categoryId, Guid userId)
    {
        var levels = await _context.Levels
            .AsNoTracking()
            .Where(level => level.CategoryId == categoryId)
            .OrderBy(level => level.Order)
            .Select(level => new
            {
                level.Id,
                level.CategoryId,
                level.Name,
                level.Difficulty,
                level.Order
            })
            .ToListAsync();

        if (levels.Count == 0)
        {
            return Array.Empty<LevelDto>();
        }

        var completedOrders = await _context.SingleplayerResults
            .AsNoTracking()
            .Where(result => result.UserId == userId && result.Level.CategoryId == categoryId)
            .Select(result => result.Level.Order)
            .ToListAsync();

        var highestUnlockedOrder = completedOrders.DefaultIfEmpty(0).Max();

        var unlockedThreshold = highestUnlockedOrder == 0 ? 1 : highestUnlockedOrder + 1;

        return levels.Select(level => new LevelDto
        {
            Id = level.Id,
            CategoryId = level.CategoryId,
            Name = level.Name,
            Difficulty = level.Difficulty,
            IsUnlocked = level.Order <= unlockedThreshold
        });
    }

    public async Task<IEnumerable<SingleplayerQuestionDto>> GetQuestionsForLevelAsync(int levelId)
    {
        var questions = await _context.SingleplayerQuestions
            .AsNoTracking()
            .Where(question => question.LevelId == levelId)
            .Include(question => question.Answers)
            .OrderBy(question => question.Id)
            .ToListAsync();

        return questions.Select(question => new SingleplayerQuestionDto(
            question.Id,
            question.Text,
            question.Answers
                .OrderBy(answer => answer.Id)
                .Select(answer => new SingleplayerAnswerDto(answer.Id, answer.Text))
                .ToList()));
    }

    public async Task<SingleplayerResultSummaryDto> SubmitGameAsync(Guid userId, SingleplayerSubmitRequestDto request)
    {
        var level = await _context.Levels
            .AsNoTracking()
            .SingleOrDefaultAsync(item => item.Id == request.LevelId);

        if (level is null)
        {
            throw new KeyNotFoundException($"Level {request.LevelId} was not found.");
        }

        var questions = await _context.SingleplayerQuestions
            .AsNoTracking()
            .Where(question => question.LevelId == request.LevelId)
            .Include(question => question.Answers)
            .OrderBy(question => question.Id)
            .ToListAsync();

        var answersByQuestion = (request.PlayerAnswers ?? [])
            .ToDictionary(answer => answer.QuestionId, answer => answer.SelectedAnswerId);

        var details = new List<QuestionResultDetail>(questions.Count);
        var correctAnswersCount = 0;

        foreach (var question in questions)
        {
            var selectedAnswerId = answersByQuestion.TryGetValue(question.Id, out var answerId)
                ? answerId
                : string.Empty;

            var isCorrect = string.Equals(selectedAnswerId, question.CorrectAnswerId, StringComparison.OrdinalIgnoreCase);

            if (isCorrect)
            {
                correctAnswersCount++;
            }

            details.Add(new QuestionResultDetail(question.Id, isCorrect, question.CorrectAnswerId));
        }

        var totalQuestions = questions.Count;
        var totalScore = CalculateScore(correctAnswersCount, totalQuestions);

        var result = new SingleplayerResult
        {
            UserId = userId,
            LevelId = request.LevelId,
            Score = totalScore,
            CorrectAnswers = correctAnswersCount,
            TotalQuestions = totalQuestions,
            PlayedAt = DateTime.UtcNow
        };

        _context.SingleplayerResults.Add(result);
        await _context.SaveChangesAsync();

        return new SingleplayerResultSummaryDto(
            totalScore,
            correctAnswersCount,
            totalQuestions,
            details);
    }

    private static int CalculateScore(int correctAnswersCount, int totalQuestions)
    {
        return totalQuestions <= 0
            ? 0
            : correctAnswersCount * 10;
    }
}
