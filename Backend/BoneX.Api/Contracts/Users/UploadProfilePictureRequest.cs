namespace BoneX.Api.Contracts.Users;

public record UploadProfilePictureRequest(
    IFormFile ProfilePicture
);