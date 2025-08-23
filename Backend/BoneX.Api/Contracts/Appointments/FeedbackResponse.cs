namespace BoneX.Api.Contracts.Appointments;

public record FeedbackResponse(
    int FeedbackId,
    int AppointmentId,
    string PatientName,
    string DoctorName,
    bool MedicalAttentionGiven,
    bool WasGoodListener,
    bool WillContinueTreatment,
    bool ExpectationsMet,
    bool RecommendDoctor,
    int Rating
);