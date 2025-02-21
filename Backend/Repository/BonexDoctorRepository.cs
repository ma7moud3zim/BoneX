using Backend.Data;
using Backend.Interfaces;
using Backend.Models;
using Microsoft.EntityFrameworkCore.Migrations.Operations;

namespace Backend.Repository
{
    public class BonexDoctorRepository: IDoctorRepository
    {

        public BonexDBContext Context;
        public BonexDoctorRepository(BonexDBContext context)
        {
            Context = context;
        }

        public Doctor? GetDetailsByUserName(string UserName)
        {
            
             return Context.Doctors.FirstOrDefault(p => p.Username == UserName);
        }

        public void Insert(Doctor doctor)
        {
            Context.Doctors.Add(doctor);    
            Context.SaveChanges();  
        }
    }
}
