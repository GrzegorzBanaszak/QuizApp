namespace QuizApp.Api.Dto;

public sealed record GoogleLoginRequest(
    string? Code,
    string? RedirectUri,
    string? Token);
