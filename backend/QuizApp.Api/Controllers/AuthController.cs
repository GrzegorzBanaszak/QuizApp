using Google.Apis.Auth;
using Microsoft.AspNetCore.Mvc;
using QuizApp.Api.Dto;
using QuizApp.Api.Services;

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
            var profile = await _authService.VerifyGoogleAsync(request.Token);
            return Ok(profile);
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
            var profile = await _authService.VerifyFacebookAsync(request.Token);
            return Ok(profile);
        }
        catch (UnauthorizedAccessException)
        {
            return Unauthorized(new { message = "Invalid Facebook token." });
        }
    }

    [HttpPost("google")]
    public async Task<IActionResult> GoogleLogin([FromBody] GoogleLoginRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.ProviderToken))
        {
            return BadRequest(new { message = "providerToken is required." });
        }

        try
        {
            return Ok(await _authService.LoginWithGoogleAsync(request));
        }
        catch (InvalidJwtException)
        {
            return Unauthorized(new { message = "Invalid Google token." });
        }
        catch (UsernameTakenException ex)
        {
            return Conflict(new { message = ex.Message });
        }
    }

    [HttpPost("facebook")]
    public async Task<IActionResult> FacebookLogin([FromBody] FacebookLoginRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.ProviderToken))
        {
            return BadRequest(new { message = "providerToken is required." });
        }

        try
        {
            return Ok(await _authService.LoginWithFacebookAsync(request));
        }
        catch (UnauthorizedAccessException)
        {
            return Unauthorized(new { message = "Invalid Facebook token." });
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
