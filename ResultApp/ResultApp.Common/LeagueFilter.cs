using System;

namespace ResultApp.Common
{
    public class LeagueFilter
    {
        public Guid? SportId { get; set; }
        public bool IsActive { get; set; }

        public LeagueFilter(Guid? sportId, bool isActive)
        {
            SportId = sportId;
            IsActive = isActive;
        }
    }
}
