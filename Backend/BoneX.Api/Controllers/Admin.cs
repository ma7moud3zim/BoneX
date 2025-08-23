using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BoneX.Api.Controllers;
[Route("api/[controller]")]
[ApiController]
public class Admin(IAdmin admin) : ControllerBase
{
    private readonly IAdmin _admin = admin;

    [HttpGet("doctors")]
    public async Task<IActionResult> GetAllDoctorsAsync(CancellationToken cancellationToken)
    {
        var result = await _admin.GetAllDoctorsAsync();
        return result.IsSuccess ? Ok(result.Value) : BadRequest(result.Error);
    }

    [HttpPost("doctors/{doctorId}/status")]
    public async Task<IActionResult> ChangeDoctorStatusAsync(string doctorId, [FromBody] bool isActive, CancellationToken cancellationToken)
    {
        var result = await _admin.ChangeDoctorStatusAsync(doctorId, isActive);
        return result.IsSuccess ? Ok() : BadRequest(result.Error);
    }
}
