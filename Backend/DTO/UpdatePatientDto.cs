using System.ComponentModel.DataAnnotations;

namespace Backend.DTO;

public class UpdatePatientDto
{
    public string FirstName { get; set; }

    public string? LastName { get; set; }

    public int? Age { get; set; }

    public string? Gender { get; set; }

    public string? MedicalHistory { get; internal set; }



}
