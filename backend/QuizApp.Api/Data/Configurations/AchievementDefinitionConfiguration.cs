using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using QuizApp.Api.Models;

namespace QuizApp.Api.Data.Configurations;

public sealed class AchievementDefinitionConfiguration : IEntityTypeConfiguration<AchievementDefinition>
{
    public void Configure(EntityTypeBuilder<AchievementDefinition> entity)
    {
        entity.ToTable("AchievementDefinitions");

        entity.HasKey(item => item.Id);

        entity.Property(item => item.Code)
            .IsRequired()
            .HasMaxLength(100);

        entity.Property(item => item.Name)
            .IsRequired()
            .HasMaxLength(150);

        entity.Property(item => item.Description)
            .IsRequired()
            .HasMaxLength(500);

        entity.Property(item => item.IconUrl)
            .IsRequired()
            .HasMaxLength(500);

        entity.Property(item => item.TriggerType)
            .HasConversion<string>()
            .HasMaxLength(40)
            .IsRequired();

        entity.Property(item => item.RequiredLevelKey)
            .HasMaxLength(100);

        entity.Property(item => item.RequiredCategoryKey)
            .HasMaxLength(100);

        entity.Property(item => item.RewardType)
            .HasConversion<string>()
            .HasMaxLength(40)
            .IsRequired();

        entity.Property(item => item.RewardAvatarKey)
            .HasMaxLength(100);

        entity.HasIndex(item => item.Code)
            .IsUnique();
    }
}
