namespace Backend.Models
{
    public class Patient:Person
    {
        public DateOnly? DateOfBirth { get; set; }   
        public string? MedicalHistory { get; set; }
        public List<PatientDoctor>? Doctors { get; set; }   
    }
}
