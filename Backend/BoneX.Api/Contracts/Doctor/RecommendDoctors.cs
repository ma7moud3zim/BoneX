namespace BoneX.Api.Contracts.Doctor;

public record RecommendDoctors(
        string DoctorId,
        int YearsOfExperience,
        double Rating,
        double Latitude,
        double Longitude
);

public class DoctorRecommend
{
    public string DoctorID { get; set; }
    public double Distance { get; set; }
}