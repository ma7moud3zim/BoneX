using Backend.Models;

namespace Backend.Interfaces
{
    public interface IPatientRepository
    {
      public void Insert(Patient item);
    }
}
