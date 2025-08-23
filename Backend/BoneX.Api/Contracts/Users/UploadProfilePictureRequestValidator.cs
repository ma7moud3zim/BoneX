namespace BoneX.Api.Contracts.Users;

public class UploadProfilePictureRequestValidator : AbstractValidator<UploadProfilePictureRequest>
{
    public UploadProfilePictureRequestValidator()
    {
        RuleFor(x => x.ProfilePicture)
            .NotNull()
            .WithMessage("Profile Picture is required.");

        //RuleFor(x => x.ProfilePicture.Length)
        //    .LessThanOrEqualTo(2 * 1024 * 1024)
        //    .WithMessage("File size must be less than 2MB.");

        //RuleFor(x => x.ProfilePicture.ContentType)
        //    .Must(x => x == "image/jpeg" || x == "image/png")
        //    .WithMessage("File must be a jpeg or png image.");
    }
}
