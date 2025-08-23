namespace BoneX.Api.Contracts.Doctor;

public record DoctorStatisticsResponse(
    int TotalPatients,
    int TotalAppointments,
    int CompletedAppointments,
    int CancelledAppointments,
    List<AppointmentsByMonth> AppointmentsByMonth
);

public record AppointmentsByMonth(
    string Month,
    int Count
);