using BoneX.Api.Contracts.Xray;

namespace BoneX.Api.Services;

public interface IXrayService
{
    Task<Result<XrayAnalysisResponse>> UploadXrayAsync(UploadXrayRequest request);
    Task<Result<XrayAnalysisResponse>> GetXrayAnalysisAsync(int xrayId);
    Task<Result<List<XrayAnalysisResponse>>> GetPatientXraysAsync();
    Task<Result> AddDoctorReviewAsync(AddDoctorReviewRequest request);
}
