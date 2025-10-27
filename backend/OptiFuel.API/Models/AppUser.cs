using Microsoft.AspNetCore.Identity;

namespace OptiFuel.API.Models;

public class AppUser : IdentityUser
{
    public virtual ICollection<Voyage> Voyages { get; set; } = new List<Voyage>();
}