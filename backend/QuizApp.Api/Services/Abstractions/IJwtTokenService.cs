using QuizApp.Api.Models;

namespace QuizApp.Api.Services.Abstractions;

public sealed record JwtTokenResult(string Token, DateTime ExpiresAtUtc);

public interface IJwtTokenService
{
    JwtTokenResult GenerateToken(User user);
}
