using System.ComponentModel.DataAnnotations;

namespace Backend.DTO;

public class ResetPasswordDto
{
    [Required]

    public string CurrentPassword { get; set; }

    [Required]

    public string NewPassword { get; set; }

    [Required]

    [Compare("NewPassword", ErrorMessage = "password do not match.")]
    public string ConfirmPassword { get; set; }
}
