using Backend.Data;
using Backend.DTO;
using Backend.Interfaces;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repository
{
    public class BonexPatientRepository : IPatientRepository
    {
        BonexDBContext Context;


        public BonexPatientRepository(BonexDBContext _BonexDBContext, BonexDBContext context)
        {
            Context = _BonexDBContext;
        }

        public Patient? GetDetailsByUserName(string UserName)
        {
          return Context.Patients.FirstOrDefault(p=>p.Username==UserName);    
        }

        public void Insert(Patient Patient)
        {
            Context.Patients.Add(Patient);
            Context.SaveChanges();  
        }

        

        public async Task<Patient?> UpdatePatientDetailsAsync(string username, UpdatePatientDto updatePatientDto)
        {
            var patient = await Context.Patients.FirstOrDefaultAsync(p => p.Username == username);

            if (patient is null)
                return null;

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

            return patient;
        }

    }
}
