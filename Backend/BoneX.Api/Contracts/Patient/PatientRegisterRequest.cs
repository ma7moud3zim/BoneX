namespace BoneX.Api.Contracts.Patient;

public record PatientRegisterRequest(
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
    string? PastMedicalConditions,
    Chronic? ChronicConditions
);
