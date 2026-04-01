using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using QuizApp.Api.Models;

namespace QuizApp.Api.Data.Configurations;

public sealed class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> entity)
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

        entity.Property(u => u.CurrentAvatarId)
            .IsRequired(false);

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

        entity.HasOne(u => u.CurrentAvatar)
            .WithMany(avatar => avatar.SelectedByUsers)
            .HasForeignKey(u => u.CurrentAvatarId)
            .OnDelete(DeleteBehavior.SetNull)
            .IsRequired(false);
    }
}
