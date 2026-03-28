using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using QuizApp.Api.Models;

namespace QuizApp.Api.Data.Configurations;

public sealed class SingleplayerAnswerConfiguration : IEntityTypeConfiguration<SingleplayerAnswer>
{
    public void Configure(EntityTypeBuilder<SingleplayerAnswer> entity)
    {
        entity.ToTable("SingleplayerAnswers");

        entity.HasKey(a => a.Id);

        entity.Property(a => a.Id)
            .HasMaxLength(100);

        entity.Property(a => a.Text)
            .IsRequired()
            .HasMaxLength(500);
    }
}
