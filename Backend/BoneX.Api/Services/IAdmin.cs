using BoneX.Api.Contracts.Doctor;

namespace BoneX.Api.Services;

public interface IAdmin
{
    Task<Result<List<DoctorListAdminResponse>>> GetAllDoctorsAsync();
    Task<Result> ChangeDoctorStatusAsync(string doctorId, bool isActive);
}
