using Microsoft.AspNet.Identity.EntityFramework;

namespace ResultApp.Model
{
    public class ApplicationRole : IdentityRole
    {
        public ApplicationRole() : base() { }
        public ApplicationRole(string roleName) : base(roleName) { }
    }
}