namespace BoneX.Api.Contracts.Appointments;

public class CreateAppointmentRequestValidator : AbstractValidator<CreateAppointmentRequest>
{
    public CreateAppointmentRequestValidator()
    {
        RuleFor(x => x.DoctorId).NotEmpty();
        RuleFor(x => x.ScheduledTime).NotEmpty()
            .Must(time => time > DateTime.UtcNow)
            .WithMessage("Appointment time must be in the future");
    }
}
