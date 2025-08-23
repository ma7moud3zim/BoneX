using System.ComponentModel.DataAnnotations;

namespace BoneX.Api.Contracts.DoctorVerification;

public class FaceVerificationRequest
{
    [Required]
    public IFormFile Image1 { get; set; }

    [Required]
    public IFormFile Image2 { get; set; }
}
