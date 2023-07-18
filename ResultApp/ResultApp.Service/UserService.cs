using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin;
using ResultApp.Model;
using ResultApp.Model.Auth;
using System;
using System.Threading.Tasks;

namespace ResultApp.Service
{
    public class UserService : UserManager<ApplicationUser>
    {
        public UserService(IUserStore<ApplicationUser> store) : base(store) { }
    }
}
