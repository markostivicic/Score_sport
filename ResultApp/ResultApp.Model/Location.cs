using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ResultApp.Model
{
    public class Location : Base, ILocation
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Address { get; set; }
        public Guid CountryId { get; set; }
        public Country Country { get; set; }

        public Location(Guid id, string name, string address, Guid countryId, Country country) 
        {
            Id = id;
            Name = name;
            Address = address;
            CountryId = countryId;
            Country = country;
        }

        public Location(Guid id, string name, string address, Guid countryId)
        {
            Id = id;
            Name = name;
            Address = address;
            CountryId = countryId;
        }

        public Location(Guid id, string name, string address, Guid countryId, string createdByUserId) : base(createdByUserId)
        {
            Id = id;
            Name = name;
            Address = address;
            CountryId = countryId;
        }

        public Location(Guid id, string name, string address, Guid countryId, string updatedByUserId, DateTime dateUpdated) : base(updatedByUserId, dateUpdated)
        {
            Id = id;
            Name = name;
            Address = address;
            CountryId = countryId;
        }
    }
}
