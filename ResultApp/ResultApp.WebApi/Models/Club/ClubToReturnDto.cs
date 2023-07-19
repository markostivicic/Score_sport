using ResultApp.WebApi.Models.Location;
using ResultApp.WebApi.Models.League;
using System;

namespace ResultApp.WebApi.Models.Club
{
    public class ClubToReturnDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Logo { get; set; }
        public Guid LeagueId { get; set; }
        public Guid LocationId { get; set; }
        public LeagueToReturnDto League { get; set; }
        public LocationToReturnDto Location { get; set; }

        public ClubToReturnDto(Guid id, string name, string logo, Guid leagueId, Guid locationId)
        {
            Id = id;
            Name = name;
            Logo = logo;
            LeagueId = leagueId;
            LocationId = locationId;
        }
        public ClubToReturnDto(Guid id, string name, string logo, Guid leagueId, Guid locationId, LeagueToReturnDto league, LocationToReturnDto location)
        {
            Id = id;
            Name = name;
            Logo = logo;
            LeagueId = leagueId;
            LocationId = locationId;
            League = league;
            Location = location;
        }
    }
}