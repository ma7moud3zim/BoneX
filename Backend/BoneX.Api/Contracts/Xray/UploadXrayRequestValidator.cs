namespace BoneX.Api.Contracts.Xray;

public class UploadXrayRequestValidator : AbstractValidator<UploadXrayRequest>
{
    public UploadXrayRequestValidator()
    {
        RuleFor(x => x.XrayImage)
            .NotNull().WithMessage("X-ray image is required");

        //RuleFor(x => x.XrayImage.ContentType)
        //    .Must(x => x == "image/jpeg" || x == "image/png" || x == "image/dicom")
        //    .When(x => x.XrayImage != null)
        //    .WithMessage("File must be a valid image format (JPEG, PNG, or DICOM)");

        //RuleFor(x => x.XrayImage.Length)
        //    .LessThanOrEqualTo(10 * 1024 * 1024) // 10MB max
        //    .When(x => x.XrayImage != null)
        //    .WithMessage("File size must not exceed 10MB");

        RuleFor(x => x.Description)
            .MaximumLength(250)
            .WithMessage("Description must be less than 250 characters.");
    }
}
