namespace BoneX.Api.Entities;

public class DoctorReview
{
    public int Id { get; set; }
    public int XrayImageId { get; set; }
    public string DoctorId { get; set; } = null!;
    public string ReviewText { get; set; } = null!;
    public DateTime ReviewDate { get; set; } = DateTime.UtcNow;

    public XrayImage XrayImage { get; set; } = null!;
    public Doctor Doctor { get; set; } = null!;
}
