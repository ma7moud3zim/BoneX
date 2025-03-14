namespace BoneX.Api.Contracts.Doctor;

public record DoctorRegisterRequest(
    string Email,
    string Password,
    string FirstName,
    string LastName,
    DateOnly DateOfBirth,
    Gender Gender,
    string PhoneNumber,
    string ProfilePicture,
    double Latitude,
    double Longitude,
    string UniversityName,
    int GraduationYear,
    string DegreeCertificates,
    string? AdditionalCertifications,
    int YearsOfExperience,
    string ConsultationHours,
    double ConsultationFees,
    string WorkplaceName,
    string? AwardsOrRecognitions
);
