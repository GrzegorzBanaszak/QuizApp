using QuizApp.Api.Dto;

namespace QuizApp.Api.Services.Abstractions;

public interface IAuthService
{
    Task<ISocialAuthResult> VerifyGoogleAsync(string token);
    Task<ISocialAuthResult> VerifyGoogleCodeAsync(string code, string redirectUri);
    Task<ISocialAuthResult> VerifyFacebookAsync(string token);
    Task<AuthResponse> RegisterSocialAsync(RegisterSocialRequest request);
    Task<AuthResponse> LoginAsGuestAsync(GuestLoginRequest request);
}
