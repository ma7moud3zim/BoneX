using BoneX.Api.Contracts.Authentication;
using BoneX.Api.Errors;
using BoneX.Api.Helper;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.AspNetCore.WebUtilities;
using System.Security.Cryptography;
using System.Text;

namespace BoneX.Api.Services;

public class AuthService(
    UserManager<ApplicationUser> userManager,
    SignInManager<ApplicationUser> signInManager,
    IJwtProvider jwtProvider,
    ILogger<AuthService> logger,
    IEmailSender emailSender,
    IHttpContextAccessor httpContextAccessor) : IAuthService
{
    private readonly UserManager<ApplicationUser> _userManager = userManager;
    private readonly SignInManager<ApplicationUser> _signInManager = signInManager;
    private readonly IJwtProvider _jwtProvider = jwtProvider;
    private readonly ILogger<AuthService> _logger = logger;
    private readonly IEmailSender _emailSender = emailSender;
    private readonly IHttpContextAccessor _httpContextAccessor = httpContextAccessor;
    private readonly int _refreshTokenExpiryDays = 14;

    public async Task<Result<AuthResponse>> GetTokenAsync(string email, string password, CancellationToken cancellationToken = default)
    {
        // check user exists?
        if (await _userManager.FindByEmailAsync(email) is not { } user)
            return Result.Failure<AuthResponse>(UserErrors.InvalidCredentials);

        // check correct password 
        var result = await _signInManager.PasswordSignInAsync(user, password, false, false);

        //if(!user.active)
        //    return Result.Failure<AuthResponse>(UserErrors.AccountDeactivated);

        if (result.Succeeded)
        {
            // generate Jwt & refresh tokens
            var (token, expiresIn) = _jwtProvider.GenerateJwtToken(user);
            var refreshToken = GenerateRefreshToken();
            var refreshTokenExiration = DateTime.UtcNow.AddDays(_refreshTokenExpiryDays);

            // save to database
            user.RefreshTokens.Add(new RefreshToken
            {
                Token = refreshToken,
                ExpiresOn = refreshTokenExiration
            });
            await _userManager.UpdateAsync(user);

            var response = new AuthResponse(user.Id, user.Email, user.FirstName, user.LastName,user.ProfilePicture, user.Gender, user.Role, token, expiresIn, refreshToken, refreshTokenExiration);

            return Result.Success(response);
        }
        return Result.Failure<AuthResponse>(result.IsNotAllowed ? UserErrors.EmailNotConfirmed : UserErrors.InvalidCredentials);
    }

    public async Task<Result<AuthResponse>> GetRefreshTokenAsync(string token, string refreshToken, CancellationToken cancellationToken = default)
    {
        var userId = _jwtProvider.ValidateToken(token);

        if (userId is null)
            return Result.Failure<AuthResponse>(UserErrors.InvalidJwtToken);

        var user = await _userManager.FindByIdAsync(userId);

        if (user is null)
            return Result.Failure<AuthResponse>(UserErrors.InvalidJwtToken);

        var userRefreshToken = user.RefreshTokens.SingleOrDefault(x => x.Token == refreshToken && x.IsActive);

        if (userRefreshToken is null)
            return Result.Failure<AuthResponse>(UserErrors.InvalidRefreshToken);

        userRefreshToken.RevokeOn = DateTime.UtcNow;

        // generate new Jwt token
        var (newToken, expiresIn) = _jwtProvider.GenerateJwtToken(user);

        //generate new refresh token
        var newRefreshToken = GenerateRefreshToken();
        var refreshTokenExiration = DateTime.UtcNow.AddDays(_refreshTokenExpiryDays);

        // save to database
        user.RefreshTokens.Add(new RefreshToken
        {
            Token = newRefreshToken,
            ExpiresOn = refreshTokenExiration
        });
        await _userManager.UpdateAsync(user);

        var response = new AuthResponse(user.Id, user.Email, user.FirstName, user.LastName,user.ProfilePicture, user.Gender, user.Role, newToken, expiresIn, newRefreshToken, refreshTokenExiration);

        return Result.Success(response);
    }

    public async Task<Result> RevokeRefreshTokenAsync(string token, string refreshToken, CancellationToken cancellationToken = default)
    {
        var userId = _jwtProvider.ValidateToken(token);

        if (userId is null)
            return Result.Failure(UserErrors.InvalidJwtToken);

        var user = await _userManager.FindByIdAsync(userId);

        if (user is null)
            return Result.Failure(UserErrors.InvalidJwtToken);

        var userRefreshToken = user.RefreshTokens.SingleOrDefault(x => x.Token == refreshToken && x.IsActive);

        if (userRefreshToken is null)
            return Result.Failure(UserErrors.InvalidRefreshToken);

        userRefreshToken.RevokeOn = DateTime.UtcNow;

        await _userManager.UpdateAsync(user);

        return Result.Success();
    }
    public async Task<Result> ConfirmEmailAsync(ConfirmEmailRequest request)
    {
        if (await _userManager.FindByIdAsync(request.UserId) is not { } user)
            return Result.Failure(UserErrors.InvalidCode);

        //if(user.EmailConfirmed)
        //    return Result.Failure(UserErrors.DuplicatedConfirmation);

        var code = request.Code;

        try
        {
            code = Encoding.UTF8.GetString(WebEncoders.Base64UrlDecode(code));
        }
        catch (FormatException)
        {
            return Result.Failure(UserErrors.InvalidCode);
        }

        var result = await _userManager.ConfirmEmailAsync(user, code);

        if (result.Succeeded)
            return Result.Success();

        var error = result.Errors.First();

        return Result.Failure(new Error(error.Code, error.Description, StatusCodes.Status400BadRequest));
    }

    public async Task<Result> ResendConfirmationEmailAsync([FromBody] ResendConfirmationEmailRequest request)
    {
        if (await _userManager.FindByEmailAsync(request.Email) is not { } user)
            return Result.Success(); // distract user from knowing if the email exists

        //if (user.EmailConfirmed)
        //    return Result.Failure(UserErrors.DuplicatedConfirmation);

        var code = await _userManager.GenerateEmailConfirmationTokenAsync(user);
        code = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(code));

        _logger.LogInformation("Confirmation code: {code}", code);

        // send email confirmation
        await SendConfirmationEmail(user, code);

        return Result.Success();
    }

    public async Task<Result> SendResetPasswordCodeAsync(string email)
    {
        if (await _userManager.FindByEmailAsync(email) is not { } user)
            return Result.Success();

        //if (!user.EmailConfirmed)
        //    return Result.Failure(UserErrors.EmailNotConfirmed);

        var code = await _userManager.GeneratePasswordResetTokenAsync(user);
        code = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(code));

        _logger.LogInformation("Reset code: {code}", code);

        // send email confirmation
        await SendResetPasswordEmail(user, code);
        return Result.Success();

    }

    public async Task<Result> ResetPasswordAsync(ResetPasswordRequest request)
    {
        var user = await _userManager.FindByEmailAsync(request.Email);

        if (user is null /* || !user.EmailConfirmed*/ )
            return Result.Failure(UserErrors.InvalidCode);

        IdentityResult result;

        try
        {
            var code = Encoding.UTF8.GetString(WebEncoders.Base64UrlDecode(request.Code));
            result = await _userManager.ResetPasswordAsync(user, code, request.NewPassword);
        }
        catch (FormatException)
        {
            result = IdentityResult.Failed(_userManager.ErrorDescriber.InvalidToken());
        }

        if (result.Succeeded)
            return Result.Success();

        var error = result.Errors.First();

        return Result.Failure(new Error(error.Code, error.Description, StatusCodes.Status401Unauthorized));
    }


    private static string GenerateRefreshToken()
    {
        return Convert.ToBase64String(RandomNumberGenerator.GetBytes(64));
    }

    private async Task SendConfirmationEmail(ApplicationUser user, string code)
    {
        //var origin = _httpContextAccessor.HttpContext?.Request.Headers.Origin;

        //var emailBody = EmailBodyBuilder.GenerateEmailBody("EmailConfirmation", new Dictionary<string, string>
        //{
        //    { "{{name}}", user.FirstName },
        //    { "{{action_url}}", $"{origin}/auth/emailConfirmation?userId={user.Id}&code={code}" }
        //});

        //await _emailSender.SendEmailAsync(user.Email!, "BoneX: Email Confirmation", emailBody);

        var origin = _httpContextAccessor.HttpContext?.Request.Headers.Origin;

        var emailBody = EmailBodyBuilder.GenerateEmailBody("EmailConfirmation", new Dictionary<string, string>
    {
        { "{{name}}", user.FirstName },
        { "{{action_url}}", $"{origin}/auth/emailConfirmation?userId={user.Id}&code={code}" },
        { "{{support_email}}", "bonex.ai.team@gmail.com" }
    });

        await _emailSender.SendEmailAsync(user.Email!, "BoneX: Email Confirmation", emailBody);

    }

    private async Task SendResetPasswordEmail(ApplicationUser user, string code)
    {
        //var origin = _httpContextAccessor.HttpContext?.Request.Headers.Origin;

        //var emailBody = EmailBodyBuilder.GenerateEmailBody("ForgetPassword",
        //    new Dictionary<string, string>
        //    {
        //            {"{{name}}", user.FirstName }, // after origin/ frontend edit it(add his link) - ahmed magdy -
        //            { "{{action_url}}", $"{origin}/auth/forgetPassword?email={user.Email}&code={code}" }
        //    }
        //);

        //await _emailSender.SendEmailAsync(user.Email!, "BoneX: Change Password", emailBody);

        var origin = _httpContextAccessor.HttpContext?.Request.Headers.Origin;

        var emailBody = EmailBodyBuilder.GenerateEmailBody("ForgetPassword", new Dictionary<string, string>
    {
        { "{{name}}", user.FirstName },
        { "{{action_url}}", $"{origin}/auth/forgetPassword?email={user.Email}&code={code}" },
        { "{{support_email}}", "bonex.ai.team@gmail.com" }
    });

        await _emailSender.SendEmailAsync(user.Email!, "BoneX: Reset Password", emailBody);

    }



}
