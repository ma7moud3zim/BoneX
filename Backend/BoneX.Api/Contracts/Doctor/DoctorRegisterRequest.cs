namespace BoneX.Api.Contracts.Doctor;

public record DoctorRegisterRequest(
     // basic information
    string Email,
    string Password,
    string FirstName,
    string LastName,
    DateOnly DateOfBirth,
    Gender Gender,
    string PhoneNumber,

    // professional information
    string Speciality,
    string UniversityName,
    int GraduationYear,
    int YearsOfExperience,
    string ConsultationHours,
    double ConsultationFees,
    string WorkplaceName,
    string Brief,

    // location
    double Latitude,
    double Longitude,

    // Required files
    IFormFile ProfilePicture,
    IFormFile IdPhoto,
    IFormFile DegreeCertificate,

    // Optional fields 
    IFormFile? AdditionalCertification = null,
    List<IFormFile>? AwardsOrRecognitions = null
);
