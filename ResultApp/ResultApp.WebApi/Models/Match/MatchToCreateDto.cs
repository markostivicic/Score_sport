using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ResultApp.WebApi.Models.Match
{
    public class MatchToCreateDto
    {
        public DateTime Time { get; set; }
        public Guid LocationId { get; set; }
        public Guid ClubHomeId { get; set; }
        public Guid ClubAwayId { get; set; }
        public int? HomeScore { get; set; }
        public int? AwayScore { get; set; }
    }
}