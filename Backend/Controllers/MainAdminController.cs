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
    [Authorize("MainAdmin")]
    public class MainAdminController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ITokenService _tokenService;
        private IPatientRepository _patientRepository;
        public MainAdminController(UserManager<ApplicationUser> userManager, ITokenService tokenService, IPatientRepository patientRepository)
        {
            _userManager = userManager;
            _tokenService = tokenService;
            _patientRepository = patientRepository;
        }

      //  [HttpPost("CreateAdminAccount")]
        //public async Task<IActionResult> CreateAdminAccount([FromBody] string Username)
        //{
          
        //}

    }
}
