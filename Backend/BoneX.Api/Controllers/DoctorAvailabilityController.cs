using BoneX.Api.Contracts.Doctor;
using BoneX.Api.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BoneX.Api.Controllers;
[Route("[controller]")]
[ApiController]
public class DoctorAvailabilityController(IDoctorAvailabilityService availabilityService) : ControllerBase
{
    private readonly IDoctorAvailabilityService _availabilityService = availabilityService;

    [HttpPost]
    public async Task<IActionResult> SetAvailability([FromBody] SetAvailabilityRequest request, CancellationToken cancellationToken)
    {
        var userId = User.GetUserId();

        var result = await _availabilityService.SetAvailabilityAsync(userId!, request, cancellationToken);

        return result.IsSuccess ? Ok(result) : result.ToProblem();
    }

    [HttpGet]
    public async Task<IActionResult> GetAvailability([FromQuery] string doctorId, CancellationToken cancellationToken)
    {
        var result = await _availabilityService.GetAvailabilityAsync(doctorId, cancellationToken);

        return result.IsSuccess ? Ok(result) : result.ToProblem();
    }

    [HttpGet("timeslots")]
    public async Task<IActionResult> GetAvailableTimeSlots([FromQuery] string doctorId, [FromQuery] DateTime date, CancellationToken cancellationToken)
    {
        var result = await _availabilityService.GetAvailableTimeSlotsAsync(doctorId, date, cancellationToken);

        return result.IsSuccess ? Ok(result) : result.ToProblem();
    }

}
