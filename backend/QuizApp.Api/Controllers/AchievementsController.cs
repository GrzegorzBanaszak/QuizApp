using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using QuizApp.Api.Dto;
using QuizApp.Api.Services.Abstractions;

namespace QuizApp.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public sealed class AchievementsController : ControllerBase
{
    private readonly IAchievementService _achievementService;
    private readonly IUserService _userService;

    public AchievementsController(IAchievementService achievementService, IUserService userService)
    {
        _achievementService = achievementService;
        _userService = userService;
    }

    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<AchievementDto>>> GetAchievements(CancellationToken cancellationToken)
    {
        var userId = await _userService.GetCurrentUserIdAsync(User, cancellationToken);
        if (userId is null)
        {
            return NotFound();
        }

        return Ok(await _achievementService.GetCatalogAsync(userId.Value, cancellationToken));
    }
}
