namespace BoneX.Api.Contracts.Appointments;

public record FeedbackRequest(
    int AppointmentId,
    bool MedicalAttentionGiven,
    bool WasGoodListener,
    bool WillContinueTreatment,
    bool ExpectationsMet,
    bool RecommendDoctor,
    int Rating
);