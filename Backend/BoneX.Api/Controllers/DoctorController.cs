using BoneX.Api.Contracts.Doctor;
using BoneX.Api.Extensions;
using Microsoft.AspNetCore.Authorization;

namespace BoneX.Api.Controllers;
[Route("[controller]")]
[ApiController]
public class DoctorController(IDoctorService doctorService) : ControllerBase
{
    private readonly IDoctorService _doctorService = doctorService;

    [HttpPost("register")]
    public async Task<IActionResult> RegisterDoctor([FromForm] DoctorRegisterRequest request, CancellationToken cancellationToken)
    {
        var result = await _doctorService.RegisterDoctorAsync(request, cancellationToken);
        return result.IsSuccess ? Ok() : result.ToProblem();
    }

    [HttpPut("profile")]
    //[Authorize(Roles = UserRoles.Doctor)]
    public async Task<IActionResult> UpdateProfile([FromForm] UpdateDoctorProfileRequest request, CancellationToken cancellationToken)
    {
        var userId = User.GetUserId();

        if (userId == null)
            return Unauthorized();

        var result = await _doctorService.UpdateDoctorProfileAsync(userId, request, cancellationToken);


        return result.IsSuccess ? Ok(new { Message = "Profile updated successfully." }) : result.ToProblem();

        //if (result.IsFailure)
        //    return BadRequest(result.Error);

        //return Ok();
    }

    [HttpGet("doctors")]
    public async Task<IActionResult> GetAllDoctors()
    {
        var result = await _doctorService.GetAllDoctorsAsync();

        return result.IsSuccess ? Ok(result.Value) : result.ToProblem();
    }

    [HttpGet("profile")]
    //[Authorize(Roles = UserRoles.Doctor)]
    public async Task<IActionResult> GetProfile(CancellationToken cancellationToken)
    {
        var userId = User.GetUserId();
        if (userId == null)
            return Unauthorized();

        var result = await _doctorService.GetDoctorProfileAsync(userId, cancellationToken);

        return result.IsSuccess ? Ok(result.Value) : result.ToProblem();

        //if (result.IsFailure)
        //    return BadRequest(result.Error);

        //return Ok(result.Value);
    }

    [HttpGet("profile/{doctorId}")]
    [Authorize]
    public async Task<IActionResult> GetDoctorProfile(string doctorId, CancellationToken cancellationToken)
    {
        var result = await _doctorService.GetDoctorProfileAsync(doctorId, cancellationToken);

        if (result.IsFailure)
            return BadRequest(result.Error);

        return Ok(result.Value);
    }

    [HttpGet("recommended")]
    public async Task<IActionResult> GetRecommendedDoctors(CancellationToken cancellationToken)
    {
        var result = await _doctorService.GetRecommendedDoctorsAsync(cancellationToken);
        if (result.IsFailure)
            return BadRequest(result.Error);
        return Ok(result.Value);
    }

    //[HttpGet("statistics")]
    ////[Authorize(Roles = UserRoles.Doctor)]
    //public async Task<IActionResult> GetStatistics(CancellationToken cancellationToken)
    //{
    //    var userId = User.GetUserId();
    //    if (userId == null)
    //        return Unauthorized();

    //    var result = await _doctorService.GetDoctorStatisticsAsync(userId, cancellationToken);

    //    return result.IsSuccess ? Ok(result.Value) : result.ToProblem();

    //    //if (result.IsFailure)
    //    //    return BadRequest(result.Error);

    //    //return Ok(result.Value);
    //}

    //[HttpGet("patients")]
    //[Authorize(Roles = UserRoles.Doctor)]
    //public async Task<IActionResult> GetPatients(CancellationToken cancellationToken)
    //{
    //    var userId = User.GetUserId();
    //    if (userId == null)
    //        return Unauthorized();

    //    var result = await _doctorService.GetDoctorPatientsAsync(userId, cancellationToken);

    //    if (result.IsFailure)
    //        return BadRequest(result.Error);

    //    return Ok(result.Value);
    //}


}
