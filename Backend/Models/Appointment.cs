namespace Backend.Models
{
    public enum AppointmentType:short
    {
        Clinic = 0,
        Online = 1
    };
    public enum AppointmentStatus:short
    {
        Canceled = 0,
        Confirmed =1
    };

    public class Appointment
    {
        public int Id { get; set; } 
        public DateTime date { get; set; }  
        public AppointmentType AppointmentType { get; set; }    

        public AppointmentStatus AppointmentStatus { get; set; }
        public int PatientDoctorId { get; set; } // Foreign key for PatientDoctor

        public PatientDoctor PatientDoctor { get; set; }    

    }
}
