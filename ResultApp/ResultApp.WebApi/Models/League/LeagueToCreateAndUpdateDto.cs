using System;

namespace ResultApp.WebApi.Models.League
{
    public class LeagueToCreateAndUpdateDto
    {
        public string Name { get; set; }
        public Guid? SportId { get; set; }
        public Guid? CountryId { get; set; }

        public LeagueToCreateAndUpdateDto(string name, Guid? sportId, Guid? countryId)
        {
            Name = name;
            SportId = sportId;
            CountryId = countryId;
        }
    }
}