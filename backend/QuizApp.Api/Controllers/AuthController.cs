using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Google.Apis.Auth;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using QuizApp.Api.Dto;
using QuizApp.Api.Models;

namespace QuizApp.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IConfiguration _configuration;
    private readonly IHttpClientFactory _httpClientFactory;

    public AuthController(IConfiguration configuration, IHttpClientFactory httpClientFactory)
    {
        _configuration = configuration;
        _httpClientFactory = httpClientFactory;
    }

    [HttpPost("facebook")]
    public async Task<IActionResult> FacebookLogin([FromBody] FacebookLoginRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.AccessToken))
        {
            return BadRequest(new { message = "access_token is required." });
        }

        var httpClient = _httpClientFactory.CreateClient();
        var url = $"https://graph.facebook.com/me?fields=id,name,email,picture&access_token={Uri.EscapeDataString(request.AccessToken)}";

        using var response = await httpClient.GetAsync(url);
        if (!response.IsSuccessStatusCode)
        {
            return Unauthorized(new { message = "Invalid Facebook token." });
        }

        var facebookProfile = await JsonSerializer.DeserializeAsync<FacebookProfileResponse>(
            await response.Content.ReadAsStreamAsync());

        if (facebookProfile is null || string.IsNullOrWhiteSpace(facebookProfile.Id))
        {
            return Unauthorized(new { message = "Invalid Facebook profile response." });
        }

        var user = new User
        {
            Id = Guid.NewGuid().ToString(),
            Name = facebookProfile.Name,
            Email = facebookProfile.Email,
            ExternalId = facebookProfile.Id,
            AvatarUrl = facebookProfile.Picture?.Data?.Url,
            Provider = AuthProvider.Facebook
        };

        var token = GenerateJwtToken(user);

        return Ok(new
        {
            token,
            userId = user.Id
        });
    }

    [HttpPost("google")]
    public async Task<IActionResult> GoogleLogin([FromBody] GoogleLoginRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.IdToken))
        {
            return BadRequest(new { message = "id_token is required." });
        }

        try
        {
            var googleClientId = _configuration["Google:ClientId"] ?? throw new InvalidOperationException("Missing Google:ClientId configuration value.");
            var validationSettings = new GoogleJsonWebSignature.ValidationSettings
            {
                Audience = new[] { googleClientId }
            };

            var payload = await GoogleJsonWebSignature.ValidateAsync(request.IdToken, validationSettings);

            var user = new User
            {
                Id = Guid.NewGuid().ToString(),
                Name = payload.Name ?? payload.Email ?? "Google user",
                Email = payload.Email,
                ExternalId = payload.Subject,
                AvatarUrl = payload.Picture,
                Provider = AuthProvider.Google
            };

            var token = GenerateJwtToken(user);

            return Ok(new
            {
                token,
                userId = user.Id
            });
        }
        catch (InvalidJwtException)
        {
            return Unauthorized(new { message = "Invalid Google token." });
        }
    }

    [HttpPost("guest")]
    public IActionResult GuestLogin([FromBody] GuestLoginRequest request)
    {
        var user = new User
        {
            Id = Guid.NewGuid().ToString(),
            Name = request.Name,
            Provider = AuthProvider.Guest
        };

        var token = GenerateJwtToken(user);

        return Ok(new
        {
            token,
            userId = user.Id
        });
    }

    private string GenerateJwtToken(User user)
    {
        var jwtKey = _configuration["Jwt:Key"] ?? throw new InvalidOperationException("Missing Jwt:Key configuration value.");
        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);
        var expires = DateTime.UtcNow.AddHours(24);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id),
            new Claim(ClaimTypes.Name, user.Name)
        };

        var token = new JwtSecurityToken(
            claims: claims,
            expires: expires,
            signingCredentials: credentials);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
