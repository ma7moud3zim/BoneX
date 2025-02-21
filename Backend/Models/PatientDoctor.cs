namespace Backend.Models
{
    public class PatientDoctor
    {
        public int PatientDoctorId { get; set; } // Primary key

        public string PatientUsername { get; set; }
        public Patient Patient {  get; set; }

        public string DoctorUsername { get; set; }

        public Doctor Doctor {  get; set; }

        public List<Appointment>? appointments { get; set; } = new List<Appointment>();

    }
}
