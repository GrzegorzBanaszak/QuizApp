namespace QuizApp.Api.Models;

public class User
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Username { get; set; } = string.Empty;
    public string AvatarUrl { get; set; } = string.Empty;
    public int? CurrentAvatarId { get; set; }
    public Avatar? CurrentAvatar { get; set; }
    public string Role { get; set; } = "User";
    public string? GoogleId { get; set; }
    public string? FacebookId { get; set; }
    public int TotalExperience { get; set; } = 0;
    public int Coins { get; set; } = 0;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime LastLoginAt { get; set; } = DateTime.UtcNow;
    public ICollection<UserOwnedAvatar> OwnedAvatars { get; set; } = new List<UserOwnedAvatar>();
    public ICollection<UserAchievement> Achievements { get; set; } = new List<UserAchievement>();
}
