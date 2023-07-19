using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ResultApp.WebApi.Models.Sport
{
    public class SportToCreateAndUpdateDto
    {
        public string Name { get; set; }

        public SportToCreateAndUpdateDto(string name) 
        {
            Name = name;
        }
    }
}