using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ResultApp.Common
{
    public class ClubFilter
    {
        public Guid? LeagueId { get; set; }
        public Guid? SportId { get; set; }
        public bool IsActive { get; set; }

        public ClubFilter(Guid? leagueId, Guid? sportId, bool isActive)
        {
            LeagueId = leagueId;
            SportId = sportId;
            IsActive = isActive;
        }
    }
}
