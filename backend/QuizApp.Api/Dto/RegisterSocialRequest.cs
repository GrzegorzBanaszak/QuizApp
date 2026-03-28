namespace QuizApp.Api.Dto;

public sealed record RegisterSocialRequest(
    string Provider,
    string ProviderToken,
    string? CustomUsername,
    string? CustomAvatarUrl);
