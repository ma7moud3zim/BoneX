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
                    Patient? Patient = _PatientRepository.GetDetailsByUserName(UserName);
                    if (Patient != null)
                    {
                        PatientFullDetailsDto PatientDetails = new PatientFullDetailsDto
                        {
                            Username = UserName,
                            Age = Patient.Age,
                            FirstName = Patient.FirstName,
                            LastName = Patient.LastName,
                            Gender = Patient.Gender,
                            ImageData = Patient.ImageData,
                            DateOfBirth = Patient.DateOfBirth,
                            MedicalHistory=Patient.MedicalHistory,  
                        };

                        return Ok(new { Message = "data retrieved successfully", PatientDetails });
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
                    Patient? Patient = _PatientRepository.GetDetailsByUserName(UserName);
                    if (Patient != null)
                    {
                        PatientDetailsDto PatientDetails = new PatientDetailsDto
                        {
                            Username = UserName,
                            Age = Patient.Age,
                            FirstName = Patient.FirstName,
                            LastName = Patient.LastName,
                            Gender = Patient.Gender,
                            ImageData = Patient.ImageData
                        };

                        return Ok(new { Message = "data retrieved successfully", PatientDetails });
                    }
                }



            }
            return BadRequest();
        }

        [HttpPut("UpdatePatientDetails")]
      //  [Authorize] 
        public async Task<IActionResult> UpdatePatientDetails([FromBody] UpdatePatientDto updatePatientDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _PatientRepository.UpdatePatientDetailsAsync(updatePatientDto);
            if (result is null)
                return NotFound(new { message = "Patient not found" });

            return Ok(new { message = "Patient updated successfully" });
        }



    }
}
