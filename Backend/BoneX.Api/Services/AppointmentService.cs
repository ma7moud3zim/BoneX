using BoneX.Api.Contracts.Appointments;
using BoneX.Api.Entities;
using BoneX.Api.Errors;
using BoneX.Api.Extensions;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI.Services;

namespace BoneX.Api.Services;

public class AppointmentService(ApplicationDbContext context,
        UserManager<ApplicationUser> userManager,
        IDoctorAvailabilityService availabilityService,
        ILogger<AppointmentService> logger,
        IEmailSender emailSender) : IAppointmentService
{
    private readonly ApplicationDbContext _context = context;
    private readonly ILogger<AppointmentService> _logger = logger;
    private readonly UserManager<ApplicationUser> _userManager = userManager;
    private readonly IDoctorAvailabilityService _availabilityService = availabilityService;
    private readonly IEmailSender _emailSender = emailSender;

    public async Task<Result<AppointmentResponse>> CreateAppointmentAsync(string patientId, CreateAppointmentRequest request, CancellationToken cancellationToken = default)
    {
        var patient = await _userManager.FindByIdAsync(patientId);
        if (patient == null || patient.Role != UserRoles.Patient)
            return Result.Failure<AppointmentResponse>(UserErrors.Unauthorized);

        var doctor = await _userManager.Users
            .OfType<Doctor>()
            .FirstOrDefaultAsync(d => d.Id == request.DoctorId, cancellationToken);

        if (doctor == null)
            return Result.Failure<AppointmentResponse>(UserErrors.NotFound);

        // Check if the appointment time is available
        var availableSlots = await _availabilityService.GetAvailableTimeSlotsAsync(doctor.Id, request.ScheduledTime.Date, cancellationToken);
        if (availableSlots.IsFailure)
            return Result.Failure<AppointmentResponse>(availableSlots.Error);

        if (!availableSlots.Value.Any(slot => slot.Year == request.ScheduledTime.Year &&
                                            slot.Month == request.ScheduledTime.Month &&
                                            slot.Day == request.ScheduledTime.Day &&
                                            slot.Hour == request.ScheduledTime.Hour &&
                                            slot.Minute == request.ScheduledTime.Minute))
        {
            return Result.Failure<AppointmentResponse>(
                new Error("Appointment.TimeNotAvailable", "The requested appointment time is not available", StatusCodes.Status400BadRequest));
        }

        // Calculate end time (assuming 30-minute appointments)
        var endTime = request.ScheduledTime.AddMinutes(30);

        // Create appointment
        var appointment = new Appointment
        {
            PatientId = patientId,
            DoctorId = doctor.Id,
            ScheduledTime = request.ScheduledTime,
            EndTime = endTime,
            Status = AppointmentStatus.Scheduled,
            // Generate a simple meeting link (in a real system, you might integrate with Zoom, Google Meet, etc.)
            MeetingLink = $"https://meet.bonex.com/{Guid.NewGuid()}"
        };

        _context.Appointments.Add(appointment);
        await _context.SaveChangesAsync(cancellationToken);

        // Send confirmation emails
        // ...

        var feedbackResponse = new FeedbackResponse
        (
            FeedbackId: 0,
            appointment.Id,
            appointment.Patient.FirstName + " " + appointment.Patient.LastName,
            appointment.Doctor.FirstName + " " + appointment.Doctor.LastName,
            false,
            false,
            false,
            false,
            false,
            0
        );


        return Result.Success(new AppointmentResponse(
            appointment.Id,
            appointment.DoctorId,
            appointment.PatientId,
            doctor.FirstName + " " + doctor.LastName,
            patient.FirstName + " " + patient.LastName,
            appointment.ScheduledTime,
            appointment.EndTime,
            appointment.Status,
            appointment.CancellationReason,
            appointment.MeetingLink,
            feedbackResponse
        ));
    }

    public async Task<Result<AppointmentResponse>> UpdateAppointmentAsync(string userId, int appointmentId, UpdateAppointmentRequest request, CancellationToken cancellationToken = default)
    {
        var user = await _userManager.FindByIdAsync(userId);
        if (user == null)
            return Result.Failure<AppointmentResponse>(UserErrors.Unauthorized);

        var appointment = await _context.Appointments
            .Include(a => a.Doctor)
            .Include(a => a.Patient)
            .FirstOrDefaultAsync(a => a.Id == appointmentId, cancellationToken);

        if (appointment == null)
            return Result.Failure<AppointmentResponse>(
                new Error("Appointment.NotFound", "Appointment not found", StatusCodes.Status404NotFound));

        // Verify the user is either the patient or the doctor
        if (appointment.PatientId != userId && appointment.DoctorId != userId)
            return Result.Failure<AppointmentResponse>(UserErrors.Unauthorized);

        // Check if appointment is already completed or cancelled
        if (appointment.Status == AppointmentStatus.Completed || appointment.Status == AppointmentStatus.Cancelled)
            return Result.Failure<AppointmentResponse>(
                new Error("Appointment.CannotUpdate", "Cannot update completed or cancelled appointments", StatusCodes.Status400BadRequest));

        // Update appointment fields
        if (request.ScheduledTime.HasValue)
        {
            // Check if new time is available
            var availableSlots = await _availabilityService.GetAvailableTimeSlotsAsync(
                appointment.DoctorId, request.ScheduledTime.Value.Date, cancellationToken);

            if (availableSlots.IsFailure)
                return Result.Failure<AppointmentResponse>(availableSlots.Error);

            bool isTimeAvailable = availableSlots.Value.Any(slot =>
                slot.Year == request.ScheduledTime.Value.Year &&
                slot.Month == request.ScheduledTime.Value.Month &&
                slot.Day == request.ScheduledTime.Value.Day &&
                slot.Hour == request.ScheduledTime.Value.Hour &&
                slot.Minute == request.ScheduledTime.Value.Minute);

            if (!isTimeAvailable)
            {
                return Result.Failure<AppointmentResponse>(
                    new Error("Appointment.TimeNotAvailable", "The requested appointment time is not available", StatusCodes.Status400BadRequest));
            }

            appointment.ScheduledTime = request.ScheduledTime.Value;
            appointment.EndTime = request.ScheduledTime.Value.AddMinutes(30);
            appointment.Status = AppointmentStatus.Rescheduled;
        }

        
            // For cancellation, require a reason
            if (request.Status == AppointmentStatus.Cancelled && string.IsNullOrEmpty(request.CancellationReason))
            {
                return Result.Failure<AppointmentResponse>(
                    new Error("Appointment.CancellationReasonRequired", "Cancellation reason is required", StatusCodes.Status400BadRequest));
            }

            appointment.Status = request.Status!;

            if (request.Status == AppointmentStatus.Cancelled)
                appointment.CancellationReason = request.CancellationReason;
        


        await _context.SaveChangesAsync(cancellationToken);

        // Notify relevant parties of the update

        var feedbackResponse = new FeedbackResponse
        (
            FeedbackId: 0,
            appointment.Id,
            appointment.Patient.FirstName + " " + appointment.Patient.LastName,
            appointment.Doctor.FirstName + " " + appointment.Doctor.LastName,
            false,
            false,
            false,
            false,
            false,
            0
        );

        return Result.Success(new AppointmentResponse(
            appointment.Id,
            appointment.DoctorId,
            appointment.PatientId,
            appointment.Doctor.FirstName + " " + appointment.Doctor.LastName,
            appointment.Patient.FirstName + " " + appointment.Patient.LastName,
            appointment.ScheduledTime,
            appointment.EndTime,
            appointment.Status,
            appointment.CancellationReason,
            appointment.MeetingLink,
            feedbackResponse
        ));
    }

    public async Task<Result<AppointmentResponse>> GetAppointmentByIdAsync(string userId, int appointmentId, CancellationToken cancellationToken = default)
    {
        var user = await _userManager.FindByIdAsync(userId);
        if (user == null)
            return Result.Failure<AppointmentResponse>(UserErrors.Unauthorized);

        var appointment = await _context.Appointments
            .Include(a => a.Doctor)
            .Include(a => a.Patient)
            .Include(a => a.Feedback)
            .FirstOrDefaultAsync(a => a.Id == appointmentId, cancellationToken);

        if (appointment == null)
            return Result.Failure<AppointmentResponse>(
                new Error("Appointment.NotFound", "Appointment not found", StatusCodes.Status404NotFound));

        // Verify the user is either the patient or the doctor
        if (appointment.PatientId != userId && appointment.DoctorId != userId)
            return Result.Failure<AppointmentResponse>(UserErrors.Unauthorized);

       var feedbackResponse = await _context.Feedbacks
            .Where(f => f.AppointmentId == appointment.Id)
            .Select(f => new FeedbackResponse(
                f.Id,
                f.AppointmentId,
                f.Appointment.Patient.FirstName + " " + f.Appointment.Patient.LastName,
                f.Appointment.Doctor.FirstName + " " + f.Appointment.Doctor.LastName,
                f.MedicalAttentionGiven,
                f.WasGoodListener,
                f.WillContinueTreatment,
                f.ExpectationsMet,
                f.RecommendDoctor,
                f.Rating
            ))
            .FirstOrDefaultAsync(cancellationToken);

        return Result.Success(new AppointmentResponse(
            appointment.Id,
            appointment.DoctorId,
            appointment.PatientId,
            appointment.Doctor.FirstName + " " + appointment.Doctor.LastName,
            appointment.Patient.FirstName + " " + appointment.Patient.LastName,
            appointment.ScheduledTime,
            appointment.EndTime,
            appointment.Status,
            appointment.CancellationReason,
            appointment.MeetingLink,
            feedbackResponse
        ));
    }

    public async Task<Result<List<DoctorAppointmentResponse>>> GetUserAppointmentsAsync(string userId, bool includePast = false, CancellationToken cancellationToken = default)
    {
        var user = await _userManager.FindByIdAsync(userId);
        if (user == null)
            return Result.Failure<List<DoctorAppointmentResponse>>(UserErrors.Unauthorized);

        var query = _context.Appointments
            .Include(a => a.Doctor)
            .Include(a => a.Patient)
            .Include(a => a.Feedback)
            .Where(a => a.PatientId == userId || a.DoctorId == userId);

        // Filter out past appointments unless specifically requested
        if (!includePast)
            query = query.Where(a => a.ScheduledTime >= DateTime.UtcNow || a.Status == AppointmentStatus.Scheduled);

        var appointments = await query.ToListAsync(cancellationToken);

        if (appointments == null || !appointments.Any())
            return Result.Failure<List<DoctorAppointmentResponse>>(
                new Error("Appointment.NotFound", "No appointments found for the user", StatusCodes.Status404NotFound));

        var feedbackResponse = await _context.Feedbacks
            .Where(f => f.AppointmentId == appointments.First().Id)
            .Select(f => new FeedbackResponse(
                f.Id,
                f.AppointmentId,
                f.Appointment.Patient.FirstName + " " + f.Appointment.Patient.LastName,
                f.Appointment.Doctor.FirstName + " " + f.Appointment.Doctor.LastName,
                f.MedicalAttentionGiven,
                f.WasGoodListener,
                f.WillContinueTreatment,
                f.ExpectationsMet,
                f.RecommendDoctor,
                f.Rating
            ))
            .FirstOrDefaultAsync(cancellationToken);

        var response = appointments.Select(a => new DoctorAppointmentResponse(
            a.Id,
            a.PatientId,
            a.Patient.FirstName + " " + a.Patient.LastName,
            a.Patient.ProfilePicture,
            a.Patient.Gender,
            a.Patient.DateOfBirth,
            "Online",
            a.ScheduledTime,
            a.EndTime,
            a.Status,
            a.CancellationReason,
            a.MeetingLink,
            feedbackResponse
        )).ToList();

        return Result.Success(response);


        //var response = appointments.Select(a =>
        //{
        //    var feedback = a.Feedback == null ? null : new FeedbackResponse(
        //        a.Feedback.Id,
        //        a.Id,
        //        a.Patient.FirstName + " " + a.Patient.LastName,
        //        a.Doctor.FirstName + " " + a.Doctor.LastName,
        //        a.Feedback.MedicalAttentionGiven,
        //        a.Feedback.WasGoodListener,
        //        a.Feedback.WillContinueTreatment,
        //        a.Feedback.ExpectationsMet,
        //        a.Feedback.RecommendDoctor,
        //        a.Feedback.Rating
        //    );

        //    return new AppointmentResponse(
        //        a.Id,
        //        a.DoctorId,
        //        a.PatientId,
        //        a.Doctor.FirstName + " " + a.Doctor.LastName,
        //        a.Patient.FirstName + " " + a.Patient.LastName,
        //        a.ScheduledTime,
        //        a.EndTime,
        //        a.Status,
        //        a.CancellationReason,
        //        a.MeetingLink,
        //        feedback
        //    );
        //}).ToList();

        //return Result.Success(response);
    }

    public async Task<Result<List<DoctorAppointmentResponse>>> GetDoctorAppointmentsAsync(string doctorId, DateTime? date = null, CancellationToken cancellationToken = default)
    {
        var doctor = await _userManager.Users
            .OfType<Doctor>()
            .FirstOrDefaultAsync(d => d.Id == doctorId, cancellationToken);

        if (doctor == null)
            return Result.Failure<List<DoctorAppointmentResponse>>(UserErrors.NotFound);

        var query = _context.Appointments
            .Include(a => a.Patient)
            .Where(a => a.DoctorId == doctorId);

        // Filter by date if provided
        if (date.HasValue)
            query = query.Where(a => a.ScheduledTime.Date == date.Value.Date);

        var appointments = await query.ToListAsync(cancellationToken);

        if (appointments == null || !appointments.Any())
            return Result.Failure<List<DoctorAppointmentResponse>>(
                new Error("Appointment.NotFound", "No appointments found for the doctor", StatusCodes.Status404NotFound));

        var feedbackResponse = await _context.Feedbacks
            .Where(f => f.AppointmentId == appointments.First().Id)
            .Select(f => new FeedbackResponse(
                f.Id,
                f.AppointmentId,
                f.Appointment.Patient.FirstName + " " + f.Appointment.Patient.LastName,
                f.Appointment.Doctor.FirstName + " " + f.Appointment.Doctor.LastName,
                f.MedicalAttentionGiven,
                f.WasGoodListener,
                f.WillContinueTreatment,
                f.ExpectationsMet,
                f.RecommendDoctor,
                f.Rating
            ))
            .FirstOrDefaultAsync(cancellationToken);

        var response = appointments.Select(a => new DoctorAppointmentResponse(
            a.Id,
            a.PatientId,
            a.Patient.FirstName + " " + a.Patient.LastName,
            a.Patient.ProfilePicture,
            a.Patient.Gender,
            a.Patient.DateOfBirth,
            "Online",
            a.ScheduledTime,
            a.EndTime,
            a.Status,
            a.CancellationReason,
            a.MeetingLink,
            feedbackResponse
        )).ToList();

        return Result.Success(response);
    }

    public async Task<Result> CancelAppointmentAsync(string userId, int appointmentId, string cancellationReason, CancellationToken cancellationToken = default)
    {
        var user = await _userManager.FindByIdAsync(userId);
        if (user == null)
            return Result.Failure(UserErrors.Unauthorized);

        var appointment = await _context.Appointments
            .Include(a => a.Doctor)
            .Include(a => a.Patient)
            .FirstOrDefaultAsync(a => a.Id == appointmentId, cancellationToken);

        if (appointment == null)
            return Result.Failure(
                new Error("Appointment.NotFound", "Appointment not found", StatusCodes.Status404NotFound));

        // Verify the user is either the patient or the doctor
        if (appointment.PatientId != userId && appointment.DoctorId != userId)
            return Result.Failure(UserErrors.Unauthorized);

        // Check if appointment is already completed or cancelled
        if (appointment.Status == AppointmentStatus.Completed || appointment.Status == AppointmentStatus.Cancelled)
            return Result.Failure(
                new Error("Appointment.AlreadyCompleted", "Cannot cancel completed or already cancelled appointments", StatusCodes.Status400BadRequest));

        // Update appointment status
        appointment.Status = AppointmentStatus.Cancelled;
        appointment.CancellationReason = cancellationReason;

        await _context.SaveChangesAsync(cancellationToken);

        // Notify relevant parties of the cancellation

        return Result.Success();
    }

    public async Task<Result<List<DateTime>>> GetDoctorAvailableTimeSlotsAsync(string doctorId, DateTime date, CancellationToken cancellationToken = default)
    {
        return await _availabilityService.GetAvailableTimeSlotsAsync(doctorId, date, cancellationToken);
    }

    public async Task<Result<List<string>>> GetFormattedAvailableSlotsAsync(string doctorId, DateTime date, CancellationToken cancellationToken = default)
    {
        var availableSlotsResult = await _availabilityService.GetAvailableTimeSlotsAsync(doctorId, date, cancellationToken);

        if (availableSlotsResult.IsFailure)
            return Result.Failure<List<string>>(availableSlotsResult.Error);

        var formatted = availableSlotsResult.Value!
            .OrderBy(t => t)
            .Select(slot => $"{slot:HH:mm} to {slot.AddMinutes(30):HH:mm}")
            .ToList();

        return Result.Success(formatted);
    }

    public async Task<Result<Dictionary<string, int>>> GetDoctorAppointmentStatsAsync(string doctorId, CancellationToken cancellationToken = default)
    {
        var doctor = await _userManager.Users.OfType<Doctor>().FirstOrDefaultAsync(d => d.Id == doctorId, cancellationToken);
        if (doctor == null)
            return Result.Failure<Dictionary<string, int>>(UserErrors.NotFound);

        var appointments = await _context.Appointments
            .Where(a => a.DoctorId == doctorId)
            .ToListAsync(cancellationToken);

        var stats = appointments
            .GroupBy(a => a.Status)
            .ToDictionary(g => g.Key, g => g.Count());

        return Result.Success(stats);
    }

    public async Task<Result> SubmitFeedbackAsync(FeedbackRequest request, string patientId)
    {
        var appointment = await _context.Appointments
            .FirstOrDefaultAsync(a => a.Id == request.AppointmentId && a.PatientId == patientId);

        if (appointment == null)
        {
            return Result.Failure(
                new Error("Feedback.InvalidAppointment", "You can only submit feedback for your own completed appointments.", StatusCodes.Status400BadRequest)
            );
        }

        // Optional: check if feedback already exists
        bool alreadyExists = await _context.Feedbacks
            .AnyAsync(f => f.AppointmentId == request.AppointmentId);

        if (alreadyExists)
        {
            return Result.Failure(
                new Error("Feedback.AlreadySubmitted", "Feedback has already been submitted for this appointment.", StatusCodes.Status400BadRequest)
            );
        }

        var feedback = new Feedback
        {
            AppointmentId = request.AppointmentId,
            PatientId = patientId,
            MedicalAttentionGiven = request.MedicalAttentionGiven,
            WasGoodListener = request.WasGoodListener,
            WillContinueTreatment = request.WillContinueTreatment,
            ExpectationsMet = request.ExpectationsMet,
            RecommendDoctor = request.RecommendDoctor,
            Rating = request.Rating
        };

        // Associate feedback with appointment
        appointment.Feedback = feedback;

        _context.Feedbacks.Add(feedback);
        await _context.SaveChangesAsync();

        return Result.Success();
    }

    public async Task<Result<List<FeedbackResponse>>> GetFeedbacksAsync()
    {
        var feedbacks = await _context.Feedbacks
            .Include(f => f.Appointment)
            .ThenInclude(a => a.Patient)
            .Include(f => f.Appointment)
            .ThenInclude(a => a.Doctor)
            .Select(f => new FeedbackResponse(
                f.Id,
                f.AppointmentId,
                f.Appointment.Patient.FirstName + " " + f.Appointment.Patient.LastName,
                f.Appointment.Doctor.FirstName + " " + f.Appointment.Doctor.LastName,
                f.MedicalAttentionGiven,
                f.WasGoodListener,
                f.WillContinueTreatment,
                f.ExpectationsMet,
                f.RecommendDoctor,
                f.Rating
            ))
            .ToListAsync();
        return Result.Success(feedbacks);
    }     

    public async Task<Result> WriteReportAsync(string doctorId, AppointmentReportRequest request, CancellationToken cancellationToken = default)
    {
        var doctor = await _userManager.Users
        .OfType<Doctor>()
        .FirstOrDefaultAsync(d => d.Id == doctorId, cancellationToken);

        if (doctor is null)
            return Result.Failure(UserErrors.NotFound);

        // Get all appointment with report if any
        var appointment = await _context.Appointments
        .Include(a => a.Patient)
        .Include(a => a.Report) // Include existing report
        .FirstOrDefaultAsync(a => a.Id == request.AppointmentId && a.DoctorId == doctorId, cancellationToken);

        if (appointment is null)
            return Result.Failure(
                new Error("Appointment.NotFound", "Appointment not found or does not belong to the doctor", StatusCodes.Status404NotFound));

        // Create or update report
        if (appointment.Report == null)
        {
            // Create report
            appointment.Report = new AppointmentReport
            {
                AppointmentId = appointment.Id,
                PatientName = request.PatientName,
                Diagnosis = request.Diagnosis,
                Medications = request.Medications,
                CreatedAt = DateTime.UtcNow
            };
        }
        else
        {
            // Update report
            appointment.Report.PatientName = request.PatientName;
            appointment.Report.Diagnosis = request.Diagnosis;
            appointment.Report.Medications = request.Medications;
            appointment.Report.UpdatedAt = DateTime.UtcNow;
        }

        try
        {
            await _context.SaveChangesAsync(cancellationToken);

            return Result.Success();
        }
        catch (Exception ex)
        {
            // Log the exception
            return Result.Failure(
                new Error("Report.SaveFailed", "Failed to save the report", StatusCodes.Status500InternalServerError));
        }
    }
}
