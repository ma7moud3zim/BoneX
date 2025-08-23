namespace BoneX.Api.Contracts.Appointments;

public record DoctorAvailabilityResponse(
    string DoctorId,
    string DoctorName,
    DateTime Date,
    List<TimeSlot> TimeSlots,
    string WorkingHours
);