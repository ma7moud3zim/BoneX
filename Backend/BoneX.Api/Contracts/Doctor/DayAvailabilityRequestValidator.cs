namespace BoneX.Api.Contracts.Doctor;

public class DayAvailabilityRequestValidator : AbstractValidator<DayAvailabilityRequest>
{
    public DayAvailabilityRequestValidator()
    {
        RuleFor(x => x.StartTime).NotEmpty()
            .Must((request, startTime) => startTime < request.EndTime)
            .WithMessage("Start time must be earlier than end time");

        RuleFor(x => x.EndTime).NotEmpty();
    }
}