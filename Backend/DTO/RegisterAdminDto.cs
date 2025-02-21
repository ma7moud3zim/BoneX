using System.ComponentModel.DataAnnotations;

namespace Backend.DTO
{
    public class RegisterAdminDto
    {
        [Required]
        [MaxLength(50)] // Define max length for the username
        public string UserName { get; set; }

        [Required]
        public string Password { get; set; }
        [Required]
        [EmailAddress]
        public string Email { get; set; }
        [Phone]
        public string Phone { get; set; }

        [Required]
        [MaxLength(100)]
        public string FirstName { get; set; }

        [MaxLength(100)]
        public string? LastName { get; set; }

        public int? Age { get; set; }

        public string? Gender { get; set; }

    }
}
