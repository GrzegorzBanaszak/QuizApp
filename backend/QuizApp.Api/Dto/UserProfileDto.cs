namespace QuizApp.Api.Dto;

public sealed class UserProfileDto
{
    public Guid Id { get; init; }
    public string Username { get; init; } = string.Empty;
    public string AvatarUrl { get; init; } = string.Empty;
    public int? CurrentAvatarId { get; init; }
    public string AuthProvider { get; init; } = string.Empty;
    public int TotalExperience { get; init; }
    public int Coins { get; init; }
    public PlayerProgressDto Progress { get; init; } = new();
}
