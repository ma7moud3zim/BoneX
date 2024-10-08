using Backend.Models;

namespace Backend.Interfaces
{
    public interface IPatientRepository
    {
        void Insert(Patient item);
    }
}
