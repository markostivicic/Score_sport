using Microsoft.AspNet.Identity;
using ResultApp.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ResultApp.Service
{
    public class RoleService : RoleManager<ApplicationRole>
    {
        public RoleService(IRoleStore<ApplicationRole, string> roleStore)
            : base(roleStore)
        {
        }
    }
}
