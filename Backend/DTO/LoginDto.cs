using System.ComponentModel.DataAnnotations;

namespace Backend.DTO
{
    public class LoginDto
    {
        public string? UserName { get; set; }
        [Required]
        public string Password { get; set; }
        [EmailAddress]
        public string? Email { get; set; }
    }
}
