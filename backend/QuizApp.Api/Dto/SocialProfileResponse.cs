namespace QuizApp.Api.Dto;

public sealed class SocialProfileResponse : ISocialAuthResult
{
    public bool IsNewUser { get; init; }
    public string? GoogleId { get; init; }
    public string? FacebookId { get; init; }
    public string Name { get; init; } = string.Empty;
    public string? FirstName { get; init; }
    public string? LastName { get; init; }
    public string AvatarUrl { get; init; } = string.Empty;
}
