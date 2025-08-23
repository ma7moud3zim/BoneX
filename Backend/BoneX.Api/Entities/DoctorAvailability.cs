namespace BoneX.Api.Entities;

public class DoctorAvailability
{

    public int Id { get; set; }
    public string DoctorId { get; set; } = string.Empty;
    public DayOfWeek DayOfWeek { get; set; }
    public TimeSpan StartTime { get; set; }
    public TimeSpan EndTime { get; set; }
    public bool IsAvailable { get; set; } = true;

    // Navigation property
    public Doctor Doctor { get; set; } = null!;
}
