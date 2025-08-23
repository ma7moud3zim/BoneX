using BoneX.Api.Contracts.Authentication;
using BoneX.Api.Helper;
using Microsoft.AspNetCore.Identity.UI.Services;

namespace BoneX.Api.Controllers;

[Route("[controller]")]
[ApiController]
public class AuthController(IAuthService authService, ApplicationDbContext context, ILogger<AuthController> logger, IEmailSender emailSender) : ControllerBase
{
    private readonly IAuthService _authService = authService;
    private readonly ApplicationDbContext _context = context;
    private readonly ILogger<AuthController> _logger = logger;
    private readonly IEmailSender _emailSender = emailSender;

    [HttpPost("")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request, CancellationToken cancellationToken)
    {
        var authResult = await _authService.GetTokenAsync(request.Email, request.Password, cancellationToken);

        return authResult.IsSuccess ? Ok(authResult.Value) : authResult.ToProblem();
    }

    [HttpPost("refresh")]
    public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenRequest request, CancellationToken cancellationToken)
    {
        var authResult = await _authService.GetRefreshTokenAsync(request.Token, request.RefreshToken, cancellationToken);

        return authResult.IsSuccess ? Ok(authResult.Value) : authResult.ToProblem();
    }

    [HttpPut("revoke-refresh-token")]
    public async Task<IActionResult> RevokeRefreshToken([FromBody] RefreshTokenRequest request, CancellationToken cancellationToken)
    {
        var result = await _authService.RevokeRefreshTokenAsync(request.Token, request.RefreshToken, cancellationToken);

        return result.IsSuccess ? Ok() : result.ToProblem();
    }

    //[HttpPost("register")]
    //public async Task<IActionResult> Register([FromForm] RegisterRequest request, CancellationToken cancellationToken)
    //{
    //    var result = await _authService.RegisterAsync(request, cancellationToken);
    //    return result.IsSuccess ? Ok() : result.ToProblem();
    //}

    [HttpPost("confirm-email")]
    public async Task<IActionResult> ComfirmEmail([FromBody] ConfirmEmailRequest request)
    {
        var result = await _authService.ConfirmEmailAsync(request);
        return result.IsSuccess ? Ok() : result.ToProblem();
    }

    [HttpPost("resend-confirm-email")]
    public async Task<IActionResult> ResendConfirmaitonEmail([FromBody] ResendConfirmationEmailRequest request)
    {
        var result = await _authService.ResendConfirmationEmailAsync(request);
        return result.IsSuccess ? Ok() : result.ToProblem();
    }

    [HttpPost("forget-password")]
    public async Task<IActionResult> ForgetPassword([FromBody] ForgetPasswordRequest request)
    {
        var result = await _authService.SendResetPasswordCodeAsync(request.Email);

        return result.IsSuccess ? Ok() : result.ToProblem();
    }

    [HttpPost("reset-password")]
    public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest request)
    {
        var result = await _authService.ResetPasswordAsync(request);

        return result.IsSuccess ? Ok() : result.ToProblem();
    }

    [HttpGet("test-db")]
    public IActionResult TestDb()
    {
        try
        {
            _context.Database.OpenConnection();
            _context.Database.CloseConnection();
            return Ok("Database connected!");
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Database connection failed: {ex.Message}");
        }
    }

    [HttpPost("test-email")]
    public async Task<IActionResult> TestEmail([FromBody] TestEmailRequest request)
    {
        //try
        //{
        //    _logger.LogInformation("Attempting to send test email to {Email}", request.Email);

        //    await _emailSender.SendEmailAsync(request.Email, "Test Email", "This is a test email from BoneX.");

        //    _logger.LogInformation("Test email sent successfully to {Email}", request.Email);

        //    return Ok("Test email sent successfully!");
        //}
        //catch (Exception ex)
        //{
        //    _logger.LogError(ex, "Failed to send test email to {Email}", request.Email);
        //    return StatusCode(500, $"Failed to send test email: {ex.Message}");
        //}

        try
        {
            _logger.LogInformation("Attempting to send test email to {Email}", request.Email);

            var emailBody = EmailBodyBuilder.GenerateEmailBody("TestEmail", new Dictionary<string, string>
        {
            { "{{name}}", "Test User" },
            { "{{action_url}}", "https://bonex.tech/test-link" }
        });

            await _emailSender.SendEmailAsync(request.Email, "BoneX - Test Email", emailBody);

            _logger.LogInformation("Test email sent successfully to {Email}", request.Email);

            return Ok("Test email sent successfully!");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send test email to {Email}", request.Email);
            return StatusCode(500, $"Failed to send test email: {ex.Message}");
        }
    }
    public class TestEmailRequest
    {
        public string Email { get; set; } = null!;
    }
}
