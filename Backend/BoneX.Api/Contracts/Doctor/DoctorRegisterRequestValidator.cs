namespace BoneX.Api.Contracts.Doctor;

public class DoctorRegisterRequestValidator : AbstractValidator<DoctorRegisterRequest>
{
    public DoctorRegisterRequestValidator()
    {
        RuleFor(x => x.Email).NotEmpty().EmailAddress();
        RuleFor(x => x.Password).NotEmpty().MinimumLength(6);
        RuleFor(x => x.FirstName).NotEmpty().Length(3, 100);
        RuleFor(x => x.LastName).NotEmpty().Length(3, 100);
        RuleFor(x => x.Gender).IsInEnum().NotEmpty();
        RuleFor(x => x.PhoneNumber).NotEmpty();
        RuleFor(x => x.UniversityName).NotEmpty();
        RuleFor(x => x.GraduationYear).LessThanOrEqualTo(DateTime.UtcNow.Year);
        RuleFor(x => x.YearsOfExperience).GreaterThanOrEqualTo(0);
        RuleFor(x => x.ConsultationHours).NotEmpty();
        RuleFor(x => x.ConsultationFees).GreaterThan(0);
        RuleFor(x => x.WorkplaceName).NotEmpty();
        RuleFor(x => x.Latitude).NotEmpty();
        RuleFor(x => x.Longitude).NotEmpty();
        RuleFor(x => x.Speciality).NotEmpty();

        RuleFor(x => x.ProfilePicture)
            .NotNull()
            .Must(x => x.ContentType.Contains("image")) 
            .WithMessage("Profile picture must be an image");

        RuleFor(x => x.IdPhoto)
            .NotNull()
            .Must(x => x.ContentType.Contains("image"))
            .WithMessage("ID photo must be an image");

        RuleFor(x => x.DegreeCertificate)
           .Must(x => x == null || x.ContentType.Contains("image"))
           .WithMessage("Degree certificate must be an image");

        RuleFor(x => x.AdditionalCertification)
            .Must(x => x == null || x.ContentType.Contains("image"))
            .WithMessage("Additional certification must be an image");

        RuleForEach(x => x.AwardsOrRecognitions)
            .Must(x => null == x || x.ContentType.Contains("image"))
            .WithMessage("All awards must be images");
    }

}
