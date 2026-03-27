namespace QuizApp.Api.Dto;

public sealed record FacebookLoginRequest(
    string ProviderToken,
    string? CustomUsername,
    string? CustomAvatarUrl);
