namespace BoneX.Api.Contracts.Authentication;

public record RegisterRequest(
    string Email,
    string Password,
    string FirstName,
    string LastName,

    DateOnly DateOfBirth,
    Gender Gender,
    string PhoneNumber,
    string ProfilePicture,
DoctorDetails? DoctorInfo = null,
    PatientDetails? PatientInfo = null
);


public record DoctorDetails(
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

public record PatientDetails(
     string? ProfilePicture,
    string? PastMedicalConditions,
    Chronic? ChronicConditions
);