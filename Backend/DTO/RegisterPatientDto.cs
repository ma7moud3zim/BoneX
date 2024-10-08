using System.ComponentModel.DataAnnotations;

namespace Backend.DTO
{
    public class RegisterPatientDto
    {
        [Required]
        public string UserName { get; set; }
        [Required]
        public string Password { get; set; }
        [Required]
        [EmailAddress]
        public string Email { get; set; }
      //  [Required]
        [Phone]
        public string Phone { get; set; }
       // [Required]
        [MaxLength(100)]
        public string FirstName { get; set; }

        [MaxLength(100)]
        public string? LastName { get; set; }

    //    [Required]
        public int age { get; set; }    

    }
}
