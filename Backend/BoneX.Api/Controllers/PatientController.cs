using BoneX.Api.Contracts.Patient;

namespace BoneX.Api.Controllers;
[Route("[controller]")]
[ApiController]
public class PatientController(IPatientService patientService) : ControllerBase
{
    private readonly IPatientService _patientService = patientService;

    [HttpPost("register")]
    public async Task<IActionResult> RegisterPatient([FromBody] PatientRegisterRequest request, CancellationToken cancellationToken)
    {
        var result = await _patientService.RegisterPatientAsync(request, cancellationToken);
        return result.IsSuccess ? Ok() : result.ToProblem();
    }
}
