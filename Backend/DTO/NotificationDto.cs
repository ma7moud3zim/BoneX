using System.ComponentModel.DataAnnotations;

namespace Backend.DTO;

public class NotificationDto
{
    [Required]
    public string UserId { get; set; }

    [Required]
    [MaxLength(250)]
    public string Message { get; set; }
}
