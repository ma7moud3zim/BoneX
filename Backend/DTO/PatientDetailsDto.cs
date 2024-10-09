namespace Backend.DTO
{
    public class PatientDetailsDto
    {
        public string Username { get; set; }

        public string FirstName { get; set; }

        public string? LastName { get; set; }

        public int? Age { get; set; }

        public string? Gender { get; set; }

        public byte[]? ImageData { get; set; }
    }
}
