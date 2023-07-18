using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ResultApp.WebApi.Models
{
    public class SportToReturnDto
    {
        public string Name { get; set; }

        public SportToReturnDto(string name)
        {
            Name = name;
        }
    }
}