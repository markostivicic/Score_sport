using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ResultApp.WebApi.Models.Location
{
    public class LocationToCreateAndUpdateDto
    {
        public string Name { get; set; }
        public string Address { get; set; }
        public Guid? CountryId { get; set; }

        public LocationToCreateAndUpdateDto(string name, string address, Guid? countryId)
        {
            Name = name;
            Address = address;
            CountryId = countryId;
        }
    }
}