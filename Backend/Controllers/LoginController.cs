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
        public async Task<IActionResult> Login([FromBody] RegisterPatientDto model)
        {
            
            if (ModelState.IsValid)
            {
                var user = await _userManager.FindByNameAsync(model.UserName);
                if (user != null)
                {
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
                        return Ok(new { message = "Login successful" , role = role[0] });

                    }

                }
            }

            return Unauthorized(new { message = "Invalid credentials" });

        }
    }
}
