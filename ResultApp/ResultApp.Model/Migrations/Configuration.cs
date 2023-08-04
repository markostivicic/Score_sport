namespace ResultApp.Model.Migrations
{
    using Microsoft.AspNet.Identity;
    using Microsoft.AspNet.Identity.EntityFramework;
    using ResultApp.Model.Auth;
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Migrations;
    using System.Linq;

    internal sealed class Configuration : DbMigrationsConfiguration<ApplicationDbContext>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = false;
        }

        protected override void Seed(ApplicationDbContext context)
        {
            ApplicationUser user = new ApplicationUser();
            user.Id = "79cdcece-22f4-43a1-92e7-dba753c8ab92";
            user.PhoneNumber = "";
            user.SecurityStamp = "";
            user.PasswordHash = new PasswordHasher().HashPassword("monomono");
            user.Email = user.UserName = "admin@gmail.com";
            context.Users.AddOrUpdate(user);
            var role = new ApplicationRole();
            role.Id = "sdhv";
            role.Name = "admin";
            context.Roles.AddOrUpdate(role);
            var userRole = new IdentityUserRole
            {
                UserId = user.Id,
                RoleId = role.Id
            };
            context.Set<IdentityUserRole>().Add(userRole);
        }
    }
}
