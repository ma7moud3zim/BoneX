namespace BoneX.Api.Contracts.Patient;

public record PatientUpdateRequest(
    string? FirstName,
    string? LastName,
    DateOnly? DateOfBirth,
    Gender? Gender,
    string? PhoneNumber,
    IFormFile? ProfilePicture,
    double? Latitude,
    double? Longitude,
    string? PastMedicalConditions,
    Chronic? ChronicConditions
);