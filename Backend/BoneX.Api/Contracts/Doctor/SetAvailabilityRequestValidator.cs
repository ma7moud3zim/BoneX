namespace BoneX.Api.Contracts.Doctor;

public class SetAvailabilityRequestValidator : AbstractValidator<SetAvailabilityRequest>
{
    public SetAvailabilityRequestValidator()
    {
        RuleFor(x => x.Availabilities).NotEmpty();
        RuleForEach(x => x.Availabilities).SetValidator(new DayAvailabilityRequestValidator());
    }
}