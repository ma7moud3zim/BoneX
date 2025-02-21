using System.ComponentModel.DataAnnotations;

namespace Backend.DTO;

public class FeedbackDto
{
    [Required]
    public int PatientId { get; set; }

    [Required]
    [MaxLength(500)]
    public string Message { get; set; }

    [Required]
    [Range(1, 5)]
    public int Rating { get; set; }
}
