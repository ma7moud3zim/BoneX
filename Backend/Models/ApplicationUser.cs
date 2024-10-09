
using Microsoft.AspNetCore.Identity;

namespace Backend.Models
{
    public enum AccountStatus : short
    {
        Banned = 0,
        Active = 1
    }
    public class ApplicationUser: IdentityUser
    {
        public AccountStatus AccountStatus { get; set; } = AccountStatus.Active;
    }
}
