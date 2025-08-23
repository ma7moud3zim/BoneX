using BoneX.Api.Contracts.Appointments;
using BoneX.Api.Contracts.Doctor;

namespace BoneX.Api.Services;

public interface IDoctorAvailabilityService
{
    Task<Result> SetAvailabilityAsync(string doctorId, SetAvailabilityRequest request, CancellationToken cancellationToken = default);
    Task<Result<List<AvailabilityResponse>>> GetAvailabilityAsync(string doctorId, CancellationToken cancellationToken = default);
    Task<Result<List<DateTime>>> GetAvailableTimeSlotsAsync(string doctorId, DateTime date, CancellationToken cancellationToken = default);

    Task<Result<List<TimeSlot>>> GetFormattedAvailableTimeSlotsAsync(string doctorId, DateTime date, CancellationToken cancellationToken = default);
}
