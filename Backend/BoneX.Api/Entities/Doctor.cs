namespace BoneX.Api.Entities;

public class Doctor : ApplicationUser
{
    public string UniversityName { get; set; } = string.Empty;
    public int GraduationYear { get; set; }
    public string DegreeCertificates { get; set; } = string.Empty;
    public string? AdditionalCertifications { get; set; }
    public int YearsOfExperience { get; set; }
    public string ConsultationHours { get; set; } = string.Empty;
    public double ConsultationFees { get; set; }
    public string WorkplaceName { get; set; } = string.Empty;
    public string? AwardsOrRecognitions { get; set; }

    // new properties
    public string Brief { get; set; } = string.Empty;
    public string Award { get; set; } = string.Empty;
    public string AwardImage { get; set; } = string.Empty;

    public List<Appointment> Appointments { get; set; } = [];
}
