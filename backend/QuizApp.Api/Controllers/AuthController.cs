using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using AutoMapper;
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
    private readonly IMapper _mapper;

    public AuthController(IConfiguration configuration, IHttpClientFactory httpClientFactory, IMapper mapper)
    {
        _configuration = configuration;
        _httpClientFactory = httpClientFactory;
        _mapper = mapper;
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
            Username = facebookProfile.Name ?? "Facebook user",
            AvatarUrl = facebookProfile.Picture?.Data?.Url ?? string.Empty,
            Role = "User",
            FacebookId = facebookProfile.Id,
            LastLoginAt = DateTime.UtcNow
        };

        var token = GenerateJwtToken(user);

        return Ok(new
        {
            token,
            userId = user.Id,
            profile = _mapper.Map<UserProfileDto>(user)
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
                Username = payload.Name ?? payload.Email ?? "Google user",
                AvatarUrl = payload.Picture ?? string.Empty,
                Role = "User",
                GoogleId = payload.Subject,
                LastLoginAt = DateTime.UtcNow
            };

            var token = GenerateJwtToken(user);

            return Ok(new
            {
                token,
                userId = user.Id,
                profile = _mapper.Map<UserProfileDto>(user)
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
            Username = string.IsNullOrWhiteSpace(request.Name) ? "Guest" : request.Name,
            AvatarUrl = string.Empty,
            Role = "Guest",
            LastLoginAt = DateTime.UtcNow
        };

        var token = GenerateJwtToken(user);

        return Ok(new
        {
            token,
            userId = user.Id,
            profile = _mapper.Map<UserProfileDto>(user)
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
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Name, user.Username),
            new Claim(ClaimTypes.Role, user.Role)
        };

        var token = new JwtSecurityToken(
            claims: claims,
            expires: expires,
            signingCredentials: credentials);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
