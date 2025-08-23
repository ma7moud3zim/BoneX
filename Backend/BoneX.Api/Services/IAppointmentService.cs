using BoneX.Api.Contracts.Appointments;

namespace BoneX.Api.Services;

public interface IAppointmentService
{
    Task<Result<AppointmentResponse>> CreateAppointmentAsync(string patientId, CreateAppointmentRequest request, CancellationToken cancellationToken = default);
    Task<Result<AppointmentResponse>> UpdateAppointmentAsync(string userId, int appointmentId, UpdateAppointmentRequest request, CancellationToken cancellationToken = default);
    Task<Result<AppointmentResponse>> GetAppointmentByIdAsync(string userId, int appointmentId, CancellationToken cancellationToken = default);
    Task<Result<List<DoctorAppointmentResponse>>> GetUserAppointmentsAsync(string userId, bool includePast = false, CancellationToken cancellationToken = default);
    Task<Result<List<DoctorAppointmentResponse>>> GetDoctorAppointmentsAsync(string doctorId, DateTime? date = null, CancellationToken cancellationToken = default);
    Task<Result> CancelAppointmentAsync(string userId, int appointmentId, string cancellationReason, CancellationToken cancellationToken = default);
    Task<Result<List<DateTime>>> GetDoctorAvailableTimeSlotsAsync(string doctorId, DateTime date, CancellationToken cancellationToken = default);
    Task<Result<List<string>>> GetFormattedAvailableSlotsAsync(string doctorId, DateTime date, CancellationToken cancellationToken = default);
    Task<Result<Dictionary<string, int>>> GetDoctorAppointmentStatsAsync(string doctorId, CancellationToken cancellationToken = default);
    Task<Result> SubmitFeedbackAsync(FeedbackRequest request, string patientId);
    Task<Result<List<FeedbackResponse>>> GetFeedbacksAsync();
    Task<Result> WriteReportAsync(string doctorId, AppointmentReportRequest request, CancellationToken cancellationToken = default);

}
