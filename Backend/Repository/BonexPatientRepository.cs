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
        public void Insert(Patient item)
        {
            Context.Patients.Add(item);
            Context.SaveChanges();  
        }
    }
}
