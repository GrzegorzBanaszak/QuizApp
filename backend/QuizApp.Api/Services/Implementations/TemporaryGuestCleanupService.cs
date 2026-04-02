using Microsoft.EntityFrameworkCore;
using QuizApp.Api.Data;

namespace QuizApp.Api.Services.Implementations;

public sealed class TemporaryGuestCleanupService : BackgroundService
{
    private static readonly TimeSpan CleanupInterval = TimeSpan.FromHours(1);
    private static readonly TimeSpan GuestLifetime = TimeSpan.FromHours(24);

    private readonly IServiceScopeFactory _serviceScopeFactory;
    private readonly ILogger<TemporaryGuestCleanupService> _logger;

    public TemporaryGuestCleanupService(
        IServiceScopeFactory serviceScopeFactory,
        ILogger<TemporaryGuestCleanupService> logger)
    {
        _serviceScopeFactory = serviceScopeFactory;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        using var timer = new PeriodicTimer(CleanupInterval);

        await CleanupExpiredGuestsAsync(stoppingToken);

        while (await timer.WaitForNextTickAsync(stoppingToken))
        {
            await CleanupExpiredGuestsAsync(stoppingToken);
        }
    }

    private async Task CleanupExpiredGuestsAsync(CancellationToken cancellationToken)
    {
        try
        {
            await using var scope = _serviceScopeFactory.CreateAsyncScope();
            var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            var expirationThreshold = DateTime.UtcNow.Subtract(GuestLifetime);

            var expiredGuestUsers = dbContext.Users
                .Where(user => user.Role == "Guest" && user.CreatedAt <= expirationThreshold);

            var expiredGuestIds = expiredGuestUsers.Select(user => user.Id);

            var deletedResults = await dbContext.SingleplayerResults
                .Where(result => expiredGuestIds.Contains(result.UserId))
                .ExecuteDeleteAsync(cancellationToken);

            var deletedUsers = await expiredGuestUsers.ExecuteDeleteAsync(cancellationToken);

            if (deletedUsers > 0)
            {
                _logger.LogInformation(
                    "Deleted {DeletedUsers} expired guest users and {DeletedResults} related singleplayer results older than {ExpirationThresholdUtc:u}.",
                    deletedUsers,
                    deletedResults,
                    expirationThreshold);
            }
        }
        catch (OperationCanceledException) when (cancellationToken.IsCancellationRequested)
        {
            throw;
        }
        catch (Exception exception)
        {
            _logger.LogError(exception, "Failed to clean up expired guest users.");
        }
    }
}
