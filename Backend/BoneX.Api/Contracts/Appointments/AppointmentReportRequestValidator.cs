namespace BoneX.Api.Contracts.Appointments;

public class AppointmentReportRequestValidator : AbstractValidator<AppointmentReportRequest>
{
    public AppointmentReportRequestValidator()
    {
        RuleFor(x => x.AppointmentId)
            .NotEmpty()
            .GreaterThan(0)
            .WithMessage("Appointment ID must be greater than 0.");
        RuleFor(x => x.PatientName)
            .NotEmpty()
            .WithMessage("Patient name is required.")
            .MaximumLength(100)
            .WithMessage("Patient name cannot exceed 100 characters.");
        RuleFor(x => x.Diagnosis)
            .NotEmpty()
            .WithMessage("Diagnosis is required.")
            .MaximumLength(500)
            .WithMessage("Diagnosis cannot exceed 500 characters.");
        RuleFor(x => x.Medications)
            .MaximumLength(500)
            .WithMessage("Medications cannot exceed 500 characters.");
    }
}
