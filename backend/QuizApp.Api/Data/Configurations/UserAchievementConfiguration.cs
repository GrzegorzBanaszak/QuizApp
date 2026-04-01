using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using QuizApp.Api.Models;

namespace QuizApp.Api.Data.Configurations;

public sealed class UserAchievementConfiguration : IEntityTypeConfiguration<UserAchievement>
{
    public void Configure(EntityTypeBuilder<UserAchievement> entity)
    {
        entity.ToTable("UserAchievements");

        entity.HasKey(item => item.Id);

        entity.Property(item => item.Code)
            .IsRequired()
            .HasMaxLength(100);

        entity.Property(item => item.AwardedAt)
            .HasDefaultValueSql("GETUTCDATE()");

        entity.HasIndex(item => new { item.UserId, item.Code }).IsUnique();

        entity.HasOne(item => item.User)
            .WithMany(user => user.Achievements)
            .HasForeignKey(item => item.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
