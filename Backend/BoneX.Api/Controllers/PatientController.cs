using BoneX.Api.Contracts.Patient;
using BoneX.Api.Extensions;
using Microsoft.AspNetCore.Authorization;

namespace BoneX.Api.Controllers;
[Route("[controller]")]
[ApiController]
public class PatientController(IPatientService patientService, IHttpContextAccessor httpContextAccessor, IRecommenderService recommenderService) : ControllerBase
{
    private readonly IPatientService _patientService = patientService;
    private readonly IHttpContextAccessor _httpContextAccessor = httpContextAccessor;
    private readonly IRecommenderService _recommenderService = recommenderService;

    [HttpPost("register")]
    public async Task<IActionResult> RegisterPatient([FromForm] PatientRegisterRequest request, CancellationToken cancellationToken)
    {
        var result = await _patientService.RegisterPatientAsync(request, cancellationToken);
        return result.IsSuccess ? Ok() : result.ToProblem();
    }

    [HttpGet("profile")]
    public async Task<IActionResult> GetPatientProfile(CancellationToken cancellationToken)
    {
        var patientId = _httpContextAccessor.HttpContext?.User.GetUserId();

        if (patientId == null)
            return Unauthorized();

        var result = await _patientService.GetPatientProfileAsync(patientId, cancellationToken);
        return result.IsSuccess ? Ok(result.Value) : result.ToProblem();
    }

    [HttpPut("profile")]
    public async Task<IActionResult> UpdatePatientProfile([FromForm] PatientUpdateRequest request, CancellationToken cancellationToken)
    {
        var patientId = _httpContextAccessor.HttpContext?.User.GetUserId();

        if (patientId == null)
            return Unauthorized();

        var result = await _patientService.UpdatePatientProfileAsync(patientId, request, cancellationToken);
        return result.IsSuccess ? Ok() : result.ToProblem();
    }

    [HttpGet("location")]
    public async Task<IActionResult> FetchLocation(CancellationToken cancellationToken)
    {
        var patientId = _httpContextAccessor.HttpContext?.User.GetUserId();
        if (patientId == null)
            return Unauthorized();
        var result = await _patientService.FetchLocation(patientId, cancellationToken);
        return result.IsSuccess ? Ok(result.Value) : result.ToProblem();
    }

    [HttpGet("doctor-recommendations")]
    public async Task<IActionResult> GetDoctorRecommendations(CancellationToken cancellationToken)
    {
        var patientId = _httpContextAccessor.HttpContext?.User.GetUserId();
        if (patientId == null)
            return Unauthorized();

        var result = await _patientService.GetDoctorRecommendations(patientId, cancellationToken);
        return result.IsSuccess ? Ok(result.Value) : result.ToProblem();
    }

    [HttpPost("get-recommendations")]
    public async Task<IActionResult> GetRecommendations([FromForm] string user_location)
    {
        var result = await _recommenderService.GetRecommendationsAsync(user_location);
        return Ok(result);
    }
}
