using System.ComponentModel.DataAnnotations;
using static System.Net.Mime.MediaTypeNames;

namespace Backend.Models
{
    public enum Role : short
    {
        Patient = 1,
        Doctor = 2,
        Admin = 3,
    }
    public abstract class Person
    {
        [Key]  // This makes Username the primary key
        [Required]
        [MaxLength(50)] // Define max length for the username
        public string Username { get; set; }

        [Required]
        [MaxLength(100)]
        public string FirstName { get; set; }

        [MaxLength(100)]
        public string? LastName { get; set; }

        public int? Age  { get; set; }

        public string? Gender { get; set; } 

        public byte[]? ImageData { get; set; }//= File.ReadAllBytes(Path.Combine(Directory.GetCurrentDirectory(), "img"));
        public Role Role { get; set; } = Role.Patient;    

    }
}
