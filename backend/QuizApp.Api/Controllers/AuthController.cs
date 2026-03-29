using Google.Apis.Auth;
using Microsoft.AspNetCore.Mvc;
using QuizApp.Api.Dto;
using QuizApp.Api.Services.Abstractions;

namespace QuizApp.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly IConfiguration _configuration;

    public AuthController(IAuthService authService, IConfiguration configuration)
    {
        _authService = authService;
        _configuration = configuration;
    }

    [HttpPost("verify-google")]
    public async Task<IActionResult> VerifyGoogle([FromBody] GoogleTokenRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Token))
        {
            return BadRequest(new { message = "token is required." });
        }

        try
        {
            var result = await _authService.VerifyGoogleAsync(request.Token);
            AppendAuthCookieIfPresent(result);
            return Ok(result);
        }
        catch (InvalidJwtException)
        {
            return Unauthorized(new { message = "Invalid Google token." });
        }
    }

    [HttpPost("verify-facebook")]
    public async Task<IActionResult> VerifyFacebook([FromBody] FacebookTokenRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Token))
        {
            return BadRequest(new { message = "token is required." });
        }

        try
        {
            var result = await _authService.VerifyFacebookAsync(request.Token);
            AppendAuthCookieIfPresent(result);
            return Ok(result);
        }
        catch (UnauthorizedAccessException)
        {
            return Unauthorized(new { message = "Invalid Facebook token." });
        }
    }

    [HttpPost("register-social")]
    public async Task<IActionResult> RegisterSocial([FromBody] RegisterSocialRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.ProviderToken))
        {
            return BadRequest(new { message = "providerToken is required." });
        }

        if (request.Provider is not QuizApp.Api.Models.AuthProvider.Google and not QuizApp.Api.Models.AuthProvider.Facebook)
        {
            return BadRequest(new { message = "provider must be Google or Facebook." });
        }

        try
        {
            var response = await _authService.RegisterSocialAsync(request);
            AppendAuthCookie(response);
            return Ok(response);
        }
        catch (InvalidJwtException)
        {
            return Unauthorized(new { message = "Invalid Google token." });
        }
        catch (UnauthorizedAccessException)
        {
            return Unauthorized(new { message = "Invalid Facebook token." });
        }
        catch (ArgumentOutOfRangeException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (UsernameTakenException ex)
        {
            return Conflict(new { message = ex.Message });
        }
    }

    [HttpPost("guest")]
    public async Task<IActionResult> GuestLogin([FromBody] GuestLoginRequest request)
    {
        try
        {
            var response = await _authService.LoginAsGuestAsync(request);
            AppendAuthCookie(response);
            return Ok(response);
        }
        catch (UsernameTakenException ex)
        {
            return Conflict(new { message = ex.Message });
        }
    }

    [HttpPost("logout")]
    public IActionResult Logout()
    {
        Response.Cookies.Delete(GetCookieName(), new CookieOptions
        {
            Path = "/",
            Secure = IsSecureCookieEnabled(),
            SameSite = GetSameSiteMode(),
            HttpOnly = true
        });

        return NoContent();
    }

    private void AppendAuthCookieIfPresent(ISocialAuthResult result)
    {
        if (result is AuthResponse authResponse)
        {
            AppendAuthCookie(authResponse);
        }
    }

    private void AppendAuthCookie(AuthResponse response)
    {
        Response.Cookies.Append(
            GetCookieName(),
            response.Token,
            new CookieOptions
            {
                HttpOnly = true,
                Secure = IsSecureCookieEnabled(),
                SameSite = GetSameSiteMode(),
                Expires = new DateTimeOffset(response.ExpiresAtUtc),
                Path = "/"
            });
    }

    private string GetCookieName()
    {
        return _configuration["Jwt:CookieName"] ?? "quizapp_auth";
    }

    private SameSiteMode GetSameSiteMode()
    {
        var configuredMode = _configuration["Jwt:CookieSameSite"];

        return configuredMode?.ToLowerInvariant() switch
        {
            "none" => SameSiteMode.None,
            "strict" => SameSiteMode.Strict,
            _ => SameSiteMode.Lax
        };
    }

    private bool IsSecureCookieEnabled()
    {
        return _configuration.GetValue<bool?>("Jwt:CookieSecure") ?? true;
    }
}
