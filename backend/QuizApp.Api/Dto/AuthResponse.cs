namespace QuizApp.Api.Dto;

public sealed class AuthResponse
{
    public string Token { get; init; } = string.Empty;
    public Guid UserId { get; init; }
    public UserProfileDto Profile { get; init; } = new();
}
