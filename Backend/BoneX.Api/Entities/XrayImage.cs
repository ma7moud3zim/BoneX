namespace BoneX.Api.Entities;

public class XrayImage
{
    public int Id { get; set; }
    public string PatientId { get; set; } = null!;
    public string FileName { get; set; } = null!;
    public string FilePath { get; set; } = null!;
    public DateTime UploadDate { get; set; } = DateTime.UtcNow;
    public XrayStatus Status { get; set; } = XrayStatus.Pending;
    public string? AiAnalysisResult { get; set; }
    public DateTime? AnalysisDate { get; set; }

    public Patient Patient { get; set; } = null!;
    public List<DoctorReview> DoctorReviews { get; set; } = new();
}

public enum XrayStatus
{
    Pending,
    Analyzed,
    ReviewedByDoctor
}
