using Backend.Data;
using Backend.Interfaces;
using Backend.Models;

namespace Backend.Repository
{
    public class BonexAdminRepository: IAdminRepository
    {
        BonexDBContext Context;
        public BonexAdminRepository(BonexDBContext _BonexDBContext)
        {
            Context = _BonexDBContext;
        }

        public void Insert(Admin item)
        {
            Context.Admins.Add(item);
            Context.SaveChanges();
        }

    }
}
