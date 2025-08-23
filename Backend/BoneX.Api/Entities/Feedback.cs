using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace BoneX.Api.Entities;

public class Feedback
{
    public int Id { get; set; }
    public int AppointmentId { get; set; }
    public string PatientId { get; set; } = string.Empty;

    // Boolean questions
    public bool MedicalAttentionGiven { get; set; }
    public bool WasGoodListener { get; set; }
    public bool WillContinueTreatment { get; set; }
    public bool ExpectationsMet { get; set; }
    public bool RecommendDoctor { get; set; }

    [Range(1, 5)]
    public int Rating { get; set; }
    public string? Comments { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public Appointment Appointment { get; set; } = null!;
    public Patient Patient { get; set; } = null!;
}
