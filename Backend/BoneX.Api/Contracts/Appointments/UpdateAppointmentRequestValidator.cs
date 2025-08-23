namespace BoneX.Api.Contracts.Appointments;

public class UpdateAppointmentRequestValidator : AbstractValidator<UpdateAppointmentRequest>
{
    public UpdateAppointmentRequestValidator()
    {
        RuleFor(x => x.ScheduledTime)
            .Must(time => time == null || time > DateTime.UtcNow)
            .WithMessage("Appointment time must be in the future");

        RuleFor(x => x.CancellationReason)
            .NotEmpty()
            .When(x => x.Status == AppointmentStatus.Cancelled)
            .WithMessage("Cancellation reason is required when cancelling an appointment");
    }
}
