using BoneX.Api.Contracts.Users;
using BoneX.Api.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;

namespace BoneX.Api.Controllers;

[Route("me")]
[ApiController]
//[Authorize]
public class AccountController(IUserService userService, UserManager<ApplicationUser> userManager) : ControllerBase
{
    private readonly IUserService _userService = userService;
    private readonly UserManager<ApplicationUser> _userManager = userManager;

    [HttpGet("")]
    public async Task<IActionResult> Info()
    {
        var result = await _userService.GetProfileAsync(User.GetUserId()!);

        return Ok(result.Value);
    }

    [HttpPut("info")]
    public async Task<IActionResult> Info([FromBody] UpdateProfileRequest request)
    {
        await _userService.UpdateProfileAsync(User.GetUserId()!, request);

        return NoContent();
    }

    [HttpPut("change-password")]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest request)
    {
        var result = await _userService.ChangePasswordAsync(User.GetUserId()!, request);

        return result.IsSuccess ? NoContent() : result.ToProblem();
    }

    [HttpPost("profile-picture")]
    public async Task<IActionResult> UploadProfilePicture([FromForm] UploadProfilePictureRequest request)
    {
        var userId = User.GetUserId();
        if (string.IsNullOrEmpty(userId))
            return Unauthorized();

        var result = await _userService.UploadProfilePictureAsync(userId, request.ProfilePicture);

        if (result.IsFailure)
            return BadRequest(result.Error);

        return Ok(new { ProfilePictureUrl = result.Value });
    }

    //[Authorize]
    [HttpGet("profile-picture/{userId}")]
    public IActionResult GetProfilePicture(string userId)
    {
        var user = _userManager.Users.FirstOrDefault(u => u.Id == userId);
        if (user == null || string.IsNullOrWhiteSpace(user.ProfilePicture))
            return NotFound("User or profile picture not found");

        // Clean and normalize the path
        var relativePath = user.ProfilePicture
            .TrimStart('/')
            .Replace('/', Path.DirectorySeparatorChar)
            .Replace('\\', Path.DirectorySeparatorChar);

        // Build absolute file path
        var fullPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", relativePath);

        // Debug: check if path is correct
        Console.WriteLine("Looking for file at: " + fullPath);

        if (!System.IO.File.Exists(fullPath))
            return NotFound("File not found on disk");

        var fileBytes = System.IO.File.ReadAllBytes(fullPath);
        var fileName = Path.GetFileName(user.ProfilePicture);

        // Optionally detect content type
        var contentType = "application/octet-stream"; // or "image/png"

        return File(fileBytes, contentType, fileName); // triggers download
    }



}
