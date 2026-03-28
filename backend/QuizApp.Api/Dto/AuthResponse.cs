namespace QuizApp.Api.Dto;

public sealed class AuthResponse : ISocialAuthResult
{
    public bool IsNewUser { get; init; }
    public string Token { get; init; } = string.Empty;
    public Guid UserId { get; init; }
    public UserProfileDto Profile { get; init; } = new();
}
