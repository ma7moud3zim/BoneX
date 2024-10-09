using System.ComponentModel.DataAnnotations;

namespace Backend.DTO
{
    public class RegisterDoctorDto
    {
        [Required]
        [MaxLength(50)]
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

        public int? ExperienceYears { get; set; }

        public string? ClinicAdress { get; set; }

    }
}
