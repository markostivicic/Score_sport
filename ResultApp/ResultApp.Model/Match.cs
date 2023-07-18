using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ResultApp.Model
{
    public class Match : Base
    {
        public Guid Id { get; set; }
        public int? HomeScore { get; set; } = null;
        public int? AwayScore { get; set; } = null;
        public DateTime Time { get; set; }
        public Guid LocationId { get; set; }
        public Guid ClubHomeId { get; set; }
        public Guid ClubAwayId { get; set; }

        public Match(Guid id, DateTime time, Guid locationId, Guid clubHomeId, Guid clubAwayId)
        {
            Id = id;
            Time = time;
            LocationId = locationId;
            ClubHomeId = clubHomeId;
            ClubAwayId = clubAwayId;
        }

        public Match(Guid id, DateTime time, Guid locationId, Guid clubHomeId, Guid clubAwayId, string createdByUserId) : base(createdByUserId)
        {
            Id = id;
            Time = time;
            LocationId = locationId;
            ClubHomeId = clubHomeId;
            ClubAwayId = clubAwayId;
        }

        public Match(Guid id, int? homeScore, int? awayScore, DateTime time, Guid locationId, Guid clubHomeId, Guid clubAwayId)
        {
            Id = id;
            HomeScore = homeScore;
            AwayScore = awayScore;
            Time = time;
            LocationId = locationId;
            ClubHomeId = clubHomeId;
            ClubAwayId = clubAwayId;
        }

        public Match(Guid id, int homeScore, int awayScore, DateTime time, Guid locationId, Guid clubHomeId, Guid clubAwayId, string createdByUserId) : base(createdByUserId)
        {
            Id = id;
            HomeScore = homeScore;
            AwayScore = awayScore;
            Time = time;
            LocationId = locationId;
            ClubHomeId = clubHomeId;
            ClubAwayId = clubAwayId;
        }

        public Match(Guid id, int homeScore, int awayScore, DateTime time, Guid locationId, Guid clubHomeId, Guid clubAwayId,
            string updatedByUserId, DateTime dateUpdated) : base(updatedByUserId, dateUpdated)
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
