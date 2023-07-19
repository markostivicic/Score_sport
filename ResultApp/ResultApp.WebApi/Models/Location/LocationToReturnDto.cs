using ResultApp.WebApi.Models.Country;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ResultApp.WebApi.Models.Location
{
    public class LocationToReturnDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Address { get; set; }
        public Guid CountryId { get; set; }
        public CountryToReturnDto Country { get; set; }

        public LocationToReturnDto(Guid id, string name, string address, Guid countryId)
        {
            Id = id;
            Name = name;
            Address = address;
            CountryId = countryId;
        }
        public LocationToReturnDto(Guid id, string name, string address, Guid countryId, CountryToReturnDto country)
        {
            Id = id;
            Name = name;
            Address = address;
            CountryId = countryId;
            Country = country;
        }
    }
}