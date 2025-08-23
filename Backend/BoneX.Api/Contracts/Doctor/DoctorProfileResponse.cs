namespace BoneX.Api.Contracts.Doctor;

public record DoctorProfileResponse(
    string Id,
    string FirstName,
    string LastName,
    string Email,
    string PhoneNumber,
    Gender Gender,
    double Latitude,
    double Longitude,
    string? ProfilePicture,
    string UniversityName,
    int GraduationYear,
    string DegreeCertificate,
    string? AdditionalCertification,
    int YearsOfExperience,
    string ConsultationHours,
    double ConsultationFees,
    string WorkplaceName,
    List<string> AwardsOrRecognitions,
    string Brief,
    string Award,
    string AwardImage
);
