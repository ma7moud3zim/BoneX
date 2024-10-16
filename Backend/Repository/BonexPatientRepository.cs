using Backend.Data;
using Backend.DTO;
using Backend.Interfaces;
using Backend.Models;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repository
{
    public class BonexPatientRepository : IPatientRepository
    {
        BonexDBContext Context;
        private readonly UserManager<ApplicationUser> _userManager;

        public BonexPatientRepository(BonexDBContext _BonexDBContext, BonexDBContext context, UserManager<ApplicationUser> userManager)
        {
            Context = _BonexDBContext;
            _userManager = userManager;
        }

        public Patient? GetDetailsByUserName(string UserName)
        {
            return Context.Patients.FirstOrDefault(p => p.Username == UserName);
        }

        public void Insert(Patient Patient)
        {
            Context.Patients.Add(Patient);
            Context.SaveChanges();
        }


        public async Task<bool> UpdatePatientDetailsAsync(string username, UpdatePatientDto updatePatientDto)
        {
            var patient = await Context.Patients.FirstOrDefaultAsync(p => p.Username == username);

            if (patient is null)
                return false;

            // Update 
            patient.FirstName = updatePatientDto.FirstName ?? patient.FirstName;
            patient.LastName = updatePatientDto.LastName ?? patient.LastName;
            patient.Age = updatePatientDto.Age ?? patient.Age;
            patient.Gender = updatePatientDto.Gender ?? patient.Gender;

            patient.ImageData = updatePatientDto.ImageData ?? patient.ImageData;
            patient.DateOfBirth = updatePatientDto.DateOfBirth ?? patient.DateOfBirth;
            patient.MedicalHistory = updatePatientDto.MedicalHistory ?? patient.MedicalHistory;


            // Save to the database
            Context.Update(patient);
            await Context.SaveChangesAsync();

            return true;
        }

        public async Task<bool> ResetPasswordAsync(string username, string currentPassword, string newPassword)
        {
            var patient = await _userManager.FindByNameAsync(username);

            if (patient is null) 
                return false;

            // Check if the current password is correct
            var passwordCheck = await _userManager.CheckPasswordAsync(patient, currentPassword);
            
            if(!passwordCheck)
                return false;

            // Change the password
            var result = await _userManager.ChangePasswordAsync(patient, currentPassword, newPassword);

            return result.Succeeded;

        }

    }
}
