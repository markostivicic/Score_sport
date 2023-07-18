using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ResultApp.Common
{
    public class MatchFilter
    {
        public Guid? ClubId { get; set; }
        public DateTime? Time { get; set; }
        public Guid? LeagueId { get; set; }
        public Guid? SportId { get; set; }
        public bool IsFinished { get; set; }
        public bool IsActive { get; set; }
        
        public MatchFilter(Guid? clubId, DateTime? time, Guid? leagueId, Guid? sportId, bool isFinished, bool isActive)
        {
            ClubId = clubId;
            Time = time;
            LeagueId = leagueId;
            SportId = sportId;
            IsFinished = isFinished;
            IsActive = isActive;
        }
    }
}
