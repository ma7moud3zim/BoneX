namespace BoneX.Api.Contracts.Patient;

public class PatientUpdateRequestValidator : AbstractValidator<PatientUpdateRequest>
{
    public PatientUpdateRequestValidator()
    {
        RuleFor(x => x.FirstName).Length(3, 100).When(x => x.FirstName != null);
        RuleFor(x => x.LastName).Length(3, 100).When(x => x.LastName != null);
        RuleFor(x => x.Gender).IsInEnum().When(x => x.Gender.HasValue);
        RuleFor(x => x.ChronicConditions).IsInEnum().When(x => x.ChronicConditions.HasValue);

        RuleFor(x => x.ProfilePicture)
            .Must(x => x == null || x.ContentType.Contains("image"))
            .WithMessage("Profile picture must be an image");
    }
}
