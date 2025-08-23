using BoneX.Api.Contracts.Doctor;
using BoneX.Api.Contracts.Users;

namespace BoneX.Api.Services;

public interface IDoctorService
{
    Task<Result> RegisterDoctorAsync(DoctorRegisterRequest request, CancellationToken cancellationToken = default);
    Task<Result> UpdateDoctorProfileAsync(string doctorId, UpdateDoctorProfileRequest request, CancellationToken cancellationToken = default);
    Task<Result<List<DoctorListResponse>>> GetAllDoctorsAsync();
    Task<Result<DoctorProfileResponse>> GetDoctorProfileAsync(string doctorId, CancellationToken cancellationToken = default);
    Task<Result<DoctorStatisticsResponse>> GetDoctorStatisticsAsync(string doctorId, CancellationToken cancellationToken = default);
    Task<Result<List<RecommendDoctors>>> GetRecommendedDoctorsAsync(CancellationToken cancellationToken = default);
}
