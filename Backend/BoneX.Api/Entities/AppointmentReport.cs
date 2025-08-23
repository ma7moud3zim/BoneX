namespace BoneX.Api.Entities;

public class AppointmentReport
{
    public int Id { get; set; }
    public int AppointmentId { get; set; }
    public string PatientName { get; set; } = null!;
    public string Diagnosis { get; set; } = null!;
    public string? Medications { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    
    public Appointment Appointment { get; set; } = null!;
}
