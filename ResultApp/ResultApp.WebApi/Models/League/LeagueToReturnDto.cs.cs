using ResultApp.WebApi.Models.Country;
using ResultApp.WebApi.Models.Sport;
using System;

namespace ResultApp.WebApi.Models.League
{
    public class LeagueToReturnDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public Guid SportId { get; set; }
        public Guid CountryId { get; set; }
        public CountryToReturnDto Country { get; set; }
        public SportToReturnDto Sport { get; set; }

        public LeagueToReturnDto(Guid id, string name, Guid sportId, Guid countryId)
        {
            Id = id;
            Name = name;
            SportId = sportId;
            CountryId = countryId;
        }

        public LeagueToReturnDto(Guid id, string name, Guid sportId, Guid countryId, CountryToReturnDto country, SportToReturnDto sport)
        {
            Id = id;
            Name = name;
            SportId = sportId;
            CountryId = countryId;
            Country = country;
            Sport = sport;
        }
    }
}