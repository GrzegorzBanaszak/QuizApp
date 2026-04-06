namespace QuizApp.Api.Dto;

public sealed class UpdateUserProfileRequest
{
    public string Username { get; init; } = string.Empty;
    public string AvatarUrl { get; init; } = string.Empty;
}
