using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ResultApp.WebApi.Models
{
    public class VerifyDto
    {
        public string Username { get; set; }
        public string Role { get; set; }

        public VerifyDto(string username, string role)
        {
            Username = username;
            Role = role;
        }
    }
}