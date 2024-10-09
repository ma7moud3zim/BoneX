using System.ComponentModel.DataAnnotations;

namespace Backend.DTO
{
    public class DoctorDetailsDto
    {
        public string Username { get; set; }

        public string FirstName { get; set; }

        public string? LastName { get; set; }

        public int? Age { get; set; }

        public string? Gender { get; set; }

        public byte[]? ImageData { get; set; }

        public int? ExperienceYears { get; set; }

        public string? ClinicAdress { get; set; }
    }
}
