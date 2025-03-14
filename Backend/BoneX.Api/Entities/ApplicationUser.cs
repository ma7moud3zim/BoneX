using NetTopologySuite.Geometries;

namespace BoneX.Api.Entities;

public class ApplicationUser : IdentityUser
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public DateOnly DateOfBirth { get; set; }
    public Gender Gender { get; set; }
    public string Role { get; set; } = "Patient"; // Default 
    public string? ProfilePicture { get; set; }
    public Point? Location { get; set; } = new Point(0, 0) { SRID = 4326 };


    public List<RefreshToken> RefreshTokens { get; set; } = [];
}


public enum Gender
{
    Male = 1,
    Female = 2
}

