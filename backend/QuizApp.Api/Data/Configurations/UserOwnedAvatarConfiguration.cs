using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using QuizApp.Api.Models;

namespace QuizApp.Api.Data.Configurations;

public sealed class UserOwnedAvatarConfiguration : IEntityTypeConfiguration<UserOwnedAvatar>
{
    public void Configure(EntityTypeBuilder<UserOwnedAvatar> entity)
    {
        entity.ToTable("UserOwnedAvatars");

        entity.HasKey(item => new { item.UserId, item.AvatarId });

        entity.Property(item => item.UnlockedAt)
            .HasDefaultValueSql("timezone('utc', now())");

        entity.HasOne(item => item.User)
            .WithMany(user => user.OwnedAvatars)
            .HasForeignKey(item => item.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        entity.HasOne(item => item.Avatar)
            .WithMany(avatar => avatar.Owners)
            .HasForeignKey(item => item.AvatarId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
