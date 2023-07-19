using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ResultApp.Model
{
    public class League : Base, ILeague
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public Guid SportId { get; set; }
        public Guid CountryId { get; set; }
        public Country Country { get; set; }
        public Sport Sport { get; set; }

        public League(Guid id, string name, Guid sportId, Guid countryId)
        {
            Id = id;
            Name = name;
            SportId = sportId;
            CountryId = countryId;
        }

        public League(Guid id, string name, Guid sportId, Guid countryId, Country country, Sport sport)
        {
            Id = id;
            Name = name;
            SportId = sportId;
            CountryId = countryId;
            Country = country;
            Sport = sport;
        }

        public League(Guid id, string name, Guid sportId, Guid countryId, string createdByUserId) : base(createdByUserId)
        {
            Id = id;
            Name = name;
            SportId = sportId;
            CountryId = countryId;
        }

        public League(Guid id, string name, Guid sportId, Guid countryId, string updatedByUserId, DateTime dateUpdated) : base(updatedByUserId, dateUpdated)
        {
            Id = id;
            Name = name;
            SportId = sportId;
            CountryId = countryId;
        }
    }
}
