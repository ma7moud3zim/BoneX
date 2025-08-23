namespace BoneX.Api.Contracts.Doctor;

public record UpdateDoctorProfileRequest(
    string? PhoneNumber,
    int? YearsOfExperience,
    string? ConsultationHours,
    double? ConsultationFees,
    string? WorkplaceName,
    double? Latitude,
    double? Longitude,
    IFormFile? ProfilePicture,
    IFormFile? AdditionalCertification,
    List<IFormFile>? AwardsOrRecognitions,
    string? Brief,
    string? Award,
    IFormFile? AwardImage
);
