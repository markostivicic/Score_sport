using System;
using Microsoft.AspNet.Identity.EntityFramework;

namespace ResultApp.Model.Auth
{

    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext()
            : base(Environment.GetEnvironmentVariable("connStr"), throwIfV1Schema: false)
        {
        }
        
        public static ApplicationDbContext Create()
        {
            return new ApplicationDbContext();
        }
    }
}