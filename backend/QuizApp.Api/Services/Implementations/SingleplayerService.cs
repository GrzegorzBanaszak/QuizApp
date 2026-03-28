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
            .Include(level => level.QuestionDistributions)
            .Where(level => level.CategoryId == categoryId)
            .OrderBy(level => level.Order)
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
            QuestionDistributions = level.QuestionDistributions
                .OrderBy(distribution => distribution.Difficulty)
                .Select(distribution => new LevelQuestionDistributionDto(
                    distribution.Difficulty.ToString(),
                    distribution.Count))
                .ToList(),
            TotalQuestionCount = level.QuestionDistributions.Sum(distribution => distribution.Count),
            IsUnlocked = level.Order <= unlockedThreshold
        });
    }

    public async Task<SingleplayerGameDto> GetQuestionsForLevelAsync(int levelId, Guid userId)
    {
        var level = await _context.Levels
            .AsNoTracking()
            .Include(item => item.QuestionDistributions)
            .SingleOrDefaultAsync(item => item.Id == levelId);

        if (level is null)
        {
            throw new KeyNotFoundException($"Level {levelId} was not found.");
        }

        var questions = await BuildQuestionsForLevelAsync(level);

        var session = new SingleplayerGameSession
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            LevelId = level.Id,
            StartedAt = DateTime.UtcNow,
            Questions = questions.Select((question, index) => new SingleplayerGameSessionQuestion
            {
                QuestionId = question.Id,
                QuestionOrder = index + 1
            }).ToList()
        };

        _context.SingleplayerGameSessions.Add(session);
        await _context.SaveChangesAsync();

        return new SingleplayerGameDto(
            session.Id,
            level.Id,
            questions.Select(MapQuestionToDto).ToList());
    }

    public async Task<SingleplayerResultSummaryDto> SubmitGameAsync(Guid userId, int levelId, SingleplayerSubmitRequestDto request)
    {
        var session = await _context.SingleplayerGameSessions
            .AsNoTracking()
            .Include(item => item.Level)
            .Include(item => item.Questions)
                .ThenInclude(item => item.Question)
                    .ThenInclude(question => question.Answers)
            .SingleOrDefaultAsync(item => item.Id == request.SessionId && item.UserId == userId);

        if (session is null)
        {
            throw new KeyNotFoundException($"Session {request.SessionId} was not found.");
        }

        if (session.LevelId != levelId)
        {
            throw new InvalidOperationException($"Session {request.SessionId} does not belong to level {levelId}.");
        }

        var questions = session.Questions
            .OrderBy(question => question.QuestionOrder)
            .Select(question => question.Question)
            .ToList();

        var answersByQuestion = (request.PlayerAnswers ?? [])
            .GroupBy(answer => answer.QuestionId)
            .ToDictionary(group => group.Key, group => group.Last().SelectedAnswerId);

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
            GameSessionId = session.Id,
            LevelId = levelId,
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

    private async Task<List<SingleplayerQuestion>> BuildQuestionsForLevelAsync(Level level)
    {
        var distributions = level.QuestionDistributions
            .OrderBy(distribution => distribution.Difficulty)
            .ToList();

        if (distributions.Count == 0)
        {
            throw new InvalidOperationException($"Level {level.Id} has no question distributions.");
        }

        var questions = new List<SingleplayerQuestion>();

        foreach (var distribution in distributions)
        {
            var selectedQuestions = await SelectQuestionsByDifficultyAsync(
                level.CategoryId,
                distribution.Difficulty,
                distribution.Count);

            questions.AddRange(selectedQuestions);
        }

        return questions
            .OrderBy(_ => Random.Shared.Next())
            .ToList();
    }

    private async Task<List<SingleplayerQuestion>> SelectQuestionsByDifficultyAsync(int categoryId, QuestionDifficulty difficulty, int count)
    {
        if (count <= 0)
        {
            return [];
        }

        var questions = await _context.SingleplayerQuestions
            .AsNoTracking()
            .Where(question => question.CategoryId == categoryId && question.Difficulty == difficulty)
            .Include(question => question.Answers)
            .ToListAsync();

        if (questions.Count < count)
        {
            throw new InvalidOperationException(
                $"Category {categoryId} does not contain enough questions for {difficulty}. Required: {count}, available: {questions.Count}.");
        }

        return questions
            .OrderBy(_ => Random.Shared.Next())
            .Take(count)
            .ToList();
    }

    private static SingleplayerQuestionDto MapQuestionToDto(SingleplayerQuestion question)
    {
        return new SingleplayerQuestionDto(
            question.Id,
            question.Text,
            question.Answers
                .OrderBy(answer => answer.Id)
                .Select(answer => new SingleplayerAnswerDto(answer.Id, answer.Text))
                .ToList());
    }

    private static int CalculateScore(int correctAnswersCount, int totalQuestions)
    {
        return totalQuestions <= 0
            ? 0
            : correctAnswersCount * 10;
    }
}
