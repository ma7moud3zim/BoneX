namespace BoneX.Api.Contracts.Xray;

public record DoctorReviewResponse(
    int Id,
    string DoctorId,
    string DoctorName,
    string ReviewText,
    DateTime ReviewDate
);