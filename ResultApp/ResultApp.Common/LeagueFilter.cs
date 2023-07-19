using System;

namespace ResultApp.Common
{
    public class LeagueFilter
    {
        public string Name { get; set; }
        public Guid? SportId { get; set; }
        public bool IsActive { get; set; } = true;

    }
}
