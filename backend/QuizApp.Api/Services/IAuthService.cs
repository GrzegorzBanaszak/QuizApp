using QuizApp.Api.Dto;

namespace QuizApp.Api.Services;

public interface IAuthService
{
    Task<SocialProfileResponse> VerifyGoogleAsync(string token);
    Task<SocialProfileResponse> VerifyFacebookAsync(string token);
    Task<AuthResponse> LoginWithGoogleAsync(GoogleLoginRequest request);
    Task<AuthResponse> LoginWithFacebookAsync(FacebookLoginRequest request);
    Task<AuthResponse> LoginAsGuestAsync(GuestLoginRequest request);
}
