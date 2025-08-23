namespace BoneX.Api.Contracts.Doctor;

public class UpdateDoctorProfileRequestValidator : AbstractValidator<UpdateDoctorProfileRequest>
{
    public UpdateDoctorProfileRequestValidator()
    {
        RuleFor(x => x.PhoneNumber).NotEmpty().When(x => !string.IsNullOrEmpty(x.PhoneNumber));
        RuleFor(x => x.YearsOfExperience).GreaterThanOrEqualTo(0).When(x => x.YearsOfExperience.HasValue);
        RuleFor(x => x.ConsultationFees).GreaterThan(0).When(x => x.ConsultationFees.HasValue);
        RuleFor(x => x.WorkplaceName).NotEmpty().When(x => !string.IsNullOrEmpty(x.WorkplaceName));
        RuleFor(x => x.Brief).NotEmpty().When(x => !string.IsNullOrEmpty(x.Brief));
        RuleFor(x => x.Award).NotEmpty().When(x => !string.IsNullOrEmpty(x.Award));
        RuleFor(x => x.Latitude).NotEmpty().When(x => x.Latitude.HasValue);
        RuleFor(x => x.Longitude).NotEmpty().When(x => x.Longitude.HasValue);

        RuleFor(x => x.ProfilePicture)
           .Must(x => x == null || x.ContentType.Contains("image"))
           .WithMessage("Profile picture must be an image");

        RuleFor(x => x.AdditionalCertification)
            .Must(x => x == null || x.ContentType.Contains("image"))
            .WithMessage("Additional certification must be an image");

        RuleFor(x => x.AwardImage)
            .Must(x => x == null || x.ContentType.Contains("image"))
            .WithMessage("Award image must be an image");

        RuleForEach(x => x.AwardsOrRecognitions)
            .Must(x => x == null || x.ContentType.Contains("image"))
            .WithMessage("All awards must be images");
    }
}
