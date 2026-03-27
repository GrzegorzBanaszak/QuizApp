using AutoMapper;
using Google.Apis.Auth;
using Microsoft.EntityFrameworkCore;
using QuizApp.Api.Data;
using QuizApp.Api.Dto;
using QuizApp.Api.Models;
using System.Text.Json;

namespace QuizApp.Api.Services;

public sealed class AuthService : IAuthService
{
    private readonly IConfiguration _configuration;
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly IMapper _mapper;
    private readonly AppDbContext _dbContext;
    private readonly IJwtTokenService _jwtTokenService;

    public AuthService(
        IConfiguration configuration,
        IHttpClientFactory httpClientFactory,
        IMapper mapper,
        AppDbContext dbContext,
        IJwtTokenService jwtTokenService)
    {
        _configuration = configuration;
        _httpClientFactory = httpClientFactory;
        _mapper = mapper;
        _dbContext = dbContext;
        _jwtTokenService = jwtTokenService;
    }

    public Task<SocialProfileResponse> VerifyGoogleAsync(string token)
    {
        return ValidateGoogleTokenAsync(token);
    }

    public Task<SocialProfileResponse> VerifyFacebookAsync(string token)
    {
        return ValidateFacebookTokenAsync(token);
    }

    public async Task<AuthResponse> LoginWithGoogleAsync(GoogleLoginRequest request)
    {
        var socialProfile = await ValidateGoogleTokenAsync(request.ProviderToken);
        var username = ResolveUsername(request.CustomUsername, socialProfile.Name);
        var avatarUrl = ResolveAvatarUrl(request.CustomAvatarUrl, socialProfile.AvatarUrl);

        var user = await _dbContext.Users.SingleOrDefaultAsync(u => u.GoogleId == socialProfile.GoogleId);
        await EnsureUsernameAvailableAsync(username, user?.Id);

        if (user is null)
        {
            user = new User
            {
                Username = username,
                AvatarUrl = avatarUrl,
                Role = "User",
                GoogleId = socialProfile.GoogleId,
                LastLoginAt = DateTime.UtcNow
            };

            _dbContext.Users.Add(user);
        }
        else
        {
            user.Username = username;
            user.AvatarUrl = avatarUrl;
            user.LastLoginAt = DateTime.UtcNow;
        }

        await _dbContext.SaveChangesAsync();

        return CreateAuthResponse(user);
    }

    public async Task<AuthResponse> LoginWithFacebookAsync(FacebookLoginRequest request)
    {
        var socialProfile = await ValidateFacebookTokenAsync(request.ProviderToken);
        var username = ResolveUsername(request.CustomUsername, socialProfile.Name);
        var avatarUrl = ResolveAvatarUrl(request.CustomAvatarUrl, socialProfile.AvatarUrl);

        var user = await _dbContext.Users.SingleOrDefaultAsync(u => u.FacebookId == socialProfile.FacebookId);
        await EnsureUsernameAvailableAsync(username, user?.Id);

        if (user is null)
        {
            user = new User
            {
                Username = username,
                AvatarUrl = avatarUrl,
                Role = "User",
                FacebookId = socialProfile.FacebookId,
                LastLoginAt = DateTime.UtcNow
            };

            _dbContext.Users.Add(user);
        }
        else
        {
            user.Username = username;
            user.AvatarUrl = avatarUrl;
            user.LastLoginAt = DateTime.UtcNow;
        }

        await _dbContext.SaveChangesAsync();

        return CreateAuthResponse(user);
    }

    public async Task<AuthResponse> LoginAsGuestAsync(GuestLoginRequest request)
    {
        var username = ResolveGuestUsername(request.CustomUsername);
        await EnsureUsernameAvailableAsync(username);

        var user = new User
        {
            Username = username,
            AvatarUrl = ResolveAvatarUrl(request.CustomAvatarUrl, string.Empty),
            Role = "Guest",
            LastLoginAt = DateTime.UtcNow
        };

        _dbContext.Users.Add(user);
        await _dbContext.SaveChangesAsync();

        return CreateAuthResponse(user);
    }

    private async Task<SocialProfileResponse> ValidateGoogleTokenAsync(string token)
    {
        var googleClientId = _configuration["Google:ClientId"]
            ?? throw new InvalidOperationException("Missing Google:ClientId configuration value.");

        var validationSettings = new GoogleJsonWebSignature.ValidationSettings
        {
            Audience = new[] { googleClientId }
        };

        var payload = await GoogleJsonWebSignature.ValidateAsync(token, validationSettings);

        return new SocialProfileResponse
        {
            GoogleId = payload.Subject,
            Name = payload.Name ?? payload.Email ?? "Google user",
            FirstName = payload.GivenName,
            LastName = payload.FamilyName,
            AvatarUrl = payload.Picture ?? string.Empty
        };
    }

    private async Task<SocialProfileResponse> ValidateFacebookTokenAsync(string token)
    {
        var httpClient = _httpClientFactory.CreateClient();
        var url =
            $"https://graph.facebook.com/me?fields=id,name,first_name,last_name,picture.type(large)&access_token={Uri.EscapeDataString(token)}";

        using var response = await httpClient.GetAsync(url);
        if (!response.IsSuccessStatusCode)
        {
            throw new UnauthorizedAccessException("Invalid Facebook token.");
        }

        var facebookProfile = await JsonSerializer.DeserializeAsync<FacebookProfileResponse>(
            await response.Content.ReadAsStreamAsync());

        if (facebookProfile is null || string.IsNullOrWhiteSpace(facebookProfile.Id))
        {
            throw new UnauthorizedAccessException("Invalid Facebook profile response.");
        }

        return new SocialProfileResponse
        {
            FacebookId = facebookProfile.Id,
            Name = string.IsNullOrWhiteSpace(facebookProfile.Name) ? "Facebook user" : facebookProfile.Name,
            FirstName = facebookProfile.FirstName,
            LastName = facebookProfile.LastName,
            AvatarUrl = facebookProfile.Picture?.Data?.Url ?? string.Empty
        };
    }

    private async Task EnsureUsernameAvailableAsync(string username, Guid? excludeUserId = null)
    {
        var isAvailable = await _dbContext.Users.AllAsync(u => u.Username != username || u.Id == excludeUserId);
        if (!isAvailable)
        {
            throw new UsernameTakenException();
        }
    }

    private AuthResponse CreateAuthResponse(User user)
    {
        return new AuthResponse
        {
            Token = _jwtTokenService.GenerateToken(user),
            UserId = user.Id,
            Profile = _mapper.Map<UserProfileDto>(user)
        };
    }

    private static string ResolveUsername(string? customUsername, string fallbackName)
    {
        var username = string.IsNullOrWhiteSpace(customUsername)
            ? fallbackName.Trim()
            : customUsername.Trim();

        return string.IsNullOrWhiteSpace(username) ? "User" : username;
    }

    private static string ResolveGuestUsername(string? customUsername)
    {
        return string.IsNullOrWhiteSpace(customUsername)
            ? $"Guest-{Guid.NewGuid():N}"[..14]
            : customUsername.Trim();
    }

    private static string ResolveAvatarUrl(string? customAvatarUrl, string fallbackAvatarUrl)
    {
        return string.IsNullOrWhiteSpace(customAvatarUrl)
            ? fallbackAvatarUrl
            : customAvatarUrl.Trim();
    }
}
