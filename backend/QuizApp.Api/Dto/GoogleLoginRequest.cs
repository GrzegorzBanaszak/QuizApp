namespace QuizApp.Api.Dto;

public sealed record GoogleLoginRequest(
    string ProviderToken,
    string? CustomUsername,
    string? CustomAvatarUrl);
