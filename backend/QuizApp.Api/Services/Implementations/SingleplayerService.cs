using Microsoft.EntityFrameworkCore;
using QuizApp.Api.Data;
using QuizApp.Api.Dto.Singleplayer;
using QuizApp.Api.Models;
using QuizApp.Api.Services.Abstractions;
using AutoMapper;

namespace QuizApp.Api.Services.Implementations;

public sealed class SingleplayerService : ISingleplayerService
{
    private readonly AppDbContext _context;
    private readonly IMapper _mapper;
    private readonly IAchievementService _achievementService;
    private readonly IProgressionService _progressionService;

    public SingleplayerService(
        AppDbContext context,
        IMapper mapper,
        IAchievementService achievementService,
        IProgressionService progressionService)
    {
        _context = context;
        _mapper = mapper;
        _achievementService = achievementService;
        _progressionService = progressionService;
    }

    public async Task<IEnumerable<CategoryDto>> GetCategoriesAsync(Guid userId)
    {
        var categories = await _context.Categories
            .AsNoTracking()
            .Include(category => category.Levels)
                .ThenInclude(level => level.QuestionDistributions)
            .OrderBy(category => category.Name)
            .ToListAsync();

        if (categories.Count == 0)
        {
            return Array.Empty<CategoryDto>();
        }

        var completedLevelIds = (await _context.SingleplayerResults
                .AsNoTracking()
                .Where(result => result.UserId == userId)
                .Select(result => result.LevelId)
                .Distinct()
                .ToListAsync())
            .ToHashSet();

        return categories.Select(category =>
        {
            var orderedLevels = category.Levels
                .OrderBy(level => level.Order)
                .ToList();

            var levelProgress = orderedLevels
                .Select(level => new CategoryLevelProgressDto(
                    level.Id,
                    level.Order,
                    completedLevelIds.Contains(level.Id),
                    ResolveLevelDifficulty(level).ToString()))
                .ToList();

            var completedLevelsCount = levelProgress.Count(level => level.IsCompleted);

            return new CategoryDto(
                category.Id,
                category.Name,
                category.Description,
                levelProgress.Count,
                completedLevelsCount,
                levelProgress);
        }).ToList();
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

        var levelResults = await _context.SingleplayerResults
            .AsNoTracking()
            .Where(result => result.UserId == userId && result.Level.CategoryId == categoryId)
            .Select(result => new
            {
                result.LevelId,
                LevelOrder = result.Level.Order,
                result.Score,
                result.CorrectAnswers,
                result.TotalQuestions,
                result.PlayedAt
            })
            .ToListAsync();

        var completedOrders = levelResults
            .Select(result => result.LevelOrder)
            .Distinct()
            .ToList();

        var highestUnlockedOrder = completedOrders.DefaultIfEmpty(0).Max();

        var unlockedThreshold = highestUnlockedOrder == 0 ? 1 : highestUnlockedOrder + 1;
        var bestResultsByLevelId = levelResults
            .GroupBy(result => result.LevelId)
            .ToDictionary(
                group => group.Key,
                group => group
                    .OrderByDescending(result => result.Score)
                    .ThenByDescending(result => result.PlayedAt)
                    .First());

        var mappedLevels = _mapper.Map<List<LevelDto>>(levels);

        for (var index = 0; index < mappedLevels.Count; index++)
        {
            var bestResult = bestResultsByLevelId.GetValueOrDefault(levels[index].Id);

            mappedLevels[index] = mappedLevels[index] with
            {
                IsUnlocked = levels[index].Order <= unlockedThreshold,
                IsCompleted = bestResult is not null,
                Grade = bestResult is null
                    ? null
                    : ResolveGrade(bestResult.CorrectAnswers, bestResult.TotalQuestions)
            };
        }

        return mappedLevels;
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
            BuildGameQuestionDtos(questions));
    }

    public async Task<SingleplayerResultSummaryDto> SubmitGameAsync(Guid userId, int levelId, SingleplayerSubmitRequestDto request)
    {
        var user = await _context.Users
            .SingleOrDefaultAsync(item => item.Id == userId)
            ?? throw new KeyNotFoundException($"User {userId} was not found.");

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
        var hadCompletedLevelBefore = await _context.SingleplayerResults
            .AsNoTracking()
            .AnyAsync(item => item.UserId == userId && item.LevelId == levelId);
        var awardedLevelExperience = hadCompletedLevelBefore
            ? session.Level.ReplayExperience
            : session.Level.FirstCompletionExperience;
        var previousProgress = _progressionService.BuildProgress(user.TotalExperience);

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

        await using var transaction = await _context.Database.BeginTransactionAsync();
        _context.SingleplayerResults.Add(result);
        user.TotalExperience += awardedLevelExperience;
        await _context.SaveChangesAsync();
        var achievementResult = await _achievementService.EvaluateAsync(userId);
        await transaction.CommitAsync();
        var finalProgress = _progressionService.BuildProgress(user.TotalExperience);
        var awardedExperience = awardedLevelExperience + achievementResult.AwardedExperience;

        return new SingleplayerResultSummaryDto(
            totalScore,
            correctAnswersCount,
            totalQuestions,
            details,
            awardedExperience,
            awardedLevelExperience,
            achievementResult.AwardedExperience,
            achievementResult.AwardedCoins,
            !hadCompletedLevelBefore,
            finalProgress.Level > previousProgress.Level,
            finalProgress,
            achievementResult.UnlockedAchievements.ToList());
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

    private static List<SingleplayerQuestionDto> BuildGameQuestionDtos(IEnumerable<SingleplayerQuestion> questions)
    {
        return questions
            .Select(question => new SingleplayerQuestionDto(
                question.Id,
                question.Text,
                question.Answers
                    .OrderBy(_ => Random.Shared.Next())
                    .Select(answer => new SingleplayerAnswerDto(answer.Id, answer.Text))
                    .ToList()))
            .ToList();
    }

    private static int CalculateScore(int correctAnswersCount, int totalQuestions)
    {
        return totalQuestions <= 0
            ? 0
            : correctAnswersCount * 10;
    }

    private static string ResolveGrade(int correctAnswersCount, int totalQuestions)
    {
        if (totalQuestions <= 0)
        {
            return "D";
        }

        var accuracy = (double)correctAnswersCount / totalQuestions;

        if (accuracy >= 1.0d)
        {
            return "S";
        }

        if (accuracy >= 0.8d)
        {
            return "A";
        }

        if (accuracy >= 0.6d)
        {
            return "B";
        }

        if (accuracy >= 0.4d)
        {
            return "C";
        }

        return "D";
    }

    private static QuestionDifficulty ResolveLevelDifficulty(Level level)
    {
        var dominantDistribution = level.QuestionDistributions
            .OrderByDescending(distribution => distribution.Count)
            .ThenByDescending(distribution => distribution.Difficulty)
            .FirstOrDefault();

        return dominantDistribution?.Difficulty ?? QuestionDifficulty.Easy;
    }
}
