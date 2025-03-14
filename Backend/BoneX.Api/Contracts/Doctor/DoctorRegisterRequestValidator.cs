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
        RuleFor(x => x.DegreeCertificates).NotEmpty();
        RuleFor(x => x.YearsOfExperience).GreaterThanOrEqualTo(0);
        RuleFor(x => x.ConsultationHours).NotEmpty();
        RuleFor(x => x.ConsultationFees).GreaterThan(0);
        RuleFor(x => x.WorkplaceName).NotEmpty();
    }

}
