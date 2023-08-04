using System;
using ResultApp.WebApi.Models.Location;
using ResultApp.WebApi.Models.Club;
using System.Web;

namespace ResultApp.WebApi.Models.Match
{
    public class MatchToReturnDto
    {
        public Guid Id { get; set; }
        public int? HomeScore { get; set; }
        public int? AwayScore { get; set; }
        public DateTime Time { get; set; }
        public Guid LocationId { get; set; }
        public Guid ClubHomeId { get; set; }
        public Guid ClubAwayId { get; set; }
        public LocationToReturnDto Location { get; set; }
        public ClubToReturnDto ClubHome { get; set; }
        public ClubToReturnDto ClubAway { get; set; }

        public MatchToReturnDto(Guid id, int? homeScore, int? awayScore, DateTime time, Guid locationId, Guid clubHomeId, Guid clubAwayId, LocationToReturnDto location, ClubToReturnDto clubHome, ClubToReturnDto clubAway)
        {
            Id = id;
            HomeScore = homeScore;
            AwayScore = awayScore;
            Time = time;
            LocationId = locationId;
            ClubHomeId = clubHomeId;
            ClubAwayId = clubAwayId;
            Location = location;
            ClubHome = clubHome;
            ClubAway = clubAway;
        }

        public MatchToReturnDto(Guid id, int? homeScore, int? awayScore, DateTime time, Guid locationId, Guid clubHomeId, Guid clubAwayId)
        {
            Id = id;
            HomeScore = homeScore;
            AwayScore = awayScore;
            Time = time;
            LocationId = locationId;
            ClubHomeId = clubHomeId;
            ClubAwayId = clubAwayId;
        }

    }
}