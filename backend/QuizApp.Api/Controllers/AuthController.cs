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

    public AuthController(IAuthService authService)
    {
        _authService = authService;
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
            return Ok(await _authService.VerifyGoogleAsync(request.Token));
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
            return Ok(await _authService.VerifyFacebookAsync(request.Token));
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
            return Ok(await _authService.RegisterSocialAsync(request));
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
            return Ok(await _authService.LoginAsGuestAsync(request));
        }
        catch (UsernameTakenException ex)
        {
            return Conflict(new { message = ex.Message });
        }
    }
}
