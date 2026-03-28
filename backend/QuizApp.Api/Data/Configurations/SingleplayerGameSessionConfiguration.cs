using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using QuizApp.Api.Models;

namespace QuizApp.Api.Data.Configurations;

public sealed class SingleplayerGameSessionConfiguration : IEntityTypeConfiguration<SingleplayerGameSession>
{
    public void Configure(EntityTypeBuilder<SingleplayerGameSession> entity)
    {
        entity.ToTable("SingleplayerGameSessions");

        entity.HasKey(s => s.Id);

        entity.Property(s => s.StartedAt)
            .IsRequired()
            .HasDefaultValueSql("GETUTCDATE()");

        entity.HasOne(s => s.User)
            .WithMany()
            .HasForeignKey(s => s.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        entity.HasOne(s => s.Level)
            .WithMany()
            .HasForeignKey(s => s.LevelId)
            .OnDelete(DeleteBehavior.Restrict);

        entity.HasMany(s => s.Questions)
            .WithOne(q => q.GameSession)
            .HasForeignKey(q => q.GameSessionId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
