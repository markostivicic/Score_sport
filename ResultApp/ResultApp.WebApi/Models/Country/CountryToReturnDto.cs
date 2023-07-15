using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ResultApp.WebApi.Models.Country
{
    public class CountryToReturnDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; }

        public CountryToReturnDto(Guid id, string name)
        {
            Id = id;
            Name = name;
        }
    }
}