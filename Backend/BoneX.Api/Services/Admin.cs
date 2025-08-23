using BoneX.Api.Contracts.Doctor;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI.Services;

namespace BoneX.Api.Services;

public class Admin(IDoctorService doctorService, 
    UserManager<Doctor> userManager,
    ILogger<Admin> logger,
    IHttpContextAccessor httpContextAccessor,
    ApplicationDbContext context) : IAdmin
{
    private readonly IDoctorService _doctorService = doctorService;
    private readonly UserManager<Doctor> _userManager = userManager;
    private readonly ILogger<Admin> _logger = logger;
    private readonly IHttpContextAccessor _httpContextAccessor = httpContextAccessor;
    private readonly ApplicationDbContext _context = context;


    // select doctors not active 
    public async Task<Result<List<DoctorListAdminResponse>>> GetAllDoctorsAsync()
    {
        // First get the doctors with base information
        var doctors = await _userManager.Users
            .Where(x => x.Role == UserRoles.Doctor)
            .ToListAsync();
        // Create the response list
        var response = doctors.Select(d =>
        {
            // Cast to Doctor type now that we're working with in-memory objects
            var doctor = d as Doctor;
            return new DoctorListAdminResponse(
                d.Id,
                $"{d.FirstName} {d.LastName}",
                d.active ? "Active" : "Inactive",
                doctor?.Speciality ?? string.Empty,
                doctor?.Brief ?? string.Empty,
                d.ProfilePicture ?? string.Empty
            );
        }).ToList();
        return Result.Success(response);
    }

    // change Inactive to Active
    public async Task<Result> ChangeDoctorStatusAsync(string doctorId, bool isActive)
    {
        var doctor = await _userManager.FindByIdAsync(doctorId);
        if (doctor is null)
        {
            return Result.Failure(new Error("notFound", "Notfound", StatusCodes.Status404NotFound));
        }
        doctor.active = isActive;
        var result = await _userManager.UpdateAsync(doctor);
        if (!result.Succeeded)
        {
            return Result.Failure(new Error("faild", "Notupdated", StatusCodes.Status404NotFound));
        }
        return Result.Success();
    }

    // actie all doctors

    public async Task<Result<List<DoctorListAdminResponse>>> GetAllActiveDoctorsAsync()
    {
        // First get the doctors with base information
        var doctors = await _userManager.Users
            .Where(x => x.Role == UserRoles.Doctor && x.active)
            .ToListAsync();

        // Create the response list
        var response = doctors.Select(d =>
        {
            // Cast to Doctor type now that we're working with in-memory objects
            var doctor = d as Doctor;
            return new DoctorListAdminResponse(
                d.Id,
                $"{d.FirstName} {d.LastName}",
                "Active",
                doctor?.Speciality ?? string.Empty,
                doctor?.Brief ?? string.Empty,
                d.ProfilePicture ?? string.Empty
            );
        }).ToList();

        return Result.Success(response);
    }



    //public async Task<Result<List<DoctorListAdminResponse>>> GetAllDoctorsAsync()
    //{

    //    var doctors = await _userManager.Users
    //        .Where(x => x.Role == UserRoles.Doctor )
    //        .ToListAsync();



    //    // Create the response list
    //    var response = doctors.Select(d => {
    //        // Cast to Doctor type now that we're working with in-memory objects
    //        var doctor = d as Doctor;



    //        return new DoctorListResponse(
    //            d.Id,
    //            $"{d.FirstName} {d.LastName}",
    //            doctor?.Speciality ?? string.Empty,
    //            doctor?.Brief ?? string.Empty,
    //            d.ProfilePicture ?? string.Empty
    //        );
    //    }).ToList();

    //    return Result.Success(response);


    //}
}
