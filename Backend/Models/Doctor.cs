namespace Backend.Models
{
    public class Doctor:Person
    {
        public int? ExperienceYears { get; set; }
        
        public string? ClinicAdress { get; set; }
         public List<PatientDoctor>? Patients { get; set; }
    }
}

