using QuizApp.Api.Models;

namespace QuizApp.Api.Dto;

public sealed record RegisterSocialRequest(
    AuthProvider Provider,
    string ProviderToken,
    string? CustomUsername,
    string? CustomAvatarUrl);
