namespace BoneX.Api.Contracts.Patient;

public record PatientProfileResponse(
    string Id,
    string Email,
    string FirstName,
    string LastName,
    DateOnly DateOfBirth,
    Gender Gender,
    string PhoneNumber,
    string? ProfilePicture,
    double? Latitude,
    double? Longitude,
    string? PastMedicalConditions,
    Chronic? ChronicConditions
);