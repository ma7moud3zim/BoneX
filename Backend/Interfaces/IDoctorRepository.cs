using Backend.Models;
using Microsoft.EntityFrameworkCore.Infrastructure.Internal;

namespace Backend.Interfaces
{
    public interface IDoctorRepository
    {
        public Doctor? GetDetailsByUserName(string UserName);
        public void Insert(Doctor item);

    }
}
