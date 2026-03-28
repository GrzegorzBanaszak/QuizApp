namespace QuizApp.Api.Dto;

public sealed record GuestLoginRequest(
    string? CustomUsername,
    string? CustomAvatarUrl);
