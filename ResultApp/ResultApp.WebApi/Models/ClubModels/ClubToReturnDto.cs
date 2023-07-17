using System;

namespace ResultApp.WebApi.Models.ClubModels
{
    public class ClubToReturnDto
    {
        public string Name { get; set; }
        public string Logo { get; set; }
        public Guid LeagueId { get; set; }
        public Guid LocationId { get; set; }

        public ClubToReturnDto(string name, string logo, Guid leagueId, Guid locationId)
        {
            Name = name;
            Logo = logo;
            LeagueId = leagueId;
            LocationId = locationId;
        }
    }
}