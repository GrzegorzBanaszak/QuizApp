using Google.Apis.Auth;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using QuizApp.Api.Data;
using QuizApp.Api.Dto;
using QuizApp.Api.Models;
using QuizApp.Api.Services.Abstractions;
using System.IdentityModel.Tokens.Jwt;
using System.Net.Http.Json;
using System.Security.Claims;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace QuizApp.Api.Services.Implementations;

public sealed class AuthService : IAuthService
{
    private readonly IConfiguration _configuration;
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly AppDbContext _dbContext;
    private readonly IJwtTokenService _jwtTokenService;
    private readonly IAvatarService _avatarService;
    private readonly IProgressionService _progressionService;

    public AuthService(
        IConfiguration configuration,
        IHttpClientFactory httpClientFactory,
        AppDbContext dbContext,
        IJwtTokenService jwtTokenService,
        IAvatarService avatarService,
        IProgressionService progressionService)
    {
        _configuration = configuration;
        _httpClientFactory = httpClientFactory;
        _dbContext = dbContext;
        _jwtTokenService = jwtTokenService;
        _avatarService = avatarService;
        _progressionService = progressionService;
    }

    public async Task<ISocialAuthResult> VerifyGoogleAsync(string token)
    {
        var socialProfile = await ValidateGoogleIdentityAsync(token);
        return await VerifyExistingUserAsync(
            socialProfile,
            user => user.GoogleId == socialProfile.GoogleId);
    }

    public async Task<ISocialAuthResult> VerifyGoogleCodeAsync(string code, string redirectUri)
    {
        if (string.IsNullOrWhiteSpace(code))
        {
            throw new ArgumentException("Google authorization code is required.", nameof(code));
        }

        if (string.IsNullOrWhiteSpace(redirectUri))
        {
            throw new ArgumentException("Google redirect URI is required.", nameof(redirectUri));
        }

        var idToken = await ExchangeGoogleCodeForIdTokenAsync(code, redirectUri);
        var socialProfile = await ValidateGoogleIdentityAsync(idToken);
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

    private async Task<SocialProfileResponse> ValidateGoogleIdentityAsync(string token)
    {
        try
        {
            return await ValidateGoogleTokenAsync(token);
        }
        catch (InvalidJwtException)
        {
            try
            {
                return ValidateGooglePendingToken(token);
            }
            catch (SecurityTokenException ex)
            {
                throw new UnauthorizedAccessException("Invalid Google token.", ex);
            }
        }
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

    private SocialProfileResponse ValidateGooglePendingToken(string token)
    {
        var jwtKey = _configuration["Jwt:Key"]
            ?? throw new InvalidOperationException("Missing Jwt:Key configuration value.");

        var handler = new JwtSecurityTokenHandler();
        var validationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
            ValidateIssuer = true,
            ValidIssuer = GooglePendingTokenIssuer,
            ValidateAudience = true,
            ValidAudience = GooglePendingTokenAudience,
            ValidateLifetime = true,
            ClockSkew = TimeSpan.Zero
        };

        var principal = handler.ValidateToken(token, validationParameters, out _);
        var googleId = principal.FindFirstValue("google_id");

        if (string.IsNullOrWhiteSpace(googleId))
        {
            throw new UnauthorizedAccessException("Invalid Google token.");
        }

        return new SocialProfileResponse
        {
            IsNewUser = true,
            GoogleId = googleId,
            ProviderToken = token,
            Name = principal.FindFirstValue(ClaimTypes.Name) ?? "Google user",
            FirstName = principal.FindFirstValue("given_name"),
            LastName = principal.FindFirstValue("family_name"),
            AvatarUrl = principal.FindFirstValue("avatar_url") ?? string.Empty
        };
    }

    private async Task<string> ExchangeGoogleCodeForIdTokenAsync(string code, string redirectUri)
    {
        var googleClientId = _configuration["Google:ClientId"]
            ?? throw new InvalidOperationException("Missing Google:ClientId configuration value.");
        var googleClientSecret = _configuration["Google:ClientSecret"]
            ?? throw new InvalidOperationException("Missing Google:ClientSecret configuration value.");

        var httpClient = _httpClientFactory.CreateClient();
        using var response = await httpClient.PostAsync(
            "https://oauth2.googleapis.com/token",
            new FormUrlEncodedContent(new Dictionary<string, string>
            {
                ["code"] = code,
                ["client_id"] = googleClientId,
                ["client_secret"] = googleClientSecret,
                ["redirect_uri"] = redirectUri,
                ["grant_type"] = "authorization_code"
            }));

        if (!response.IsSuccessStatusCode)
        {
            throw new UnauthorizedAccessException("Invalid Google authorization code.");
        }

        var payload = await response.Content.ReadFromJsonAsync<GoogleOAuthTokenResponse>();

        if (payload is null || string.IsNullOrWhiteSpace(payload.IdToken))
        {
            throw new UnauthorizedAccessException("Google did not return an id token.");
        }

        return payload.IdToken;
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
            if (!string.IsNullOrWhiteSpace(socialProfile.GoogleId) && string.IsNullOrWhiteSpace(socialProfile.ProviderToken))
            {
                return new SocialProfileResponse
                {
                    IsNewUser = socialProfile.IsNewUser,
                    GoogleId = socialProfile.GoogleId,
                    FacebookId = socialProfile.FacebookId,
                    ProviderToken = IssueGooglePendingToken(socialProfile),
                    Name = socialProfile.Name,
                    FirstName = socialProfile.FirstName,
                    LastName = socialProfile.LastName,
                    AvatarUrl = socialProfile.AvatarUrl
                };
            }

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
            AuthProvider.Google => (provider, await ValidateGoogleIdentityAsync(providerToken)),
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
            Profile = UserProfileMapper.ToDto(user, _progressionService)
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

    private string IssueGooglePendingToken(SocialProfileResponse profile)
    {
        var jwtKey = _configuration["Jwt:Key"]
            ?? throw new InvalidOperationException("Missing Jwt:Key configuration value.");
        var tokenLifetimeMinutes = _configuration.GetValue<double?>("Google:PendingTokenLifetimeMinutes") ?? 60;
        var expires = DateTime.UtcNow.AddMinutes(tokenLifetimeMinutes);
        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        var claims = new List<Claim>
        {
            new("google_id", profile.GoogleId ?? string.Empty),
            new(ClaimTypes.Name, profile.Name),
            new("given_name", profile.FirstName ?? string.Empty),
            new("family_name", profile.LastName ?? string.Empty),
            new("avatar_url", profile.AvatarUrl)
        };

        var token = new JwtSecurityToken(
            issuer: GooglePendingTokenIssuer,
            audience: GooglePendingTokenAudience,
            claims: claims,
            expires: expires,
            signingCredentials: credentials);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    private const string GooglePendingTokenIssuer = "QuizApp.GooglePending";
    private const string GooglePendingTokenAudience = "QuizApp.GooglePending";

    private sealed record GoogleOAuthTokenResponse(
        [property: JsonPropertyName("id_token")] string? IdToken,
        [property: JsonPropertyName("access_token")] string? AccessToken,
        [property: JsonPropertyName("expires_in")] int? ExpiresIn,
        [property: JsonPropertyName("scope")] string? Scope,
        [property: JsonPropertyName("token_type")] string? TokenType,
        [property: JsonPropertyName("refresh_token")] string? RefreshToken);

}
