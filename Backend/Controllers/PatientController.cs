using Backend.DTO;
using Backend.Interfaces;
using Backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

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

                if (UserName != null)
                {
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
                            MedicalHistory = Patient.MedicalHistory,
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

            // first i must know the username of the patient who is updating his details
            // to ensure that the patient is updating his own details not others

            var tokenUsername = User.FindFirst("UserName")?.Value;

            if (string.IsNullOrEmpty(tokenUsername))
                return Unauthorized("You must be logged in to update your details.");

            var result = await _PatientRepository.UpdatePatientDetailsAsync(tokenUsername, updatePatientDto);

            if (!result)
                return BadRequest("Failed to update patient details.");

            return Ok("Patient details updated successfully.");
        }


        [HttpPut("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto resetPasswordDto)
        {
            var tokenUsername = User.FindFirst("UserName")?.Value;

            if (string.IsNullOrEmpty(tokenUsername))
                return Unauthorized("You must be logged in to reset your password.");

            var result = await _PatientRepository.ResetPasswordAsync(tokenUsername, resetPasswordDto.CurrentPassword, resetPasswordDto.NewPassword);

            if (!result)
                return BadRequest("Failed to reset password.");

            return Ok("Password reset successfully.");

        }

    }
}
