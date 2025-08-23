using BoneX.Api.Contracts.Appointments;
using BoneX.Api.Extensions;
using Microsoft.AspNetCore.Authorization;
using System.Threading;

namespace BoneX.Api.Controllers;
[Route("[controller]")]
[ApiController]
//[Authorize]
public class AppointmentsController(IAppointmentService appointmentService) : ControllerBase
{
    private readonly IAppointmentService _appointmentService = appointmentService;

    [HttpPost]
    public async Task<IActionResult> CreateAppointment([FromBody] CreateAppointmentRequest request, CancellationToken cancellationToken)
    {
        var userId = User.GetUserId();
        var result = await _appointmentService.CreateAppointmentAsync(userId!, request, cancellationToken);

        return result.IsSuccess ? Ok(result) : result.ToProblem();
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetAppointment(int id, CancellationToken cancellationToken)
    {
        var userId = User.GetUserId();

        var result = await _appointmentService.GetAppointmentByIdAsync(userId!, id, cancellationToken);

        return result.IsSuccess ? Ok(result) : result.ToProblem();
    }

    [HttpGet]
    public async Task<IActionResult> GetUserAppointments([FromQuery] bool includePast = false, CancellationToken cancellationToken = default)
    {
        var userId = User.GetUserId();

        var result = await _appointmentService.GetUserAppointmentsAsync(userId!, includePast, cancellationToken);

        return result.IsSuccess ? Ok(result) : result.ToProblem();
    }

    [HttpGet("doctor/{doctorId}")]
    public async Task<IActionResult> GetDoctorAppointments(string doctorId, [FromQuery] DateTime? date = null, CancellationToken cancellationToken = default)
    {
        var result = await _appointmentService.GetDoctorAppointmentsAsync(doctorId, date, cancellationToken);

        return result.IsSuccess ? Ok(result) : result.ToProblem();
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateAppointment(int id, [FromBody] UpdateAppointmentRequest request, CancellationToken cancellationToken)
    {
        var userId = User.GetUserId();

        var result = await _appointmentService.UpdateAppointmentAsync(userId!, id, request, cancellationToken);

        return result.IsSuccess ? Ok(result) : result.ToProblem();
    }

    [HttpPost("{id}/cancel")]
    public async Task<IActionResult> CancelAppointment(int id, [FromBody] string cancellationReason, CancellationToken cancellationToken)
    {
        var userId = User.GetUserId();

        var result = await _appointmentService.CancelAppointmentAsync(userId!, id, cancellationReason, cancellationToken);

        return result.IsSuccess ? Ok(result) : result.ToProblem();
    }

    [HttpGet("timeslots/{doctorId}")]
    public async Task<IActionResult> GetAvailableTimeSlots(string doctorId, [FromQuery] DateTime date, CancellationToken cancellationToken)
    {
        var result = await _appointmentService.GetDoctorAvailableTimeSlotsAsync(doctorId, date, cancellationToken);

        return result.IsSuccess ? Ok(result) : result.ToProblem();
    }

    [HttpGet("formatted-timeslots/{doctorId}")]
    public async Task<IActionResult> GetFormattedTimeSlots(string doctorId, [FromQuery] DateTime date, CancellationToken cancellationToken)
    {
        var result = await _appointmentService.GetFormattedAvailableSlotsAsync(doctorId, date, cancellationToken);

        return result.IsSuccess ? Ok(result) : result.ToProblem();
    }

    [HttpGet("doctor/{doctorId}/stats")]
    public async Task<IActionResult> GetDoctorStats(string doctorId, CancellationToken cancellationToken)
    {
        var result = await _appointmentService.GetDoctorAppointmentStatsAsync(doctorId, cancellationToken);

        return result.IsSuccess ? Ok(result) : result.ToProblem();
    }

    [HttpPost("feedback")]
    public async Task<IActionResult> SubmitFeedback([FromBody] FeedbackRequest request, CancellationToken cancellationToken)
    {
        var userId = User.GetUserId();
        var result = await _appointmentService.SubmitFeedbackAsync(request, userId!);
        return result.IsSuccess ? Ok(result) : result.ToProblem();
    }

    [HttpGet("feedbacks")]
    public async Task<IActionResult> GetFeedbacks()
    {
        var result = await _appointmentService.GetFeedbacksAsync();
        return result.IsSuccess ? Ok(result) : result.ToProblem();
    }

    [HttpPost("report")]
    public async Task<IActionResult> WriteReport([FromBody] AppointmentReportRequest request, CancellationToken cancellationToken)
    {
        var userId = User.GetUserId();
        var result = await _appointmentService.WriteReportAsync(userId!, request, cancellationToken);
        return result.IsSuccess ? Ok(result) : result.ToProblem();
    }

}
