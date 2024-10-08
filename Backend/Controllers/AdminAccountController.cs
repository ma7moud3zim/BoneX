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
    public class AdminAccountController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ITokenService _tokenService;
        private IPatientRepository _patientRepository;
        public AdminAccountController(UserManager<ApplicationUser> userManager, ITokenService tokenService, IPatientRepository patientRepository)
        {
            _userManager = userManager;
            _tokenService = tokenService;
            _patientRepository = patientRepository;
        }
        
    }
}
