using Backend.Interfaces;
using Backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Doctor")]
    public class DoctorController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ITokenService _tokenService;
        private readonly IAdminRepository _AdminRepository;
        private readonly IDoctorRepository _doctorRepository;

        public DoctorController(UserManager<ApplicationUser> userManager, ITokenService tokenService, IAdminRepository AdminRepository, IDoctorRepository doctorRepository)
        {
            _userManager = userManager;
            _tokenService = tokenService;
            _doctorRepository = doctorRepository;
        }
        [HttpGet("details")]
        public IActionResult GetDetailsByUserName()
        {

            if (ModelState.IsValid)
            {
                string? UserName = User.FindFirst("UserName")?.Value;

                if (UserName != null)
                {
                    Doctor? Doctor = _doctorRepository.GetDetailsByUserName(UserName);
                    if (Doctor != null)
                    {
                        return Ok(new { Message = "data retrieved successfully", Doctor });
                    }
                }



            }
            return BadRequest();
        }


    }
}
