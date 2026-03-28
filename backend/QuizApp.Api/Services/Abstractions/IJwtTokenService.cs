using QuizApp.Api.Models;

namespace QuizApp.Api.Services.Abstractions;

public interface IJwtTokenService
{
    string GenerateToken(User user);
}
