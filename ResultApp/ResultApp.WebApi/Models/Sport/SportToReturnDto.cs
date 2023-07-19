using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ResultApp.WebApi.Models.Sport
{
    public class SportToReturnDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; }

        public SportToReturnDto(Guid id, string name)
        {
            Id = id;
            Name = name;
        }
    }
}