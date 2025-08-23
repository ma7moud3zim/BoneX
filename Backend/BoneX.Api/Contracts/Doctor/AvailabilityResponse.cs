namespace BoneX.Api.Contracts.Doctor;

public record AvailabilityResponse(
    int Id,
    DayOfWeek DayOfWeek,
    TimeSpan StartTime,
    TimeSpan EndTime,
    bool IsAvailable
);