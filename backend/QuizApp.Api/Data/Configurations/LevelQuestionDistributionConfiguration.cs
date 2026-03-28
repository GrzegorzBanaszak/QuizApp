using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using QuizApp.Api.Models;

namespace QuizApp.Api.Data.Configurations;

public sealed class LevelQuestionDistributionConfiguration : IEntityTypeConfiguration<LevelQuestionDistribution>
{
    public void Configure(EntityTypeBuilder<LevelQuestionDistribution> entity)
    {
        entity.ToTable("LevelQuestionDistributions");

        entity.HasKey(d => d.Id);

        entity.Property(d => d.Difficulty)
            .IsRequired()
            .HasConversion<string>()
            .HasMaxLength(20);

        entity.Property(d => d.Count)
            .IsRequired();

        entity.HasIndex(d => new { d.LevelId, d.Difficulty })
            .IsUnique();
    }
}
