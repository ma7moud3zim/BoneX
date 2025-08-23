namespace BoneX.Api.Contracts.Doctor;

public record SetAvailabilityRequest(
    List<DayAvailabilityRequest> Availabilities
);

public record DayAvailabilityRequest(
    DayOfWeek DayOfWeek,
    TimeSpan StartTime,
    TimeSpan EndTime,
    bool IsAvailable
);
