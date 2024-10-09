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
    [Authorize(Roles = "MainAdmin")]
    public class MainAdminController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ITokenService _tokenService;
        private readonly IAdminRepository _AdminRepository;
        public MainAdminController(UserManager<ApplicationUser> userManager, ITokenService tokenService, IAdminRepository AdminRepository)
        {
            _userManager = userManager;
            _tokenService = tokenService;
            _AdminRepository=AdminRepository;   
        }

        [HttpPost("CreateAdminAccount")]
        public async Task<IActionResult> CreateAdminAccount([FromBody] RegisterAdminDto model)
        {
            if (ModelState.IsValid) {
                var user = new ApplicationUser { UserName = model.UserName, Email = model.Email, PhoneNumber = model.Phone };
                var result = await _userManager.CreateAsync(user, model.Password);
                if (result.Succeeded) {

                     Admin admin = new Admin()
                    {
                        Username = model.UserName,
                        Age = model.Age,
                        Role = Role.Admin,
                        FirstName = model.FirstName,
                        LastName = model.LastName,
                        Gender = model.Gender
                        
                    };
                  
                    try
                    {
                        _AdminRepository.Insert(admin);
                       
                        await _userManager.AddToRoleAsync(user, "Admin");
                     

                    }
                    catch (Exception ex) {
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
