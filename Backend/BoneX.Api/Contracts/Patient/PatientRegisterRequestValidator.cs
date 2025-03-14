namespace BoneX.Api.Contracts.Patient;

public class PatientRegisterRequestValidator : AbstractValidator<PatientRegisterRequest>
{
    public PatientRegisterRequestValidator()
    {
        RuleFor(x => x.Email).NotEmpty().EmailAddress();
        RuleFor(x => x.Password).NotEmpty().MinimumLength(6);
        RuleFor(x => x.FirstName).NotEmpty().Length(3, 100);
        RuleFor(x => x.LastName).NotEmpty().Length(3, 100);
        RuleFor(x => x.Gender).IsInEnum().NotEmpty();
        RuleFor(x => x.PhoneNumber).NotEmpty();
        RuleFor(x => x.PastMedicalConditions).NotEmpty().WithMessage("Past medical conditions are required.");
        RuleFor(x => x.ChronicConditions).IsInEnum();
    }
}
