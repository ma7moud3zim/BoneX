namespace BoneX.Api.Contracts.Xray;

public class AddDoctorReviewRequestValidator : AbstractValidator<AddDoctorReviewRequest>
{
    public AddDoctorReviewRequestValidator()
    {
        RuleFor(x => x.XrayImageId)
            .GreaterThan(0)
            .WithMessage("Invalid X-ray image ID");

        RuleFor(x => x.ReviewText)
            .NotEmpty()
            .WithMessage("Review text is required")
            .MaximumLength(500)
            .WithMessage("Review text must not exceed 500 characters");
    }
}
