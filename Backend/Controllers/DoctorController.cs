using Backend.DTO;
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
        [Authorize(Roles = "Doctor")]
        public IActionResult GetDetailsUsingJWTToken()
        {

            if (ModelState.IsValid)
            {
                string? UserName = User.FindFirst("UserName")?.Value;

                if (UserName != null)
                {
                    Doctor? Doctor = _doctorRepository.GetDetailsByUserName(UserName);
                    if (Doctor != null)
                    {
                        DoctorDetailsDto DoctorDetails = new DoctorDetailsDto
                        {
                            Username = UserName,
                            Age = Doctor.Age,
                            ClinicAdress = Doctor.ClinicAdress,
                            ExperienceYears = Doctor.ExperienceYears,
                            FirstName = Doctor.FirstName,
                            LastName = Doctor.LastName,
                            Gender = Doctor.Gender,
                            ImageData = Doctor.ImageData


                        };
                        return Ok(new { Message = "data retrieved successfully", DoctorDetails });
                    }
                }
            }
            return BadRequest();
        }

        [HttpGet("details/{UserName}")]
        public IActionResult GetDetailsUsingUserName(string UserName)
        {

            if (ModelState.IsValid)
            {

                if (UserName != null)
                {
                    Doctor? Doctor = _doctorRepository.GetDetailsByUserName(UserName);
                    if (Doctor != null)
                    {
                        DoctorDetailsDto DoctorDetails=new DoctorDetailsDto {
                           Username = UserName,
                           Age = Doctor.Age,
                           ClinicAdress = Doctor.ClinicAdress,
                           ExperienceYears= Doctor.ExperienceYears, 
                           FirstName = Doctor.FirstName,
                           LastName = Doctor.LastName,  
                           Gender = Doctor.Gender,
                           ImageData=Doctor.ImageData                        
                        };

                        return Ok(new { Message = "data retrieved successfully", DoctorDetails });
                    }
                }



            }
            return BadRequest();
        }
    }
}
