namespace BoneX.Api.Contracts.Xray;

public record XrayAnalysisResponse(

    int Id,
    string FileName,
    string FilePath,
    DateTime UploadDate,
    XrayStatus Status,
    string? AiAnalysisResult = null,
    DateTime? AnalysisDate = null,
    List<DoctorReviewResponse>? DoctorReviews = null
);
