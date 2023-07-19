using ResultApp.WebApi.Models.Country;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ResultApp.WebApi.Models
{
    public class LocationToReturnDto
    {
        public string Name { get; set; }
        public string Address { get; set; }
        public Guid CountryId { get; set; }
        public CountryToReturnDto Country { get; set; }

        public LocationToReturnDto(string name, string address, Guid countryId, CountryToReturnDto country)
        {
            Name = name;
            Address = address;
            CountryId = countryId;
            Country = country;
        }
    }
}