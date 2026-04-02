using AutoMapper;
using Google.Apis.Auth;
using Microsoft.EntityFrameworkCore;
using QuizApp.Api.Data;
using QuizApp.Api.Dto;
using QuizApp.Api.Models;
using QuizApp.Api.Services.Abstractions;
using System.Text.Json;

namespace QuizApp.Api.Services.Implementations;

public sealed class AuthService : IAuthService
{
    private readonly IConfiguration _configuration;
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly IMapper _mapper;
    private readonly AppDbContext _dbContext;
    private readonly IJwtTokenService _jwtTokenService;
    private readonly IAvatarService _avatarService;

    public AuthService(
        IConfiguration configuration,
        IHttpClientFactory httpClientFactory,
        IMapper mapper,
        AppDbContext dbContext,
        IJwtTokenService jwtTokenService,
        IAvatarService avatarService)
    {
        _configuration = configuration;
        _httpClientFactory = httpClientFactory;
        _mapper = mapper;
        _dbContext = dbContext;
        _jwtTokenService = jwtTokenService;
        _avatarService = avatarService;
    }

    public async Task<ISocialAuthResult> VerifyGoogleAsync(string token)
    {
        var socialProfile = await ValidateGoogleTokenAsync(token);
        return await VerifyExistingUserAsync(
            socialProfile,
            user => user.GoogleId == socialProfile.GoogleId);
    }

    public async Task<ISocialAuthResult> VerifyFacebookAsync(string token)
    {
        var socialProfile = await ValidateFacebookTokenAsync(token);
        return await VerifyExistingUserAsync(
            socialProfile,
            user => user.FacebookId == socialProfile.FacebookId);
    }

    public async Task<AuthResponse> RegisterSocialAsync(RegisterSocialRequest request)
    {
        var (provider, socialProfile) = await ValidateSocialTokenAsync(request.Provider, request.ProviderToken);
        var username = ResolveUsername(request.CustomUsername, socialProfile.Name);
        var now = DateTime.UtcNow;
        var selectedAvatar = await _avatarService.ResolveDefaultAvatarAsync(request.SelectedAvatarId)
            ?? throw new InvalidOperationException("Selected avatar must be one of the default avatars.");

        var user = await FindUserByProviderIdAsync(provider, socialProfile);

        if (user is null)
        {
            user = new User
            {
                Username = username,
                AvatarUrl = selectedAvatar.ImageUrl,
                CurrentAvatarId = selectedAvatar.Id,
                Role = "User",
                GoogleId = provider == AuthProvider.Google ? socialProfile.GoogleId : null,
                FacebookId = provider == AuthProvider.Facebook ? socialProfile.FacebookId : null,
                LastLoginAt = now
            };

            await EnsureUsernameAvailableAsync(username);
            _dbContext.Users.Add(user);
        }
        else
        {
            user.LastLoginAt = now;
        }

        await _dbContext.SaveChangesAsync();

        return CreateAuthResponse(user, isNewUser: false);
    }

    public async Task<AuthResponse> LoginAsGuestAsync(GuestLoginRequest request)
    {
        var username = ResolveGuestUsername(request.CustomUsername);
        await EnsureUsernameAvailableAsync(username);
        var defaultAvatar = await _avatarService.GetDefaultAvatarAsync()
            ?? throw new InvalidOperationException("No default avatar is configured.");

        var user = new User
        {
            Username = username,
            AvatarUrl = defaultAvatar.ImageUrl,
            CurrentAvatarId = defaultAvatar.Id,
            Role = "Guest",
            LastLoginAt = DateTime.UtcNow
        };

        _dbContext.Users.Add(user);
        await _dbContext.SaveChangesAsync();

        return CreateAuthResponse(user, isNewUser: false);
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
            IsNewUser = true,
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
            IsNewUser = true,
            FacebookId = facebookProfile.Id,
            Name = string.IsNullOrWhiteSpace(facebookProfile.Name) ? "Facebook user" : facebookProfile.Name,
            FirstName = facebookProfile.FirstName,
            LastName = facebookProfile.LastName,
            AvatarUrl = facebookProfile.Picture?.Data?.Url ?? string.Empty
        };
    }

    private async Task<ISocialAuthResult> VerifyExistingUserAsync(
        SocialProfileResponse socialProfile,
        System.Linq.Expressions.Expression<Func<User, bool>> predicate)
    {
        var user = await _dbContext.Users.SingleOrDefaultAsync(predicate);
        if (user is null)
        {
            return socialProfile;
        }

        user.LastLoginAt = DateTime.UtcNow;
        await _dbContext.SaveChangesAsync();

        return CreateAuthResponse(user, isNewUser: false);
    }

    private async Task<(AuthProvider Provider, SocialProfileResponse Profile)> ValidateSocialTokenAsync(AuthProvider provider, string providerToken)
    {
        return provider switch
        {
            AuthProvider.Google => (provider, await ValidateGoogleTokenAsync(providerToken)),
            AuthProvider.Facebook => (provider, await ValidateFacebookTokenAsync(providerToken)),
            _ => throw new ArgumentOutOfRangeException(nameof(provider), "Unsupported provider.")
        };
    }

    private async Task<User?> FindUserByProviderIdAsync(AuthProvider provider, SocialProfileResponse socialProfile)
    {
        return provider switch
        {
            AuthProvider.Google => await _dbContext.Users.SingleOrDefaultAsync(u => u.GoogleId == socialProfile.GoogleId),
            AuthProvider.Facebook => await _dbContext.Users.SingleOrDefaultAsync(u => u.FacebookId == socialProfile.FacebookId),
            _ => throw new ArgumentOutOfRangeException(nameof(provider), "Unsupported provider.")
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

    private AuthResponse CreateAuthResponse(User user, bool isNewUser)
    {
        var jwtToken = _jwtTokenService.GenerateToken(user);

        return new AuthResponse
        {
            IsNewUser = isNewUser,
            Token = jwtToken.Token,
            ExpiresAtUtc = jwtToken.ExpiresAtUtc,
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

}
