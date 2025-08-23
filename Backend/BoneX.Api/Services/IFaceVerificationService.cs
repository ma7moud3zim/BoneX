using BoneX.Api.Contracts;
using BoneX.Api.Contracts.DoctorVerification;

namespace BoneX.Api.Services;

public interface IFaceVerificationService
{
    Task<FaceVerificationResponse?> VerifyFacesAsync(string imagePath1, string imagePath2);

}
