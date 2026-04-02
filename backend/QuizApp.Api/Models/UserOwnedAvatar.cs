namespace QuizApp.Api.Models;

public class UserOwnedAvatar
{
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;
    public int AvatarId { get; set; }
    public Avatar Avatar { get; set; } = null!;
    public DateTime UnlockedAt { get; set; } = DateTime.UtcNow;
}
