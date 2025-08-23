
namespace BoneX.Api.Errors;

public static class XrayErrors
{
    public static readonly Error UploadFailed =
        new("Xray.UploadFailed", "Failed to upload X-ray image", StatusCodes.Status500InternalServerError);

    public static readonly Error XrayNotFound =
        new("Xray.NotFound", "X-ray image not found", StatusCodes.Status404NotFound);

    public static readonly Error XrayAlreadyReviewed =
        new("Xray.AlreadyReviewed", "You have already reviewed this X-ray image", StatusCodes.Status400BadRequest);

    public static readonly Error UnauthorizedAccess = 
        new("Xray.UnauthorizedAccess", "You do not have permission to access this X-ray image", StatusCodes.Status403Forbidden);

    public static readonly Error AiServiceUnavailable =
        new("Xray.AiServiceUnavailable", "AI analysis service is currently unavailable", StatusCodes.Status503ServiceUnavailable);
}
