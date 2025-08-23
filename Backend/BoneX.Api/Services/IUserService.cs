using BoneX.Api.Contracts.Users;

namespace BoneX.Api.Services;

public interface IUserService
{
    Task<Result<UserProfileResponse>> GetProfileAsync(string userId);
    Task<Result> UpdateProfileAsync(string userId, UpdateProfileRequest request);
    Task<Result> ChangePasswordAsync(string userId, ChangePasswordRequest request);
    Task<Result<string>> UploadProfilePictureAsync(string userId, IFormFile ProfilePicture);
    Task<Result<string>> UploadFileAsync(string userId, IFormFile file, string folder);

}
