using BoneX.Api.Contracts.Doctor;

namespace BoneX.Api.Controllers;
[Route("[controller]")]
[ApiController]
public class DoctorController(IDoctorService doctorService) : ControllerBase
{
    private readonly IDoctorService _doctorService = doctorService;

    [HttpPost("register")]
    public async Task<IActionResult> RegisterDoctor([FromBody] DoctorRegisterRequest request, CancellationToken cancellationToken)
    {
        var result = await _doctorService.RegisterDoctorAsync(request, cancellationToken);
        return result.IsSuccess ? Ok() : result.ToProblem();
    }

}
