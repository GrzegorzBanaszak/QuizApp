using System.Text.Json.Serialization;

namespace QuizApp.Api.Dto;

public sealed class AuthResponse : ISocialAuthResult
{
    public bool IsNewUser { get; init; }
    [JsonIgnore]
    public string Token { get; init; } = string.Empty;
    [JsonIgnore]
    public DateTime ExpiresAtUtc { get; init; }
    public Guid UserId { get; init; }
    public UserProfileDto Profile { get; init; } = new();
}
