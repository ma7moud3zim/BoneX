namespace BoneX.Api.Contracts.Appointments;

public record CreateAppointmentRequest(
    string DoctorId,
    DateTime ScheduledTime
);