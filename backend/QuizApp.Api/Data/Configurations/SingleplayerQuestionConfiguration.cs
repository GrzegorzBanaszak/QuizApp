using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using QuizApp.Api.Models;

namespace QuizApp.Api.Data.Configurations;

public sealed class SingleplayerQuestionConfiguration : IEntityTypeConfiguration<SingleplayerQuestion>
{
    public void Configure(EntityTypeBuilder<SingleplayerQuestion> entity)
    {
        entity.ToTable("SingleplayerQuestions");

        entity.HasKey(q => q.Id);

        entity.Property(q => q.Key)
            .IsRequired()
            .HasMaxLength(100);

        entity.Property(q => q.Text)
            .IsRequired()
            .HasMaxLength(1000);

        entity.Property(q => q.Difficulty)
            .IsRequired()
            .HasConversion<string>()
            .HasMaxLength(20);

        entity.Property(q => q.CorrectAnswerId)
            .IsRequired()
            .HasMaxLength(100);

        entity.HasMany(q => q.Answers)
            .WithOne(a => a.Question)
            .HasForeignKey(a => a.QuestionId)
            .OnDelete(DeleteBehavior.Cascade);

        entity.HasOne(q => q.Category)
            .WithMany(c => c.Questions)
            .HasForeignKey(q => q.CategoryId)
            .OnDelete(DeleteBehavior.Cascade);

        entity.HasIndex(q => q.Key)
            .IsUnique();
    }
}
