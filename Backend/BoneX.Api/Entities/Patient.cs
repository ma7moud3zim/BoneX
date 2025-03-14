namespace BoneX.Api.Entities;

public class Patient : ApplicationUser
{
    public string? PastMedicalConditions { get; set; } = string.Empty;
    public Chronic? ChronicConditions { get; set; } = Chronic.None;

    public List<Appointment> Appointments { get; set; } = [];
}

public enum Chronic
{
    None = 0,
    Diabetes = 1,
    ThyroidDisorders = 2,
    HormonalImbalances = 3,
    Other = 4
}