using Backend.DTO;
using Backend.Interfaces;
using Backend.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ITokenService _tokenService;
        private IPatientRepository _patientRepository;
        public LoginController(UserManager<ApplicationUser> userManager, ITokenService tokenService, IPatientRepository patientRepository)
        {
            _userManager = userManager;
            _tokenService = tokenService;
            _patientRepository = patientRepository;
        }



        [HttpPost]
        public async Task<IActionResult> Login([FromBody] LoginDto model)
        {
            
            if (ModelState.IsValid)
            {

                ApplicationUser? user =null;
                if (model.UserName!=null)
                 user = await _userManager.FindByNameAsync(model.UserName);

                if (model.Email != null)
                    user = await _userManager.FindByEmailAsync(model.Email);

                if (user != null)
                {
                    if(user.AccountStatus == AccountStatus.Banned)
                    {
                        return Forbid();
                    }
                    if (await _userManager.CheckPasswordAsync(user, model.Password))
                    {
                        var token = await _tokenService.CreateToken(user);
                        var cookieOptions = new CookieOptions
                        {
                            HttpOnly = true,
                            Secure = true,  // Set to true if you're using HTTPS
                            SameSite = SameSiteMode.None, // Required for cross-origin requests
                            Path = "/",
                            Expires = DateTime.Now.AddHours(1)  // Cookie expiration time
                        };


                        Response.Cookies.Append("AuthToken", token, cookieOptions);

                        // Generate a JWT or any other token

                        var role = await _userManager.GetRolesAsync(user);

                        var patient = _patientRepository.GetDetailsByUserName(user.UserName);
                        PatientDetailsDto patientdto = new PatientDetailsDto()
                        {
                            Gender = patient.Gender,
                            Age = patient.Age,
                            UserName = patient.Username,
                            DateOfBirth = patient.DateOfBirth,
                            Email = user.Email,
                            PhoneNumber = user.PhoneNumber

                        };
                        return Ok(new { message = "Login successful" , role = role[0],User=patientdto});

                    }

                }
            }

            return Unauthorized(new { message = "Invalid credentials" });

        }
    }
}
