using System;
using System.Collections.Generic;
using System.Linq;
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

        public MatchToReturnDto(Guid id, DateTime time, Guid locationId, Guid clubHomeId, Guid clubAwayId, int? homeScore, int? awayScore)
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