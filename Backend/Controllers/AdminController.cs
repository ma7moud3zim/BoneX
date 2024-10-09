using Backend.DTO;
using Backend.Interfaces;
using Backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "MainAdmin,Admin")]
    public class AdminController : ControllerBase
    {

        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ITokenService _tokenService;
        private readonly IAdminRepository _AdminRepository;
        private readonly IDoctorRepository _doctorRepository;

        public AdminController(UserManager<ApplicationUser> userManager, ITokenService tokenService, IAdminRepository AdminRepository,IDoctorRepository doctorRepository)
        {
            _userManager = userManager;
            _tokenService = tokenService;
            _AdminRepository = AdminRepository;
            _doctorRepository = doctorRepository;
        }









        [HttpPost("RegisterDoctor")]
        public async Task<IActionResult> RegisterDoctor([FromBody] RegisterDoctorDto model)
        {
            if (ModelState.IsValid)
            {
                var user = new ApplicationUser { UserName = model.UserName, Email = model.Email, PhoneNumber = model.Phone };
                var result = await _userManager.CreateAsync(user, model.Password);
                if (result.Succeeded)
                {

                    Doctor Doctor = new Doctor()
                    {
                        Username = model.UserName,
                        Age = model.Age,
                        AccountStatus = AccountStatus.Active,
                        Role = Role.Admin,
                        FirstName = model.FirstName,
                        LastName = model.LastName,
                        Gender = model.Gender,
                        ClinicAdress = model.ClinicAdress,
                        ExperienceYears = model.ExperienceYears,              

                    };

                    try
                    {
                        _doctorRepository.Insert(Doctor);
                        await _userManager.AddToRoleAsync(user, "Doctor");
                    }
                    catch (Exception ex)
                    {
                        await _userManager.DeleteAsync(user);
                        return BadRequest(ex.Message);

                    }


                    return Ok(new { message = "Account Created" });

                }


            }

            return BadRequest();
        }
    }
}
