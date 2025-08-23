using BoneX.Api.Contracts.Users;
using BoneX.Api.Errors;
using BoneX.Api.Extensions;
using Microsoft.Extensions.Hosting;

namespace BoneX.Api.Services;

public class UserService(
    UserManager<ApplicationUser> userManager,
    IWebHostEnvironment hostEnvironment,
    ILogger<UserService> logger) : IUserService
{
    private readonly UserManager<ApplicationUser> _userManager = userManager;
    private readonly IWebHostEnvironment _hostEnvironment = hostEnvironment;
    private readonly ILogger<UserService> _logger = logger;

    public async Task<Result<UserProfileResponse>> GetProfileAsync(string userId)
    {
        var user = await _userManager.Users
            .Where(x => x.Id == userId)
            .ProjectToType<UserProfileResponse>()
            .SingleAsync();

        return Result.Success(user);
    }

    public async Task<Result> UpdateProfileAsync(string userId, UpdateProfileRequest request)
    {
        //var user = await _userManager.FindByIdAsync(userId);

        //user = request.Adapt(user);

        //await _userManager.UpdateAsync(user!);

        await _userManager.Users
            .Where(x => x.Id == userId)
            .ExecuteUpdateAsync(setters =>
            setters
                .SetProperty(x => x.FirstName, request.FirstName)
                .SetProperty(x => x.LastName, request.LastName)
            );

        return Result.Success();
    }

    public async Task<Result> ChangePasswordAsync(string userId, ChangePasswordRequest request)
    {
        var user = await _userManager.FindByIdAsync(userId);

        var result = await _userManager.ChangePasswordAsync(user!, request.CurrentPassword, request.NewPassword);

        if (result.Succeeded)
            return Result.Success();

        var error = result.Errors.First();

        return Result.Failure(new Error(error.Code, error.Description, StatusCodes.Status400BadRequest));

    }

    public async Task<Result<string>> UploadProfilePictureAsync(string userId, IFormFile ProfilePicture)
    {
        if (userId is null)
            return Result.Failure<string>(UserErrors.InvalidCode);

        var user = await _userManager.FindByIdAsync(userId);

        if (user is null)
            return Result.Failure<string>(UserErrors.InvalidCode);

        if (string.IsNullOrEmpty(_hostEnvironment.WebRootPath))
        {
            _hostEnvironment.WebRootPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
        }

        string uploadsFolder = Path.Combine(_hostEnvironment.WebRootPath, "uploads", "profile_pictures");
        Directory.CreateDirectory(uploadsFolder);

        string uniqueFileName = $"{userId}{Path.GetExtension(ProfilePicture.FileName)}";
        string filePath = Path.Combine(uploadsFolder, uniqueFileName);

        try
        {
            using (var fileStream = new FileStream(filePath, FileMode.Create))
            {
                await ProfilePicture.CopyToAsync(fileStream);
            }

            user.ProfilePicture = $"/uploads/profile_pictures/{uniqueFileName}";
            await _userManager.UpdateAsync(user);

            return Result.Success<string>(user.ProfilePicture);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error uploading profile picture");
            return Result.Failure<string>(ProfilePictureErrors.UploadFailed);
        }
    }

    public async Task<Result<string>> UploadFileAsync(string userId, IFormFile file, string folder)
    {
        if (string.IsNullOrEmpty(userId))
            return Result.Failure<string>(UserErrors.InvalidCode);

        var user = await _userManager.FindByIdAsync(userId);
        if (user == null)
            return Result.Failure<string>(UserErrors.InvalidCode);

        if (string.IsNullOrEmpty(_hostEnvironment.WebRootPath))
        {
            _hostEnvironment.WebRootPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
        }

        string uploadsFolder = Path.Combine(_hostEnvironment.WebRootPath, "uploads", folder);
        Directory.CreateDirectory(uploadsFolder);

        string uniqueFileName = $"{userId}_{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
        string filePath = Path.Combine(uploadsFolder, uniqueFileName);

        try
        {
            using (var fileStream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(fileStream);
            }

            return Result.Success<string>($"/uploads/{folder}/{uniqueFileName}");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error uploading file to {folder}");
            return Result.Failure<string>(new Error($"{folder}.UploadFailed", $"Failed to upload {folder} image", StatusCodes.Status500InternalServerError));
        }
    }


}