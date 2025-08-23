namespace BoneX.Api.Errors;

public static class ProfilePictureErrors
{
    public static readonly Error UploadFailed =
        new Error("ProfilePicture.UploadFailed", "Failed to upload Profile Picture", StatusCodes.Status500InternalServerError);
}
