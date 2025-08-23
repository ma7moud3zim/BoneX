using BoneX.Api.Contracts.Doctor;
using BoneX.Api.Contracts.Users;
using BoneX.Api.Errors;
using BoneX.Api.Helper;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.EntityFrameworkCore;
using NetTopologySuite.Geometries;
using System.Globalization;
using System.Text;

namespace BoneX.Api.Services;

public class DoctorService(
    UserManager<Doctor> userManager,
    ILogger<DoctorService> logger,
    IEmailSender emailSender,
    IHttpContextAccessor httpContextAccessor,
    IUserService userService, ApplicationDbContext context) : IDoctorService
{
    private readonly UserManager<Doctor> _userManager = userManager;
    private readonly ILogger<DoctorService> _logger = logger;
    private readonly IEmailSender _emailSender = emailSender;
    private readonly IHttpContextAccessor _httpContextAccessor = httpContextAccessor;
    private readonly IUserService _userService = userService;
    private readonly ApplicationDbContext _context = context;

    public async Task<Result> RegisterDoctorAsync(DoctorRegisterRequest request, CancellationToken cancellationToken = default)
    {
        if (await _userManager.Users.AnyAsync(x => x.Email == request.Email, cancellationToken))
            return Result.Failure(UserErrors.DuplicatedEmail);

        var doctor = new Doctor
        {
            FirstName = request.FirstName,
            LastName = request.LastName,
            Email = request.Email,
            UserName = request.Email,
            Gender = request.Gender,
            PhoneNumber = request.PhoneNumber,
            //ProfilePicture = request.ProfilePicture,
            Role = UserRoles.Doctor,
            active = false,
            DateOfBirth = request.DateOfBirth,
            Speciality = request.Speciality,
            Brief = request.Brief,
            UniversityName = request.UniversityName,
            GraduationYear = request.GraduationYear,
            //DegreeCertificate = request.DegreeCertificate,
            YearsOfExperience = request.YearsOfExperience,
            ConsultationHours = request.ConsultationHours,
            ConsultationFees = request.ConsultationFees,
            WorkplaceName = request.WorkplaceName,
            Location = new Point(request.Longitude, request.Latitude) { SRID = 4326 }
        };

        var result = await _userManager.CreateAsync(doctor, request.Password);

        if (!result.Succeeded)
        {
            var error = result.Errors.First();
            return Result.Failure(new Error(error.Code, error.Description, StatusCodes.Status400BadRequest));
        }

        // Upload required images
        var profilePictureResult = await _userService.UploadFileAsync(doctor.Id, request.ProfilePicture, "profile_pictures");

        if (profilePictureResult.IsFailure)
            return Result.Failure(ProfilePictureErrors.UploadFailed);

        doctor.ProfilePicture = profilePictureResult.Value;

        var idPhotoResult = await _userService.UploadFileAsync(doctor.Id, request.IdPhoto, "id_photos");

        if (idPhotoResult.IsFailure)
            return Result.Failure(new Error("IdPhoto.UploadFailed", "Failed to upload ID photo", StatusCodes.Status500InternalServerError));

        // Upload optional images
        if (request.DegreeCertificate != null)
        {
            var degreeResult = await _userService.UploadFileAsync(doctor.Id, request.DegreeCertificate, "degree_certificates");
            if (degreeResult.IsSuccess) 
                doctor.DegreeCertificate = degreeResult.Value!;
        }

        if (request.AdditionalCertification != null)
        {
            var certResult = await _userService.UploadFileAsync(doctor.Id, request.AdditionalCertification, "additional_certifications");
            if (certResult.IsSuccess) 
                doctor.AdditionalCertification = certResult.Value;
        }

        if (request.AwardsOrRecognitions != null && request.AwardsOrRecognitions.Any())
        {
            var awardUrls = new List<string>();
            foreach (var award in request.AwardsOrRecognitions)
            {
                var awardResult = await _userService.UploadFileAsync(doctor.Id, award, "awards");
                if (awardResult.IsSuccess) awardUrls.Add(awardResult.Value!);
            }
            doctor.AwardsOrRecognitions = awardUrls;
        }

        await _userManager.UpdateAsync(doctor);


        var code = await _userManager.GenerateEmailConfirmationTokenAsync(doctor);
        code = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(code));

        _logger.LogInformation("Confirmation code: {code}", code);

        // send email confirmation
        await SendConfirmationEmail(doctor, code);
        return Result.Success();
        

        //var error = result.Errors.First();

        //return Result.Failure(new Error(error.Code, error.Description, StatusCodes.Status400BadRequest));
    }

    public async Task<Result> UpdateDoctorProfileAsync(string doctorId, UpdateDoctorProfileRequest request, CancellationToken cancellationToken = default)
    {
        var doctor = await _userManager.FindByIdAsync(doctorId);
        if (doctor == null)
            return Result.Failure(UserErrors.InvalidCredentials);

        // Update basic information

        if (!string.IsNullOrEmpty(request.PhoneNumber))
            doctor.PhoneNumber = request.PhoneNumber;


        if (request.YearsOfExperience.HasValue)
            doctor.YearsOfExperience = request.YearsOfExperience.Value;

        if (!string.IsNullOrEmpty(request.ConsultationHours))
            doctor.ConsultationHours = request.ConsultationHours;

        if (request.ConsultationFees.HasValue)
            doctor.ConsultationFees = request.ConsultationFees.Value;

        if (!string.IsNullOrEmpty(request.WorkplaceName))
            doctor.WorkplaceName = request.WorkplaceName;

        if (!string.IsNullOrEmpty(request.Brief))
            doctor.Brief = request.Brief;

        if (!string.IsNullOrEmpty(request.Award))
            doctor.Award = request.Award;

        // Update location if provided
        if (request.Latitude.HasValue && request.Longitude.HasValue)
        {
            doctor.Location = new Point(request.Longitude.Value, request.Latitude.Value) { SRID = 4326 };
        }

        // Handle file uploads
        if (request.ProfilePicture != null)
        {
            var profilePictureResult = await _userService.UploadFileAsync(doctor.Id, request.ProfilePicture, "profile_pictures");
            if (profilePictureResult.IsSuccess)
                doctor.ProfilePicture = profilePictureResult.Value;
            else
                return Result.Failure(ProfilePictureErrors.UploadFailed);
        }

        if (request.AdditionalCertification != null)
        {
            var certResult = await _userService.UploadFileAsync(doctor.Id, request.AdditionalCertification, "additional_certifications");
            if (certResult.IsSuccess)
                doctor.AdditionalCertification = certResult.Value;
            else
                return Result.Failure(new Error("AdditionalCertification.UploadFailed", "Failed to upload additional certification", StatusCodes.Status500InternalServerError));
        }

        if (request.AwardImage != null)
        {
            var awardImageResult = await _userService.UploadFileAsync(doctor.Id, request.AwardImage, "awards");
            if (awardImageResult.IsSuccess)
                doctor.AwardImage = awardImageResult.Value!;
            else
                return Result.Failure(new Error("AwardImage.UploadFailed", "Failed to upload award image", StatusCodes.Status500InternalServerError));
        }

        if (request.AwardsOrRecognitions != null && request.AwardsOrRecognitions.Any())
        {
            var awardUrls = new List<string>();
            foreach (var award in request.AwardsOrRecognitions)
            {
                var awardResult = await _userService.UploadFileAsync(doctor.Id, award, "awards");
                if (awardResult.IsSuccess) awardUrls.Add(awardResult.Value!);
            }
            doctor.AwardsOrRecognitions = awardUrls;
        }

        var result = await _userManager.UpdateAsync(doctor);
        if (!result.Succeeded)
        {
            var error = result.Errors.First();
            return Result.Failure(new Error(error.Code, error.Description, StatusCodes.Status400BadRequest));
        }

        return Result.Success();
    }

    public async Task<Result<List<DoctorListResponse>>> GetAllDoctorsAsync()
    {
        // First get the doctors with base information
        var doctors = await _userManager.Users
            .Where(x => x.Role == UserRoles.Doctor)
            .ToListAsync();



        // Create the response list
        var response = doctors.Select(d => {
            // Cast to Doctor type now that we're working with in-memory objects
            var doctor = d as Doctor;



            return new DoctorListResponse(
                d.Id,
                $"{d.FirstName} {d.LastName}",
                doctor?.Speciality ?? string.Empty,
                doctor?.Brief ?? string.Empty,
                d.ProfilePicture ?? string.Empty
            );
        }).ToList();

        return Result.Success(response);


    }

    public async Task<Result<DoctorProfileResponse>> GetDoctorProfileAsync(string doctorId, CancellationToken cancellationToken = default)
    {
        var doctor = await _userManager.FindByIdAsync(doctorId);

        if (doctor == null)
            return Result.Failure<DoctorProfileResponse>(UserErrors.NotFound);

        // Get the coordinates from the location point
        double latitude = 0;
        double longitude = 0;

        if (doctor.Location != null)
        {
            latitude = doctor.Location.Y;
            longitude = doctor.Location.X;
        }

        var response = new DoctorProfileResponse(
            doctorId,
            doctor.FirstName,
            doctor.LastName,
            doctor.Email!,
            doctor.PhoneNumber!,
            doctor.Gender,
            doctor.Location!.Y,
            doctor.Location.X,
            doctor.ProfilePicture,
            doctor.UniversityName,
            doctor.GraduationYear,
            doctor.DegreeCertificate,
            doctor.AdditionalCertification,
            doctor.YearsOfExperience,
            doctor.ConsultationHours,
            doctor.ConsultationFees,
            doctor.WorkplaceName,
            doctor.AwardsOrRecognitions,
            doctor.Brief,
            doctor.Award,
            doctor.AwardImage

        );

        return Result.Success(response);
    }

    public async Task<Result<DoctorStatisticsResponse>> GetDoctorStatisticsAsync(string doctorId, CancellationToken cancellationToken = default)
    {
        var doctor = await _userManager.FindByIdAsync(doctorId);
        if (doctor == null)
            return Result.Failure<DoctorStatisticsResponse>(UserErrors.NotFound);

        // Get all appointments for this doctor
        var appointments = await _context.Appointments
            .Where(a => a.DoctorId == doctorId)
            .ToListAsync(cancellationToken);

        // Calculate statistics
        var totalPatients = appointments.Select(a => a.PatientId).Distinct().Count();
        var totalAppointments = appointments.Count;
        var completedAppointments = appointments.Count(a => a.Status == AppointmentStatus.Completed);
        var cancelledAppointments = appointments.Count(a => a.Status == AppointmentStatus.Cancelled);


        // Group appointments by month for the last 6 months
        var startDate = DateTime.UtcNow.AddMonths(-6);
        var appointmentsByMonth = appointments
            .Where(a => a.ScheduledTime >= startDate)
            .GroupBy(a => new { a.ScheduledTime.Year, a.ScheduledTime.Month })
            .Select(g => new AppointmentsByMonth(
                $"{CultureInfo.CurrentCulture.DateTimeFormat.GetMonthName(g.Key.Month)} {g.Key.Year}",
                g.Count()
            ))
            .OrderBy(a => a.Month)
            .ToList();

        var statistics = new DoctorStatisticsResponse(
            TotalPatients: totalPatients,
            TotalAppointments: totalAppointments,
            CompletedAppointments: completedAppointments,
            CancelledAppointments: cancelledAppointments,
            AppointmentsByMonth: appointmentsByMonth
        );

        return Result.Success(statistics);
    }

    public async Task<Result<List<RecommendDoctors>>> GetRecommendedDoctorsAsync(CancellationToken cancellationToken = default)
    {
        try
        {
            var doctors = await _userManager.Users
                .OfType<Doctor>()
                .Where(d => d.Location != null) // Only doctors with location
                .Select(d => new
                {
                    DoctorId = d.Id,
                    YearsOfExperience = d.YearsOfExperience,
                    Latitude = d.Location!.Y,
                    Longitude = d.Location!.X,
                    // Calculate average rating from feedback
                    Appointments = d.Appointments
                        .Where(a => a.Feedback != null)
                        .Select(a => a.Feedback!.Rating)
                        .ToList()
                })
                .ToListAsync(cancellationToken);

            var recommendedDoctors = doctors.Select(d => new RecommendDoctors(
                DoctorId: d.DoctorId,
                YearsOfExperience: d.YearsOfExperience,
                Rating: d.Appointments.Any() ? Math.Round(d.Appointments.Average(), 1) : 0.0,
                Latitude: d.Latitude,
                Longitude: d.Longitude
            )).ToList();

            return Result.Success(recommendedDoctors);
        }
        catch (Exception ex)
        {
            // Log the exception
            return Result.Failure<List<RecommendDoctors>>(
                new Error("Doctors.RetrievalFailed", "Failed to retrieve recommended doctors", StatusCodes.Status500InternalServerError));
        }
    }

    private async Task SendConfirmationEmail(ApplicationUser user, string code)
    {
        var origin = _httpContextAccessor.HttpContext?.Request.Headers.Origin;

        var emailBody = EmailBodyBuilder.GenerateEmailBody("EmailConfirmation", new Dictionary<string, string>
        {
            { "{{name}}", user.FirstName },
            { "{{action_url}}", $"{origin}/auth/emailConfirmation?userId={user.Id}&code={code}" }
        });

        await _emailSender.SendEmailAsync(user.Email!, "✅ BoneX: Email Confirmation", emailBody);

    }
}
