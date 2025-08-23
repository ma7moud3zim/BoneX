namespace BoneX.Api.Contracts.Appointments;

public record AppointmentReportRequest(
    int AppointmentId,
    string PatientName,
    string Diagnosis,
    string? Medications
);
