using Backend.DTO;
using Backend.Models;

namespace Backend.Interfaces
{
    public interface IPatientRepository
    {

        public Patient? GetDetailsByUserName(string UserName);
        public void Insert(Patient Patient);

        Task<bool> UpdatePatientDetailsAsync(string username, UpdatePatientDto updatePatientDto);
        Task<bool> ResetPasswordAsync(string username, string currentPassword, string newPassword);

    }
}
