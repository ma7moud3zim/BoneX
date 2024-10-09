using Backend.Models;
using Microsoft.EntityFrameworkCore.Infrastructure.Internal;

namespace Backend.Interfaces
{
    public interface IDoctorRepository
    {
        public void Insert(Doctor item);

    }
}
