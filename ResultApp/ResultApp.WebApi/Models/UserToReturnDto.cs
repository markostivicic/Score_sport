using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ResultApp.WebApi.Models
{
    public class UserToReturnDto
    {
        public string Id { get; set; }
        public string UserName { get; set; }

        public UserToReturnDto(string id, string userName)
        {
            Id = id;
            UserName = userName;
        }
    }
}