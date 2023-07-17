using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ResultApp.Model
{
    public class League : Base
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public Guid SportId { get; set; }
        public Guid CountryId { get; set; }

        public League(Guid id, string name, Guid sportId, Guid countryId)
        {
            Id = id;
            Name = name;
            SportId = sportId;
            CountryId = countryId;
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
