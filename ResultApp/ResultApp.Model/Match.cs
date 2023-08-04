using System;

namespace ResultApp.Model
{
    public class Match : Base, IMatch
    {
        public Guid Id { get; set; }
        public int? HomeScore { get; set; } = null;
        public int? AwayScore { get; set; } = null;
        public DateTime Time { get; set; }
        public Guid LocationId { get; set; }
        public Guid ClubHomeId { get; set; }
        public Guid ClubAwayId { get; set; }
        public Location Location { get; set; }
        public Club ClubHome { get; set; }
        public Club ClubAway { get; set; }

        public Match(Guid id, DateTime time, Guid locationId, Guid clubHomeId, Guid clubAwayId)
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
        public Match(Guid id, int? homeScore, int? awayScore, DateTime time, Guid locationId, Guid clubHomeId, Guid clubAwayId, Location location, Club clubHome, Club clubAway)
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

        public Match(Guid id, DateTime time, Guid locationId, Guid clubHomeId, Guid clubAwayId, string createdByUserId, int? homeScore, int? awayScore) : base(createdByUserId)
        {
            Id = id;
            Time = time;
            LocationId = locationId;
            ClubHomeId = clubHomeId;
            ClubAwayId = clubAwayId;
            HomeScore = homeScore;
            AwayScore = awayScore;
        }

        public Match(Guid id, int? homeScore, int? awayScore, DateTime time, Guid locationId, Guid clubHomeId, Guid clubAwayId,
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
