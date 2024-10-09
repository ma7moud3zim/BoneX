using Backend.DTO;
using Backend.Interfaces;
using Backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]

    [Authorize(Roles = "Patient")]
    public class PatientController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ITokenService _tokenService;
        private readonly IPatientRepository _PatientRepository;

        public PatientController(UserManager<ApplicationUser> userManager, ITokenService tokenService, IPatientRepository PatientRepository)
        {
            _userManager = userManager;
            _tokenService = tokenService;
            _PatientRepository = PatientRepository;
        }

        [HttpGet("details")]
        public IActionResult GetDetailsUsingJWTToken()
        {

            if (ModelState.IsValid)
            {
               string? UserName = User.FindFirst("UserName")?.Value;

                if(UserName != null) {
                    Patient? patient = _PatientRepository.GetDetailsByUserName(UserName);  
                    if (patient != null)
                    {
                        return Ok(new { Message = "data retrieved successfully", patient });
                    } 
                }
                


            }
            return BadRequest();    
        }




    }
}
