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
    public DbSet<SingleplayerResult> SingleplayerResults => Set<SingleplayerResult>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<User>(entity =>
        {
            entity.ToTable("Users");

            entity.HasKey(u => u.Id);

            entity.Property(u => u.Id)
                .ValueGeneratedNever();

            entity.Property(u => u.Username)
                .IsRequired()
                .HasMaxLength(100);

            entity.Property(u => u.AvatarUrl)
                .IsRequired()
                .HasMaxLength(500);

            entity.Property(u => u.Role)
                .IsRequired()
                .HasMaxLength(30);

            entity.Property(u => u.GoogleId)
                .HasMaxLength(200)
                .IsRequired(false);

            entity.Property(u => u.FacebookId)
                .HasMaxLength(200)
                .IsRequired(false);

            entity.Property(u => u.TotalExperience)
                .HasDefaultValue(0);

            entity.Property(u => u.Coins)
                .HasDefaultValue(0);

            entity.Property(u => u.CreatedAt)
                .HasDefaultValueSql("GETUTCDATE()");

            entity.Property(u => u.LastLoginAt)
                .HasDefaultValueSql("GETUTCDATE()");

            entity.HasIndex(u => u.Username).IsUnique();
            entity.HasIndex(u => u.GoogleId).IsUnique().HasFilter("[GoogleId] IS NOT NULL");
            entity.HasIndex(u => u.FacebookId).IsUnique().HasFilter("[FacebookId] IS NOT NULL");
        });

        modelBuilder.Entity<Category>(entity =>
        {
            entity.ToTable("Categories");

            entity.HasKey(c => c.Id);

            entity.Property(c => c.Name)
                .IsRequired()
                .HasMaxLength(200);

            entity.Property(c => c.Description)
                .IsRequired()
                .HasMaxLength(1000);

            entity.HasMany(c => c.Levels)
                .WithOne(l => l.Category)
                .HasForeignKey(l => l.CategoryId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<Level>(entity =>
        {
            entity.ToTable("Levels");

            entity.HasKey(l => l.Id);

            entity.Property(l => l.Name)
                .IsRequired()
                .HasMaxLength(200);

            entity.Property(l => l.Difficulty)
                .IsRequired()
                .HasMaxLength(50);

            entity.Property(l => l.Order)
                .IsRequired();
        });

        modelBuilder.Entity<SingleplayerResult>(entity =>
        {
            entity.ToTable("SingleplayerResults");

            entity.HasKey(r => r.Id);

            entity.Property(r => r.Score)
                .IsRequired()
                .HasDefaultValue(0);

            entity.Property(r => r.CorrectAnswers)
                .IsRequired()
                .HasDefaultValue(0);

            entity.Property(r => r.TotalQuestions)
                .IsRequired()
                .HasDefaultValue(0);

            entity.Property(r => r.PlayedAt)
                .IsRequired()
                .HasDefaultValueSql("GETUTCDATE()");

            entity.HasOne(r => r.User)
                .WithMany()
                .HasForeignKey(r => r.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(r => r.Level)
                .WithMany()
                .HasForeignKey(r => r.LevelId)
                .OnDelete(DeleteBehavior.Restrict);
        });
    }
}
