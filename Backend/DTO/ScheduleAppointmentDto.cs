using System.ComponentModel.DataAnnotations;

namespace Backend.DTO;

public class ScheduleAppointmentDto
{
    [Required]
    public int PatientId { get; set; }

    [Required]
    public int DoctorId { get; set; }

    [Required]
    public DateTime DateTime { get; set; }
}
