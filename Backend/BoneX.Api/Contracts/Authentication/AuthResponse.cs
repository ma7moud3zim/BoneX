namespace BoneX.Api.Contracts.Authentication;

public record AuthResponse
(
    string Id,
    string? Email,
    string FirstName,
    string LastName,
    string? ProfilePicture,
    Gender Gender,
    string Role,
    string Token,
    int ExpiresIn,
    string RefreshToken,
    DateTime? RefreshTokenExpiration
);