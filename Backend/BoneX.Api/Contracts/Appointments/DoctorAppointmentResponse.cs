namespace BoneX.Api.Contracts.Appointments;

public record DoctorAppointmentResponse(

    int Id,
    string PatientId,
    string PatientName,
    string? PatientPicture,
    Gender PatientGender,
    DateOnly PatientBirthDate,
    string Type,
    DateTime ScheduledTime,
    DateTime EndTime,
    string Status,
    string? CancellationReason,
    string? MeetingLink,
    //Feedback? Feedback
    FeedbackResponse? Feedback
);