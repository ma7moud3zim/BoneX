namespace BoneX.Api.Contracts.Appointments;

public record UpdateAppointmentRequest(
    DateTime? ScheduledTime,
    string? Status,
    string? CancellationReason
);