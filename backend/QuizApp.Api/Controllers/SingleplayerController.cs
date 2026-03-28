using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using QuizApp.Api.Dto.Singleplayer;
using QuizApp.Api.Services.Abstractions;

namespace QuizApp.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public sealed class SingleplayerController : ControllerBase
{
    private readonly ISingleplayerService _singleplayerService;

    public SingleplayerController(ISingleplayerService singleplayerService)
    {
        _singleplayerService = singleplayerService;
    }

    [HttpGet("categories")]
    public async Task<ActionResult<IEnumerable<CategoryDto>>> GetCategories()
    {
        return Ok(await _singleplayerService.GetCategoriesAsync());
    }

    [HttpGet("categories/{categoryId}/levels")]
    public async Task<ActionResult<IEnumerable<LevelDto>>> GetLevelsByCategory(int categoryId)
    {
        if (!TryGetUserId(out var userId))
        {
            return Unauthorized();
        }

        return Ok(await _singleplayerService.GetLevelsByCategoryAsync(categoryId, userId));
    }

    [HttpGet("levels/{levelId}/questions")]
    public async Task<ActionResult<SingleplayerGameDto>> GetQuestionsForLevel(int levelId)
    {
        if (!TryGetUserId(out var userId))
        {
            return Unauthorized();
        }

        return Ok(await _singleplayerService.GetQuestionsForLevelAsync(levelId, userId));
    }

    [HttpPost("levels/{levelId}/submit")]
    public async Task<ActionResult<SingleplayerResultSummaryDto>> SubmitGame(
        int levelId,
        [FromBody] SingleplayerSubmitRequestDto request)
    {
        if (request is null)
        {
            return BadRequest(new { message = "request body is required." });
        }

        if (!TryGetUserId(out var userId))
        {
            return Unauthorized();
        }

        var result = await _singleplayerService.SubmitGameAsync(userId, levelId, request);

        return Ok(result);
    }

    private bool TryGetUserId(out Guid userId)
    {
        var userIdValue = User.Claims.FirstOrDefault(claim => claim.Type == ClaimTypes.NameIdentifier)?.Value
            ?? User.Claims.FirstOrDefault(claim => claim.Type == JwtRegisteredClaimNames.Sub)?.Value;

        if (Guid.TryParse(userIdValue, out userId))
        {
            return true;
        }

        userId = Guid.Empty;
        return false;
    }
}
