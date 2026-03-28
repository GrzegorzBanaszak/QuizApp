using Microsoft.EntityFrameworkCore;
using QuizApp.Api.Models;

namespace QuizApp.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<Level> Levels => Set<Level>();
    public DbSet<LevelQuestionDistribution> LevelQuestionDistributions => Set<LevelQuestionDistribution>();
    public DbSet<SingleplayerQuestion> SingleplayerQuestions => Set<SingleplayerQuestion>();
    public DbSet<SingleplayerAnswer> SingleplayerAnswers => Set<SingleplayerAnswer>();
    public DbSet<SingleplayerGameSession> SingleplayerGameSessions => Set<SingleplayerGameSession>();
    public DbSet<SingleplayerGameSessionQuestion> SingleplayerGameSessionQuestions => Set<SingleplayerGameSessionQuestion>();
    public DbSet<SingleplayerResult> SingleplayerResults => Set<SingleplayerResult>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);
    }
}
