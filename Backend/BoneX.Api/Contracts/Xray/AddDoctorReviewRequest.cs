namespace BoneX.Api.Contracts.Xray;

public record AddDoctorReviewRequest(
    int XrayImageId,
    string ReviewText
);