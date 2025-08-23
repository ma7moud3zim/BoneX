namespace BoneX.Api.Contracts.Appointments;

public record TimeSlot(
    DateTime StartTime,
    DateTime EndTime,
    bool IsAvailable,
    string FormattedTime
);
