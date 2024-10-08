using Backend.DTO;
using Backend.Interfaces;
using Backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PatientAccountController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ITokenService _tokenService;
        private IPatientRepository _patientRepository;
        public PatientAccountController(UserManager<ApplicationUser> userManager, ITokenService tokenService,IPatientRepository patientRepository)
        {
            _userManager = userManager;
            _tokenService = tokenService;
            _patientRepository = patientRepository;
        }


        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterPatientDto model)
        {
            if (ModelState.IsValid)
            {
             
                var user = new ApplicationUser { UserName = model.UserName, Email = model.Email,PhoneNumber=model.Phone};
                var result = await _userManager.CreateAsync(user, model.Password);
                if (result.Succeeded)
                {
                    Patient patient = new Patient()
                    {
                        Username = model.UserName,
                        Age = model.age,
                        AccountStatus = AccountStatus.Active,
                        Role = Role.Patient,
                        FirstName = model.FirstName,
                        LastName = model.LastName
                    };

                    try
                    {  

                        _patientRepository.Insert(patient);
                    }
                    catch (Exception ex) { 
                          
                        await _userManager.DeleteAsync(user);
                        
                        return BadRequest(ex.Message);
                    }

                    await _userManager.AddToRoleAsync(user, "Patient");

                    var token = await _tokenService.CreateToken(user);


                    // Set the token as an HTTP-only cookie
                    var cookieOptions = new CookieOptions
                    {
                        HttpOnly = true,
                        Secure = true,  // Set to true if you're using HTTPS
                        SameSite = SameSiteMode.None, // Required for cross-origin requests
                        Path = "/",
                        Expires = DateTime.Now.AddHours(1)  // Cookie expiration time
                    };

                    Response.Cookies.Append("AuthToken", token, cookieOptions);

                  

                    return Ok(new { message = "register successful" });
                }
                else
                {
                    return BadRequest(result.Errors);
                }
            }
            return BadRequest("Invalid model");
        }
       


    }
}
