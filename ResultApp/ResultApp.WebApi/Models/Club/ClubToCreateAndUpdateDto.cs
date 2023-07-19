using System;

namespace ResultApp.WebApi.Models.Club
{
    public class ClubToCreateAndUpdateDto
    {
        public string Name { get; set; }
        public string Logo { get; set; }
        public Guid? LeagueId { get; set; }
        public Guid? LocationId { get; set; }

        public ClubToCreateAndUpdateDto(string name, string logo, Guid? leagueId, Guid? locationId)
        {
            Name = name;
            Logo = logo;
            LeagueId = leagueId;
            LocationId = locationId;
        }
    }
}