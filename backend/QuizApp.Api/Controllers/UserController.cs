using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuizApp.Api.Data;
using QuizApp.Api.Dto;
using QuizApp.Api.Models;

namespace QuizApp.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public sealed class UserController : ControllerBase
{
    private readonly AppDbContext _dbContext;

    public UserController(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [HttpGet("me")]
    public async Task<ActionResult<UserProfileDto>> Me()
    {
        var user = await GetCurrentUserAsync();
        if (user is null)
        {
            return NotFound();
        }

        return Ok(ToProfileDto(user));
    }

    [HttpPut("me")]
    public async Task<ActionResult<UserProfileDto>> UpdateMe([FromBody] UpdateUserProfileRequest request)
    {
        if (request is null)
        {
            return BadRequest(new { message = "Request body is required." });
        }

        var username = request.Username?.Trim() ?? string.Empty;
        var avatarUrl = request.AvatarUrl?.Trim() ?? string.Empty;

        if (string.IsNullOrWhiteSpace(username))
        {
            return BadRequest(new { message = "Username is required." });
        }

        if (string.IsNullOrWhiteSpace(avatarUrl))
        {
            return BadRequest(new { message = "AvatarUrl is required." });
        }

        var user = await GetCurrentUserAsync();
        if (user is null)
        {
            return NotFound();
        }

        if (!string.Equals(user.Username, username, StringComparison.Ordinal))
        {
            var isUsernameTaken = await _dbContext.Users.AnyAsync(u => u.Username == username && u.Id != user.Id);
            if (isUsernameTaken)
            {
                return Conflict(new { message = "Username is already taken." });
            }
        }

        user.Username = username;
        user.AvatarUrl = avatarUrl;

        await _dbContext.SaveChangesAsync();

        return Ok(ToProfileDto(user));
    }

    private async Task<User?> GetCurrentUserAsync()
    {
        var userIdValue =
            User.FindFirstValue(ClaimTypes.NameIdentifier) ??
            User.FindFirstValue(JwtRegisteredClaimNames.Sub);

        if (!Guid.TryParse(userIdValue, out var userId))
        {
            return null;
        }

        return await _dbContext.Users.SingleOrDefaultAsync(u => u.Id == userId);
    }

    private static UserProfileDto ToProfileDto(User user)
    {
        return new UserProfileDto
        {
            Id = user.Id,
            Username = user.Username,
            AvatarUrl = user.AvatarUrl,
            TotalExperience = user.TotalExperience,
            Coins = user.Coins
        };
    }
}
