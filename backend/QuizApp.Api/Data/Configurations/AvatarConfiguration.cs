using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using QuizApp.Api.Models;

namespace QuizApp.Api.Data.Configurations;

public sealed class AvatarConfiguration : IEntityTypeConfiguration<Avatar>
{
    public void Configure(EntityTypeBuilder<Avatar> entity)
    {
        entity.ToTable("Avatars");

        entity.HasKey(avatar => avatar.Id);

        entity.Property(avatar => avatar.Key)
            .IsRequired()
            .HasMaxLength(100);

        entity.Property(avatar => avatar.Name)
            .IsRequired()
            .HasMaxLength(150);

        entity.Property(avatar => avatar.ImageUrl)
            .IsRequired()
            .HasMaxLength(500);

        entity.Property(avatar => avatar.UnlockType)
            .HasConversion<string>()
            .HasMaxLength(40)
            .IsRequired();

        entity.Property(avatar => avatar.RequiredAchievementCode)
            .HasMaxLength(100);

        entity.Property(avatar => avatar.Price)
            .HasDefaultValue(0);

        entity.HasIndex(avatar => avatar.Key).IsUnique();
    }
}
