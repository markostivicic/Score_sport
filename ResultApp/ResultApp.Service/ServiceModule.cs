using Autofac;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin.Security.DataProtection;
using ResultApp.Model;
using ResultApp.Model.Auth;
using ResultApp.Repository;
using ResultApp.Repository.Common;
using ResultApp.Service.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Remoting.Contexts;
using System.Text;
using System.Threading.Tasks;

namespace ResultApp.Service
{
    public class ServiceModule : Module
    {
        protected override void Load(ContainerBuilder builder)
        {
            builder.RegisterModule<RepositoryModule>();
            builder.RegisterType<SportService>().As<ISportService>();
            builder.RegisterType<LocationService>().As<ILocationService>();
            builder.RegisterType<CountryService>().As<ICountryService>();
            builder.RegisterType<MatchService>().As<IMatchService>();
            builder.RegisterType<ClubService>().As<IClubService>();
            builder.RegisterType<LeagueService>().As<ILeagueService>();
            builder.RegisterType<CommentService>().As<ICommentService>();
            builder.RegisterType<PlayerService>().As<IPlayerService>();
            builder.RegisterType<FavouriteClubService>().As<IFavouriteClubService>();
            builder.RegisterType<FavouriteMatchService>().As<IFavouriteMatchService>();
            builder.RegisterType<ApplicationDbContext>().InstancePerLifetimeScope();

            builder.RegisterType<UserStore<ApplicationUser>>().AsImplementedInterfaces().InstancePerLifetimeScope();
            builder.RegisterType<RoleStore<ApplicationRole>>().AsImplementedInterfaces().InstancePerLifetimeScope();
            builder.Register(c => new IdentityFactoryOptions<UserService>()
            {
                DataProtectionProvider = new DpapiDataProtectionProvider("InternHub")
            }).AsSelf().InstancePerLifetimeScope();


            // Register the ApplicationUserManager
            builder.Register(c =>
            {
                var manager = new UserService(new UserStore<ApplicationUser>(c.Resolve<ApplicationDbContext>()));
                // Configure validation logic for usernames
                manager.UserValidator = new UserValidator<ApplicationUser>(manager)
                {
                    AllowOnlyAlphanumericUserNames = false,
                    RequireUniqueEmail = true
                };
                // Configure validation logic for passwords
                manager.PasswordValidator = new PasswordValidator
                {
                    RequiredLength = 6,
                    //RequireNonLetterOrDigit = true,
                    //RequireDigit = true,
                    //RequireLowercase = true,
                    //RequireUppercase = true,
                };
                var dataProtectionProvider = c.Resolve<IdentityFactoryOptions<UserService>>().DataProtectionProvider;
                if (dataProtectionProvider != null)
                {
                    manager.UserTokenProvider = new DataProtectorTokenProvider<ApplicationUser>(dataProtectionProvider.Create("ASP.NET Identity"));
                }
                return manager;
            }).InstancePerLifetimeScope();

            // Register the ApplicationRoleManager
            builder.Register(c =>
            {
                var applicationRoleManager = new RoleService(new RoleStore<ApplicationRole>(c.Resolve<ApplicationDbContext>()));
                return applicationRoleManager;
            }).InstancePerLifetimeScope();
        }
    }
}
