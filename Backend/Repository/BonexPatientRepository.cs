using Backend.Data;
using Backend.Interfaces;
using Backend.Models;

namespace Backend.Repository
{
    public class BonexPatientRepository : IPatientRepository
    {
        BonexDBContext Context;
        public BonexPatientRepository(BonexDBContext _BonexDBContext)
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
    }
}
