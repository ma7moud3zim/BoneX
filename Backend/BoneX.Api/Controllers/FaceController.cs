using BoneX.Api.Contracts.DoctorVerification;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BoneX.Api.Controllers;
[Route("[controller]")]
[ApiController]
public class FaceController : ControllerBase
{
    private readonly IFaceVerificationService _faceService;
    private readonly IWebHostEnvironment _env;

    public FaceController(IFaceVerificationService faceService, IWebHostEnvironment env)
    {
        _faceService = faceService;
        _env = env;
    }

    [HttpPost("verify")]
    public async Task<IActionResult> VerifyFace([FromForm] FaceVerificationRequest request)
    {
        if (request.Image1 == null || request.Image2 == null)
            return BadRequest("Both images are required.");

        var tempDir = Path.Combine(_env.ContentRootPath, "TempUploads");
        Directory.CreateDirectory(tempDir);

        var path1 = Path.Combine(tempDir, Path.GetRandomFileName() + Path.GetExtension(request.Image1.FileName));
        var path2 = Path.Combine(tempDir, Path.GetRandomFileName() + Path.GetExtension(request.Image2.FileName));

        using (var stream = new FileStream(path1, FileMode.Create))
            await request.Image1.CopyToAsync(stream);
        using (var stream = new FileStream(path2, FileMode.Create))
            await request.Image2.CopyToAsync(stream);

        var result = await _faceService.VerifyFacesAsync(path1, path2);

        System.IO.File.Delete(path1);
        System.IO.File.Delete(path2);

        if (result == null)
            return StatusCode(500, "Failed to verify faces.");

        return Ok(result);
    }

}
