namespace BoneX.Api.Contracts.Authentication;

public class RegisterRequestValidator : AbstractValidator<RegisterRequest>
{
    public RegisterRequestValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty()
            .EmailAddress();

        RuleFor(x => x.Password)
            .NotEmpty()
            .MinimumLength(6)
            .WithMessage("Password must contain at least 6");

        //.Matches(RegexPatterns.Password)
        //.WithMessage("Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character");

        RuleFor(x => x.FirstName)
            .NotEmpty()
            .Length(3, 100);

        RuleFor(x => x.LastName)
            .NotEmpty()
            .Length(3, 100);

        RuleFor(x => x.DateOfBirth)
            .NotEmpty();

        RuleFor(x => x.Gender)
            .IsInEnum()
            .NotEmpty();

        RuleFor(x => x.PhoneNumber)
            .NotEmpty()
            //  .Matches(RegexPatterns.PhoneNumber)
            .WithMessage("Phone number must be in the format +20XXXXXXXXXX");

        When(x => x.DoctorInfo != null, () =>
        {
            RuleFor(x => x.DoctorInfo!.UniversityName)
                .NotEmpty()
                .Length(3, 100);

            RuleFor(x => x.DoctorInfo!.GraduationYear)
                .NotEmpty()
                .LessThan(DateTime.Now.Year);

            RuleFor(x => x.DoctorInfo!.DegreeCertificates)
                .NotEmpty();

            RuleFor(x => x.DoctorInfo!.YearsOfExperience)
                .NotEmpty()
                .GreaterThan(0);

            RuleFor(x => x.DoctorInfo!.ConsultationHours)
                .NotEmpty();

            RuleFor(x => x.DoctorInfo!.ConsultationFees)
                .NotEmpty()
                .GreaterThan(0);

            RuleFor(x => x.DoctorInfo!.WorkplaceName)
                .NotEmpty()
                .Length(3, 100);
        });

        When(x => x.PatientInfo != null, () =>
        {
            RuleFor(x => x.PatientInfo!.ProfilePicture)
                .NotEmpty();

            RuleFor(x => x.PatientInfo!.PastMedicalConditions)
                .NotEmpty();

            RuleFor(x => x.PatientInfo!.ChronicConditions)
                .IsInEnum()
                .NotEmpty();
        });

    }
}
