namespace BoneX.Api.Entities;

public class Appointment
{
    public int Id { get; set; }
    public string PatientId { get; set; } = string.Empty;
    public string DoctorId { get; set; } = string.Empty;
    public DateTime ScheduledTime { get; set; }
    public DateTime EndTime { get; set; }
    public string Status { get; set; } = AppointmentStatus.Scheduled;
    public string? CancellationReason { get; set; }
    public string? MeetingLink { get; set; }
    public Feedback? Feedback { get; set; }

    // Navigation properties
    public Doctor Doctor { get; set; } = null!;
    public Patient Patient { get; set; } = null!;

    public AppointmentReport? Report { get; set; }
}

public static class AppointmentStatus {
    public const string Scheduled = "Scheduled";
    public const string Rescheduled = "Rescheduled";
    public const string Completed = "Completed";
    public const string Cancelled = "Cancelled";
    public const string NoShow = "NoShow";
}

