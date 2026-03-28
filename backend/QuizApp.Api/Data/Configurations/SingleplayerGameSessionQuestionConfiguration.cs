using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using QuizApp.Api.Models;

namespace QuizApp.Api.Data.Configurations;

public sealed class SingleplayerGameSessionQuestionConfiguration : IEntityTypeConfiguration<SingleplayerGameSessionQuestion>
{
    public void Configure(EntityTypeBuilder<SingleplayerGameSessionQuestion> entity)
    {
        entity.ToTable("SingleplayerGameSessionQuestions");

        entity.HasKey(q => q.Id);

        entity.Property(q => q.QuestionOrder)
            .IsRequired();

        entity.HasOne(q => q.Question)
            .WithMany()
            .HasForeignKey(q => q.QuestionId)
            .OnDelete(DeleteBehavior.Restrict);

        entity.HasIndex(q => new { q.GameSessionId, q.QuestionOrder })
            .IsUnique();
    }
}
