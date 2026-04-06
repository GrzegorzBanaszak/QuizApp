using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using QuizApp.Api.Dto;
using QuizApp.Api.Models;
using QuizApp.Api.Services.Abstractions;

namespace QuizApp.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public sealed class AvatarController : ControllerBase
{
    private readonly IAvatarService _avatarService;
    private readonly IUserService _userService;

    public AvatarController(IAvatarService avatarService, IUserService userService)
    {
        _avatarService = avatarService;
        _userService = userService;
    }

    [AllowAnonymous]
    [HttpGet("defaults")]
    public async Task<ActionResult<IReadOnlyList<AvatarDto>>> GetDefaultAvatars(CancellationToken cancellationToken = default)
    {
        return Ok(await _avatarService.GetCreateCatalogAsync(cancellationToken));
    }

    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<AvatarDto>>> GetAvatars(
        [FromQuery] AvatarCatalogView view = AvatarCatalogView.Catalog,
        CancellationToken cancellationToken = default)
    {
        var userId = await _userService.GetCurrentUserIdAsync(User, cancellationToken);
        if (userId is null)
        {
            return NotFound();
        }

        return Ok(await _avatarService.GetCatalogAsync(userId.Value, view, cancellationToken));
    }

    [HttpPost("select")]
    public async Task<ActionResult<UserProfileDto>> SelectAvatar([FromBody] AvatarSelectionRequest request, CancellationToken cancellationToken)
    {
        var userId = await _userService.GetCurrentUserIdAsync(User, cancellationToken);
        if (userId is null)
        {
            return NotFound();
        }

        try
        {
            var profile = await _avatarService.SelectAvatarAsync(userId.Value, request.AvatarId, cancellationToken);
            return profile is null ? NotFound() : Ok(profile);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost("{avatarId:int}/purchase")]
    public async Task<ActionResult<UserProfileDto>> PurchaseAvatar(int avatarId, CancellationToken cancellationToken)
    {
        var userId = await _userService.GetCurrentUserIdAsync(User, cancellationToken);
        if (userId is null)
        {
            return NotFound();
        }

        try
        {
            var profile = await _avatarService.PurchaseAvatarAsync(userId.Value, avatarId, cancellationToken);
            return profile is null ? NotFound() : Ok(profile);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

}
