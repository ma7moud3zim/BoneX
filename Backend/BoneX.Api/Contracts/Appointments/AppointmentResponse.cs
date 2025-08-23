namespace BoneX.Api.Contracts.Appointments;

public record AppointmentResponse(
    int Id,
    string DoctorId,
    string PatientId,
    string DoctorName,
    string PatientName,
    DateTime ScheduledTime,
    DateTime EndTime,
    string Status,
    string? CancellationReason,
    string? MeetingLink,

    //Feedback? Feedback
    FeedbackResponse? Feedback
);