namespace BoneX.Api.Errors;

public static class AppointmentErrors
{
    public static readonly Error AppointmentNotFound =
        new("Appointment.AppointmentNotFound", "Appointment not found", StatusCodes.Status404NotFound);

    public static readonly Error AppointmentNotScheduled =
        new("Appointment.AppointmentNotScheduled", "Appointment is not scheduled", StatusCodes.Status400BadRequest);

    public static readonly Error AppointmentNotCompleted =
        new("Appointment.AppointmentNotCompleted", "Appointment is not completed", StatusCodes.Status400BadRequest);

    public static readonly Error AppointmentNotCancelled =
        new("Appointment.AppointmentNotCancelled", "Appointment is not cancelled", StatusCodes.Status400BadRequest);

    public static readonly Error AppointmentAlreadyCompleted =
        new("Appointment.AppointmentAlreadyCompleted", "Appointment is already completed", StatusCodes.Status400BadRequest);

    public static readonly Error AppointmentAlreadyCancelled =
        new("Appointment.AppointmentAlreadyCancelled", "Appointment is already cancelled", StatusCodes.Status400BadRequest);

    public static readonly Error AppointmentAlreadyScheduled =
        new("Appointment.AppointmentAlreadyScheduled", "Appointment is already scheduled", StatusCodes.Status400BadRequest);

    public static readonly Error AppointmentTimeConflict =
        new("Appointment.AppointmentTimeConflict", "Appointment time conflict", StatusCodes.Status400BadRequest);

    public static readonly Error DoctorNotFound =
                new("Appointment.DoctorNotFound", "Doctor not found", StatusCodes.Status404NotFound);

    public static readonly Error PatientNotAuthenticated =
        new("Appointment.PatientNotAuthenticated", "Patient not authenticated", StatusCodes.Status401Unauthorized);

    public static readonly Error UnauthorizedAccess =
        new("Appointment.UnauthorizedAccess", "Unauthorized access", StatusCodes.Status403Forbidden);

    public static readonly Error TimeNotAvailable =
                new("Appointment.TimeNotAvailable", "The new time is not within the doctor's available hours", StatusCodes.Status400BadRequest);

    public static readonly Error FeedbackAlreadySubmitted =
    new ( "Appointment.FeedbackAlreadySubmitted", "Feedback has already been submitted for this appointment", StatusCodes.Status400BadRequest);
}
