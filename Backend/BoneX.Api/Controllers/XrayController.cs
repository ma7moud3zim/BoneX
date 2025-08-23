using BoneX.Api.Contracts.Xray;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BoneX.Api.Controllers;
[Route("[controller]")]
[Authorize]
[ApiController]
public class XrayController(IXrayService xrayService) : ControllerBase
{
    private readonly IXrayService _xrayService = xrayService;

    [HttpPost("upload")]
    //[Authorize(Roles = UserRoles.Patient)]
    public async Task<IActionResult> UploadXray([FromForm] UploadXrayRequest request)
    {
        var result = await _xrayService.UploadXrayAsync(request);

        return result.IsSuccess
            ? Ok(result.Value)
            : result.ToProblem();
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetXrayAnalysis(int id)
    {
        var result = await _xrayService.GetXrayAnalysisAsync(id);

        return result.IsSuccess
            ? Ok(result.Value)
            : result.ToProblem();
    }

    [HttpGet("patient")]
    //[Authorize(Roles = UserRoles.Patient)]
    public async Task<IActionResult> GetPatientXrays()
    {
        var result = await _xrayService.GetPatientXraysAsync();

        return result.IsSuccess
            ? Ok(result.Value)
            : result.ToProblem();
    }

    [HttpPost("review")]
    //[Authorize(Roles = UserRoles.Doctor)]
    public async Task<IActionResult> AddDoctorReview(AddDoctorReviewRequest request)
    {
        var result = await _xrayService.AddDoctorReviewAsync(request);

        return result.IsSuccess
            ? Ok()
            : result.ToProblem();
    }
}

