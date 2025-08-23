using BoneX.Api.Contracts.Appointments;
using BoneX.Api.Contracts.Doctor;
using BoneX.Api.Errors;

namespace BoneX.Api.Services;

public class DoctorAvailabilityService(ApplicationDbContext context,
        UserManager<Doctor> userManager,
        ILogger<DoctorAvailabilityService> logger) : IDoctorAvailabilityService
{
    private readonly ApplicationDbContext _context = context;
    private readonly UserManager<Doctor> _userManager = userManager;
    private readonly ILogger<DoctorAvailabilityService> _logger = logger;


    public async Task<Result> SetAvailabilityAsync(string doctorId, SetAvailabilityRequest request, CancellationToken cancellationToken = default)
    {
        var doctor = await _userManager.FindByIdAsync(doctorId);
        if (doctor == null || doctor.Role != UserRoles.Doctor)
            return Result.Failure(UserErrors.Unauthorized);

        // Remove existing availability entries
        var existingAvailability = await _context.DoctorAvailabilities
            .Where(a => a.DoctorId == doctorId)
            .ToListAsync(cancellationToken);

        _context.DoctorAvailabilities.RemoveRange(existingAvailability);

        // Add new availability entries
        foreach (var availability in request.Availabilities)
        {
            _context.DoctorAvailabilities.Add(new DoctorAvailability
            {
                DoctorId = doctorId,
                DayOfWeek = availability.DayOfWeek,
                StartTime = availability.StartTime,
                EndTime = availability.EndTime,
                IsAvailable = availability.IsAvailable
            });
        }

        await _context.SaveChangesAsync(cancellationToken);
        return Result.Success();
    }
    public async Task<Result<List<AvailabilityResponse>>> GetAvailabilityAsync(string doctorId, CancellationToken cancellationToken = default)
    {
        var doctor = await _userManager.FindByIdAsync(doctorId);
        if (doctor == null || doctor.Role != UserRoles.Doctor)
            return Result.Failure<List<AvailabilityResponse>>(UserErrors.Unauthorized);

        var availabilities = await _context.DoctorAvailabilities
            .Where(a => a.DoctorId == doctorId)
            .ToListAsync(cancellationToken);

        var result = availabilities.Select(a => new AvailabilityResponse(
            a.Id,
            a.DayOfWeek,
            a.StartTime,
            a.EndTime,
            a.IsAvailable
        )).ToList();

        return Result.Success(result);
    }

    public async Task<Result<List<DateTime>>> GetAvailableTimeSlotsAsync(string doctorId, DateTime date, CancellationToken cancellationToken = default)
    {
        var doctor = await _userManager.FindByIdAsync(doctorId);
        if (doctor == null || doctor.Role != UserRoles.Doctor)
            return Result.Failure<List<DateTime>>(UserErrors.Unauthorized);

        // Get the day of week for the requested date
        var dayOfWeek = date.DayOfWeek;

        // Get doctor's availability for this day
        var availability = await _context.DoctorAvailabilities
            .FirstOrDefaultAsync(a => a.DoctorId == doctorId && a.DayOfWeek == dayOfWeek && a.IsAvailable, cancellationToken);

        if (availability == null)
            return Result.Success(new List<DateTime>()); // No available slots for this day

        // Get existing appointments for this date
        var existingAppointments = await _context.Appointments
            .Where(a => a.DoctorId == doctorId &&
                    a.ScheduledTime.Date == date.Date &&
                    (a.Status == AppointmentStatus.Scheduled || a.Status == AppointmentStatus.Rescheduled))
            .ToListAsync(cancellationToken);

        // Generate time slots (assuming 30-minute appointments)
        var slots = new List<DateTime>();
        var currentTime = new DateTime(date.Year, date.Month, date.Day,
            availability.StartTime.Hours, availability.StartTime.Minutes, 0);
        var endTime = new DateTime(date.Year, date.Month, date.Day,
            availability.EndTime.Hours, availability.EndTime.Minutes, 0);

        // If the date is today, don't show past time slots
        if (date.Date == DateTime.Today && currentTime < DateTime.Now)
        {
            // Round up to the next 30-minute slot
            var minutesToAdd = 30 - (DateTime.Now.Minute % 30);
            currentTime = DateTime.Now.AddMinutes(minutesToAdd).Date.AddHours(DateTime.Now.Hour).AddMinutes(DateTime.Now.Minute + minutesToAdd);

            // Ensure we're still within the doctor's availability window
            if (currentTime.TimeOfDay < availability.StartTime)
            {
                currentTime = new DateTime(date.Year, date.Month, date.Day,
                    availability.StartTime.Hours, availability.StartTime.Minutes, 0);
            }
        }

        while (currentTime.AddMinutes(30) <= endTime)
        {
            // Check if this slot overlaps with any existing appointment
            bool isAvailable = !existingAppointments.Any(a =>
                (currentTime >= a.ScheduledTime && currentTime < a.EndTime) ||
                (currentTime.AddMinutes(30) > a.ScheduledTime && currentTime.AddMinutes(30) <= a.EndTime));

            if (isAvailable)
            {
                slots.Add(currentTime);
            }

            currentTime = currentTime.AddMinutes(30);
        }

        return Result.Success(slots);
    }

    public async Task<Result<List<TimeSlot>>> GetFormattedAvailableTimeSlotsAsync(string doctorId, DateTime date, CancellationToken cancellationToken = default)
    {
        var slotsResult = await GetAvailableTimeSlotsAsync(doctorId, date, cancellationToken);

        if (slotsResult.IsFailure)
            return Result.Failure<List<TimeSlot>>(slotsResult.Error);

        var formattedSlots = slotsResult.Value!.Select(slot => new TimeSlot(
            StartTime: slot,
            EndTime: slot.AddMinutes(30),
            IsAvailable: true,
            FormattedTime: $"{slot.ToString("HH:mm")} - {slot.AddMinutes(30).ToString("HH:mm")}"
        )).ToList();

        return Result.Success(formattedSlots);
    }
}