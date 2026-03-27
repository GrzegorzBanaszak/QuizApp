using QuizApp.Api.Models;

namespace QuizApp.Api.Services;

public interface IJwtTokenService
{
    string GenerateToken(User user);
}
