using System;

namespace ResultApp.WebApi.Models.League
{
    public class LeagueToReturnDto
    {
        public string Name { get; set; }
        public Guid SportId { get; set; }
        public Guid CountryId { get; set; }

        public LeagueToReturnDto(string name, Guid sportId, Guid countryId)
        {
            Name = name;
            SportId = sportId;
            CountryId = countryId;
        }
    }
}