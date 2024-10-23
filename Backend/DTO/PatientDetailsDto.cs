namespace Backend.DTO
{
    public class PatientDetailsDto
    {
        public string UserName { get; set; }

        public string FirstName { get; set; }

        public string? LastName { get; set; }
        public string Email { get; set; }
        public int? Age { get; set; }
        public DateOnly? DateOfBirth { get; set; }
        public string? Gender { get; set; }

        public byte[]? ImageData { get; set; }
        public string? PhoneNumber { get; set; }
        public int Height { get; set; }
        public int BodyWeight { get; set; }
        public string BloodGroup { get; set; }
        
    }
}
