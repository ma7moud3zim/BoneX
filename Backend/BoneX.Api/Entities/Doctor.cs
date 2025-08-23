namespace BoneX.Api.Entities;

public class Doctor : ApplicationUser
{
    public string UniversityName { get; set; } = string.Empty;
    public int GraduationYear { get; set; }
    public string DegreeCertificate { get; set; } = string.Empty;
    public string? AdditionalCertification { get; set; }
    public int YearsOfExperience { get; set; }
    public string ConsultationHours { get; set; } = string.Empty;
    public double ConsultationFees { get; set; }
    public string WorkplaceName { get; set; } = string.Empty;
    public List<string> AwardsOrRecognitions { get; set; } = [];

    public string Brief { get; set; } = string.Empty;
    public string Award { get; set; } = string.Empty;
    public string AwardImage { get; set; } = string.Empty;
    public string Speciality { get; set; } = string.Empty;

    public List<Appointment> Appointments { get; set; } = [];
}
