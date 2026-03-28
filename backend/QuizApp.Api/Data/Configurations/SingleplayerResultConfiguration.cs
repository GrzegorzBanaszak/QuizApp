using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using QuizApp.Api.Models;

namespace QuizApp.Api.Data.Configurations;

public sealed class SingleplayerResultConfiguration : IEntityTypeConfiguration<SingleplayerResult>
{
    public void Configure(EntityTypeBuilder<SingleplayerResult> entity)
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

        entity.HasOne(r => r.GameSession)
            .WithMany()
            .HasForeignKey(r => r.GameSessionId)
            .OnDelete(DeleteBehavior.Cascade);

        entity.HasOne(r => r.Level)
            .WithMany()
            .HasForeignKey(r => r.LevelId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
