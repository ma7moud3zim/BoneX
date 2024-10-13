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
        private readonly BonexDBContext _context;

        public BonexPatientRepository(BonexDBContext _BonexDBContext, BonexDBContext context)
        {
            Context = _BonexDBContext;
            _context = context;
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

        public async Task<Patient?> UpdatePatientDetailsAsync(UpdatePatientDto updatePatientDto)
        {
            var patient = await _context.Patients.FirstOrDefaultAsync(p => p.Username == updatePatientDto.UserName);

            if (patient is null)
                return null;

            // Update 
            patient.FirstName = updatePatientDto.FirstName ?? patient.FirstName;
            patient.LastName = updatePatientDto.LastName ?? patient.LastName;
            patient.Age = updatePatientDto.Age ?? patient.Age;
            patient.Gender = updatePatientDto.Gender ?? patient.Gender;

            // Save to the database
            _context.Update(patient);
            await _context.SaveChangesAsync();

            return patient;
        }
    }
}
