using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using QuizApp.Api.Models;

namespace QuizApp.Api.Data.Configurations;

public sealed class LevelConfiguration : IEntityTypeConfiguration<Level>
{
    public void Configure(EntityTypeBuilder<Level> entity)
    {
        entity.ToTable("Levels");

        entity.HasKey(l => l.Id);

        entity.Property(l => l.Name)
            .IsRequired()
            .HasMaxLength(200);

        entity.Property(l => l.Difficulty)
            .IsRequired()
            .HasMaxLength(50);

        entity.Property(l => l.Order)
            .IsRequired();
    }
}
